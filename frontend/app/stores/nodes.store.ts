import { IndexedCollection } from '~/helpers/IndexedCollection';
import { parseTags, mergeNode } from '~/helpers/node';
import { LocalDbService } from '~/services/localDB';
import { skipHydrate } from 'pinia';
import type { DB_Node, Node, NodeSearchResult, Permission, PublicNodeResponse } from './db_structures';

export type TeamRole = 0;
export type CategoryRole = 1 | 2;
export type DocumentRole = 3;
export type ResourceRole = 4;
export type NodeRole = TeamRole | CategoryRole | DocumentRole | ResourceRole;

export interface SearchOptions {
  query?: string;
  fromDate?: Date;
  toDate?: Date;
  dateType?: 'created' | 'modified';
  tags?: string[];
  category?: string;
  sortBy?: 'created' | 'modified' | 'name';
  sortType?: 'ascending' | 'descending';
  matchMode?: 'includes' | 'starts' | 'exact';
  role?: NodeRole;
}

export const useNodesStore = defineStore('nodes', () => {
  const userStore = useUserStore();

  const nodes = shallowRef(new IndexedCollection());
  const allTags = ref<string[]>([]);
  const isFetching = ref(false);

  const getAll = computed(() => nodes.value);
  const getAllTags = computed(() => allTags.value);
  const getById = computed(() => (id: string) => nodes.value.get(id));
  const getTotalUsedStorage = computed(() => nodes.value.toSortedArray().reduce((total, node) => total + (node.size || 0), 0));

  /* Getters for nodes by role */
  const teams = computed(() => nodes.value.getIdsByRole(0).map(id => nodes.value.get(id)!));
  const categories = computed(() => [...nodes.value.getIdsByRole(1), ...nodes.value.getIdsByRole(2)].map(id => nodes.value.get(id)!));
  const workspaces = computed(() => nodes.value.getIdsByRole(1).map(id => nodes.value.get(id)!));
  const documents = computed(() => nodes.value.getIdsByRole(3).map(id => nodes.value.get(id)!));
  const resources = computed(() => nodes.value.getIdsByRole(4).map(id => nodes.value.get(id)!));

  async function init() {
    console.log('[store/nodes] Initializing store');
    clear();
    await Promise.all([syncLocalDeltas(), fetch(), fetchShared()]);

    if (import.meta.client) {
      window.addEventListener('online', () => {
        console.log('[store/nodes] Online, syncing local deltas');
        syncLocalDeltas();
      });
    }
  }

  async function syncLocalDeltas() {
    const deltas = await LocalDbService.getDeltas();
    await LocalDbService.clearDeltas(); // Clear deltas before syncing to avoid duplicates in case of failure & reset counter
    for (const delta of deltas) {
      try {
        switch (delta.action) {
          case 'POST':
            await post(delta.node!);
            break;
          case 'PUT':
            await update(delta.node! as Node);
            break;
          case 'DELETE':
            await remove(delta.id);
            break;
        }
      } catch (error) {
        console.error(`[store/nodes] Failed to sync delta ${delta.action} for node ${delta.id}:`, error);
      }
    }
  }

  function recomputeTags() {
    const tags = new Set<string>();

    nodes.value.startBulk();

    nodes.value.forEach(node => {
      if (node.tags) {
        parseTags(node.tags).forEach(tag => tags.add(tag));
      }
      if (node.parent_id && !nodes.value.get(node.parent_id)) {
        nodes.value.set(node.id, { ...node, parent_id: '' });
      }
    });

    nodes.value.endBulk();
    allTags.value = Array.from(tags).sort();
  }

  // Check if a node (descendantId) is a descendant of another node
  const isDescendant = (parent: Node, descendantId: string): boolean => {
    let current = nodes.value.get(descendantId);
    while (current?.parent_id) {
      if (current.parent_id === parent.id) return true;
      current = nodes.value.get(current.parent_id);
    }
    return false;
  };
  // Get all descendant IDs of a node
  const getDescendantIds = (id: string): string[] => {
    const result: string[] = [];
    const queue: string[] = [id];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const childrenIds = nodes.value.getChildrenIds(currentId);
      for (const childId of childrenIds) {
        result.push(childId);
        queue.push(childId);
      }
    }
    return result;
  };

  const search = (options: SearchOptions, nodesToSearch: Node[] | readonly Node[] = nodes.value.toSortedArray()) => {
    const { query, fromDate, toDate, dateType = 'modified', tags, category, sortBy = 'modified', sortType = 'descending', matchMode = 'includes' } = options;

    const queryLower = query?.toLowerCase().trim();
    const hasQuery = Boolean(queryLower);
    const hasTags = tags && tags.length > 0;

    const filtered = nodesToSearch.filter(node => {
      // --- Filter by role ---
      if (options.role && node.role !== options.role) return false;
      // --- Filter by text search ---
      if (hasQuery) {
        const content = `${node.name ?? ''} ${node.description ?? ''} ${node.tags ?? ''}`.toLowerCase();
        switch (matchMode) {
          case 'starts':
            if (!content.startsWith(queryLower!)) return false;
            break;
          case 'exact':
            if (node.name.toLowerCase() !== queryLower) return false;
            break;
          default: // includes
            if (!content.includes(queryLower!)) return false;
        }
      }

      // --- Filter by dates ---
      if (fromDate || toDate) {
        const timestamp = dateType === 'created' ? node.created_timestamp : node.updated_timestamp;
        const nodeDate = new Date(timestamp);
        if (fromDate && nodeDate < fromDate) return false;
        if (toDate && nodeDate > toDate) return false;
      }

      // --- Filter by tags ---
      if (hasTags) {
        if (!node.tags) return false;
        const nodeTags = parseTags(node.tags);
        // All tags must match
        if (!tags!.some(tag => nodeTags.includes(tag))) return false;
      }

      // --- Filter by category ---
      if (category && node.parent_id !== category) return false;

      return true;
    });

    // --- Sort results ---
    filtered.sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      switch (sortBy) {
        case 'created':
          valA = new Date(a.created_timestamp).getTime();
          valB = new Date(b.created_timestamp).getTime();
          break;
        case 'modified':
          valA = new Date(a.updated_timestamp).getTime();
          valB = new Date(b.updated_timestamp).getTime();
          break;
        case 'name':
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
      }

      if (valA < valB) return sortType === 'ascending' ? -1 : 1;
      if (valA > valB) return sortType === 'ascending' ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  async function fetch<T extends FetchOptions>(opts?: T): Promise<'id' extends keyof T ? Node : IndexedCollection> {
    if (opts?.id && !nodes.value.get(opts.id)?.partial) return nodes.value.get(opts.id) as 'id' extends keyof T ? Node : IndexedCollection;
    console.log(`[store/nodes] Fetching nodes with options: ${JSON.stringify(opts)}`);
    if (!nodes.value.size) isFetching.value = true;
    const request = await makeRequest(`nodes/${opts?.id ? opts.id : 'user/@me'}`, 'GET', {});
    isFetching.value = false;
    if (request.status == 'success') {
      if (opts?.id) {
        const result = request.result as { node: DB_Node; permissions: Permission[] };
        const n = nodes.value.get(opts.id);
        let shared = false;
        if (n) shared = n.shared;
        // Check for orphaned parent_id and detach if necessary
        let finalParentId = result.node.parent_id;
        if (finalParentId && !nodes.value.has(finalParentId)) {
          finalParentId = '';
        }

        const updatedNode: Node = {
          ...(result.node as DB_Node),
          parent_id: finalParentId,
          partial: false,
          synced: true,
          shared: shared,
          permissions: result.permissions,
        };
        if (!n) nodes.value.set(opts.id, updatedNode);
        else nodes.value.set(opts.id, updatedNode);
        return updatedNode as 'id' extends keyof T ? Node : IndexedCollection;
      } else {
        if (!request.result) return nodes.value as 'id' extends keyof T ? Node : IndexedCollection;
        nodes.value.startBulk();
        for (const node of request.result as DB_Node[]) {
          const n = nodes.value.get(node.id);
          if (!n) nodes.value.set(node.id, { ...node, partial: true, synced: true, shared: false, permissions: [] });
          else nodes.value.set(node.id, { ...node, partial: true, synced: true, shared: false, permissions: [] });
        }
        nodes.value.endBulk();
        recomputeTags();
        return nodes.value as 'id' extends keyof T ? Node : IndexedCollection;
      }
    } else throw request.message;
  }

  async function fetchPublic(id: string): Promise<{ node: Node; children: Node[] } | undefined> {
    console.log(`[store/nodes] Fetching public node with id: ${id}`);
    const request = await makeRequest(`nodes/public/${id}`, 'GET', {});
    if (request.status === 'success') {
      const response = request.result as PublicNodeResponse;
      const children: Node[] = (response.children || []).map(c => ({ ...c, partial: true, shared: false, permissions: [] }));
      const fetchedDoc: Node & { _children?: Node[] } = {
        ...response.node,
        partial: false,
        shared: false,
        permissions: [],
        _children: children,
      };
      return { node: fetchedDoc, children };
    } else return undefined;
  }

  async function fetchShared(): Promise<IndexedCollection> {
    console.log(`[store/nodes] Fetching shared nodes`);
    const request = await makeRequest(`nodes/shared/@me`, 'GET', {});
    if (request.status === 'success') {
      if (!request.result) return nodes.value as IndexedCollection;
      nodes.value.startBulk();
      for (const node of request.result as DB_Node[]) {
        let finalParentId = node.parent_id;
        if (finalParentId && !nodes.value.has(finalParentId)) {
          finalParentId = '';
        }
        if (!nodes.value.has(node.id))
          nodes.value.set(node.id, { ...node, parent_id: finalParentId, partial: true, synced: true, shared: true, permissions: node.permissions || [] });
        else {
          const state = nodes.value.get(node.id);
          nodes.value.set(node.id, {
            ...node,
            parent_id: finalParentId,
            partial: true,
            synced: true,
            shared: state?.shared ?? true,
            permissions: node.permissions || [],
          });
        }
      }
      nodes.value.endBulk();
      return nodes.value as IndexedCollection;
    } else throw request;
  }
  /**
   * Performs a fulltext search on the server using MySQL FULLTEXT index
   * This is optimized for searching in document content (body)
   * @param query - Search query (min 2 characters)
   * @param includeContent - Whether to search in document body content
   * @param limit - Max results to return
   */
  async function searchFulltext(query: string, includeContent = true, limit = 20): Promise<NodeSearchResult[]> {
    if (query.length < 2) return [];
    const params = new URLSearchParams({
      q: query,
      content: includeContent.toString(),
      limit: limit.toString(),
    });
    const request = await makeRequest(`nodes/search?${params.toString()}`, 'GET', {});
    if (request.status === 'success') {
      return request.result as NodeSearchResult[];
    }
    console.error('[store/nodes] Fulltext search failed:', request.message);
    return [];
  }

  async function post(node: Partial<Node>): Promise<DB_Node> {
    const oldId = node.id;
    delete node.id;
    const response = await makeRequest<DB_Node>('nodes', 'POST', { ...node, id: undefined });
    if (response.status == 'success') {
      nodes.value.set((response.result as DB_Node).id, { ...(response.result as DB_Node), partial: false, synced: true, shared: false, permissions: [] });
      return response.result as DB_Node;
    } else if (isNetworkError(response)) {
      node.user_id = userStore.user?.id;
      const localNode = await LocalDbService.saveCreateDelta({ ...node, id: oldId });
      nodes.value.set(localNode.id, localNode);
      return localNode;
    }
    throw response.message || 'Failed to create node';
  }

  async function update(node: Node): Promise<void> {
    if (node.partial) {
      console.log('[store/nodes] Node looks partial, cannot update it directly.');
      const full_node = await fetch({ id: node.id });
      if (!full_node) throw 'Node not found';
      node = mergeNode(node, full_node);
    }
    const response = await makeRequest(`nodes/${node.id}`, 'PUT', node);
    if (response.status == 'success') {
      node.updated_timestamp = Date.now(); // approximate update time for better UX & backups import
      node.synced = true;
      if (node.parent_id && !nodes.value.has(node.parent_id)) node.parent_id = ''; // Check for orphaned parent_id and detach if necessary
      nodes.value.set(node.id, node);
    } else if (isNetworkError(response)) {
      await LocalDbService.saveUpdateDelta(node);
      node.synced = false;
      nodes.value.set(node.id, node);
    }
  }

  async function duplicate(node: Node): Promise<DB_Node> {
    if (!node) throw 'Node not found in store, cannot duplicate';
    if (node.partial) {
      console.log('[store/nodes] Node looks partial, cannot duplcate it directly.');
      const full_node = await fetch({ id: node.id });
      if (!full_node) throw 'Node not found';
      node = mergeNode(node, full_node);
    }
    const newNodeData: Partial<Node> = {
      name: node.name,
      description: node.description,
      role: node.role,
      parent_id: node.parent_id,
      tags: node.tags,
      accessibility: node.accessibility,
      access: node.access,
      content: node.content,
      content_compiled: node.content_compiled,
    };
    const newNode = await post(newNodeData);
    return newNode;
  }

  async function remove(id: string) {
    const response = await makeRequest(`nodes/${id}`, 'DELETE', {});
    if (response.status == 'success') {
      //
    } else if (isNetworkError(response)) {
      await LocalDbService.saveDeleteDelta(id);
    }
    const allChildrens = getDescendantIds(id);
    nodes.value.delete(id);
    allChildrens.forEach(childId => nodes.value.delete(childId));
  }

  async function bulkDelete(toDelete: Node[]) {
    const deletedIds: string[] = [];
    const failedIds: { id: string; message: string }[] = [];
    for (const node of toDelete) {
      const response = await makeRequest(`nodes/${node.id}`, 'DELETE', {});
      if (response.status === 'success') {
        deletedIds.push(node.id);
      } else if (isNetworkError(response)) {
        await LocalDbService.saveDeleteDelta(node.id);
        deletedIds.push(node.id);
      } else {
        failedIds.push({ id: node.id, message: response.message || 'Unknown error' });
      }
    }
    // Update store
    nodes.value.startBulk();
    deletedIds.forEach(id => {
      const allChildrens = getDescendantIds(id);
      nodes.value.delete(id);
      allChildrens.forEach(childId => nodes.value.delete(childId));
    });
    nodes.value.endBulk();
    return { deletedIds, failedIds };
  }

  function clear() {
    nodes.value.clear();
    allTags.value = [];
    isFetching.value = false;
  }

  return {
    nodes: skipHydrate(nodes),
    allTags,
    isFetching,
    getAll,
    getAllTags,
    getById,
    getTotalUsedStorage,
    teams,
    categories,
    workspaces,
    documents,
    resources,
    isDescendant,
    getDescendantIds,
    search,
    init,
    recomputeTags,
    fetch,
    fetchPublic,
    fetchShared,
    searchFulltext,
    post,
    update,
    duplicate,
    remove,
    bulkDelete,
    clear,
  };
});
