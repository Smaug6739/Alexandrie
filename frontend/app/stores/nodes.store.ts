import { makeRequest, type FetchOptions } from './_utils';
import { Collection } from './collection';
import type { DB_Node, Node, Permission } from './db_strustures';

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
  role?: 1 | 2 | 3 | 4;
}

export const useNodesStore = defineStore('nodes', {
  state: () => ({
    nodes: new Collection<string, Node>(),
    public_nodes: new Collection<string, Node>(),
    allTags: [] as string[],
    isFetching: false,
  }),
  getters: {
    getAll: state => state.nodes,
    getAllTags: state => state.allTags,
    getById: state => (id: string) => state.nodes.get(id),
    getByCategories: state => (category: string) => state.nodes.filter(d => d.parent_id == category),
    getParents: state => state.nodes.filter(c => !c.parent_id),
    getChilds: state => (id: string) => state.nodes.filter(c => c.parent_id == id),
    categories: state => state.nodes.filter(d => d.role === 1 || d.role === 2),
    documents: state => state.nodes.filter(d => d.role === 3),
    ressources: state => state.nodes.filter(d => d.role === 4),
    isDescendant:
      state =>
      (node: Node, descendantId: string): boolean => {
        const checkDescendants = (currentNode: Node): boolean => {
          const children = state.nodes.filter(d => d.parent_id === currentNode.id);
          for (const child of children) {
            if (child[0] === descendantId) return true;
            if (checkDescendants(child[1])) return true;
          }
          return false;
        };
        return checkDescendants(node);
      },
    getAllChildrens: state => (id: string) => {
      const parent = state.nodes.get(id);
      if (!parent) return [];
      const childrens: Node[] = [parent];
      const getChildrens = (parent: Node) => {
        state.nodes.forEach(node => {
          if (node.parent_id == parent.id) {
            childrens.push(node);
            getChildrens(node);
          }
        });
      };
      getChildrens(parent);
      return childrens;
    },
    getAllChildrensIds: state => (id: string) => {
      const childrens: string[] = [id];
      const getChildrens = (parent: Node) => {
        state.nodes.forEach(node => {
          if (node.parent_id == parent.id) {
            childrens.push(node.id);
            getChildrens(node);
          }
        });
      };
      const parent = state.nodes.get(id);
      if (parent) getChildrens(parent);
      return childrens;
    },
    search:
      state =>
      (options: SearchOptions, nodes = state.nodes.toArray()) => {
        const {
          query,
          fromDate,
          toDate,
          dateType = 'modified',
          tags,
          category,
          sortBy = 'modified',
          sortType = 'descending',
          matchMode = 'includes',
        } = options;

        const queryLower = query?.toLowerCase().trim();
        const hasQuery = Boolean(queryLower);
        const hasTags = tags && tags.length > 0;

        const filtered = nodes.filter(node => {
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
      },
    hasPermissions: state => (node: Node, level: number) => {
      // Case 1: User is the owner => All permissions
      // Case 2: User has a permission entry for this node
      // Case 3: A parent node has a permission entry for this node (inherited permissions)
      const userStore = useUserStore();
      if (node.user_id === userStore.user?.id) return true;
      if (node.accessibility === 3 && level <= node.access) return true;
      let permission = node.permissions.find(p => p.user_id === userStore.user?.id)?.permission || 0;
      let currentNode = node;
      while (permission < level && currentNode.parent_id) {
        const parentNode = state.nodes.get(currentNode.parent_id);
        if (!parentNode) break;
        if (parentNode.user_id === userStore.user?.id) return true; // owner of parent node
        const parentPerm = parentNode.permissions.find(p => p.user_id === userStore.user?.id);
        if (parentPerm && parentPerm.permission > permission) permission = parentPerm.permission;
        currentNode = parentNode;
      }
      return permission >= level;
    },
  },
  actions: {
    recomputeTags() {
      const tags = new Set<string>();
      this.nodes.forEach(node => {
        if (node.tags) {
          parseTags(node.tags).forEach(tag => tags.add(tag));
        }
        if (node.parent_id && !this.nodes.get(node.parent_id)) {
          node.parent_id = '';
        }
      });
      this.allTags = Array.from(tags).sort();
    },
    async fetch<T extends FetchOptions>(opts?: T): Promise<'id' extends keyof T ? Node : Collection<string, Node>> {
      if (opts?.id && !this.nodes.get(opts.id)?.partial) return this.nodes.get(opts.id) as 'id' extends keyof T ? Node : Collection<string, Node>;
      console.log(`[store/nodes] Fetching nodes with options: ${JSON.stringify(opts)}`);
      if (!this.nodes.size) this.isFetching = true;
      const request = await makeRequest(`nodes/@me/${opts?.id || ''}`, 'GET', {});
      this.isFetching = false;
      if (request.status == 'success') {
        if (opts?.id) {
          const result = request.result as { node: DB_Node; permissions: Permission[] };
          const n = this.nodes.get(opts.id);
          let shared = false;
          if (n) shared = n.shared;
          const updatedNode: Node = { ...(result.node as DB_Node), partial: false, shared: shared, permissions: result.permissions };
          if (!n) this.nodes.set(opts.id, updatedNode);
          else this.nodes.set(opts.id, updatedNode);
          return updatedNode as 'id' extends keyof T ? Node : Collection<string, Node>;
        } else {
          for (const node of request.result as DB_Node[]) {
            const n = this.nodes.get(node.id);
            if (!n) this.nodes.set(node.id, { ...node, partial: true, shared: false, permissions: [] });
            else this.nodes.set(node.id, { ...node, partial: true, shared: false, permissions: [] });
          }
          this.recomputeTags();
          return this.nodes as 'id' extends keyof T ? Node : Collection<string, Node>;
        }
      } else throw request;
    },
    async fetchPublic(id: string): Promise<Node | undefined> {
      console.log(`[store/nodes] Fetching public nodeument with id: ${id}`);
      const existingDoc = this.public_nodes.get(id);
      if (existingDoc) return existingDoc;
      const request = await makeRequest(`nodes/public/${id}`, 'GET', {});
      if (request.status === 'success') {
        const fetchedDoc: Node = { ...(request.result as DB_Node), partial: false, shared: false, permissions: [] };
        this.public_nodes.set(fetchedDoc.id, fetchedDoc);
        return fetchedDoc;
      } else return undefined;
    },
    async fetchShared(): Promise<Collection<string, Node>> {
      console.log(`[store/nodes] Fetching shared nodes`);
      if (this.nodes.size) return this.nodes;
      const request = await makeRequest(`nodes/shared/@me`, 'GET', {});
      if (request.status === 'success') {
        for (const node of request.result as DB_Node[]) {
          if (!this.nodes.has(node.id)) this.nodes.set(node.id, { ...node, partial: true, shared: true, permissions: node.permissions || [] });
          else {
            const state = this.nodes.get(node.id);
            this.nodes.set(node.id, { ...node, partial: true, shared: state?.shared ?? true, permissions: node.permissions || [] });
          }
        }
        return this.nodes;
      } else throw request;
    },

    async addPermission(perm: Omit<Permission, 'id' | 'created_timestamp'>): Promise<Permission> {
      console.log(`[store/nodes/permissions] Adding permission for user ${perm.user_id} on node ${perm.node_id}`);
      const node = this.nodes.get(perm.node_id);
      if (!node) throw 'Node not found in store, cannot add permission';
      const request = await makeRequest(`permissions`, 'POST', perm);
      if (request.status === 'success') {
        node.permissions.push(request.result as Permission);
        return request.result as Permission;
      } else throw request.message;
    },
    async updatePermission(perm: Permission) {
      console.log(`[store/nodes/permissions] Updating permission for user ${perm.user_id} on node ${perm.node_id}`);
      const node = this.nodes.get(perm.node_id);
      if (!node) throw 'Node not found in store, cannot update permission';
      const request = await makeRequest(`permissions/${perm.id}`, 'PATCH', { permission: perm.permission });
      if (request.status === 'success') {
        const index = node.permissions.findIndex(p => p.id === perm.id);
        if (index !== -1) node.permissions[index]!.permission = perm.permission;
      } else throw request.message;
    },
    async removePermission(nodeId: string, userId: string) {
      console.log(`[store/nodes/permissions] Removing permission for user ${userId} on node ${nodeId}`);
      const node = this.nodes.get(nodeId);
      if (!node) throw 'Node not found in store, cannot remove permission';
      const perm = node.permissions.find(p => p.user_id === userId);
      if (!perm) throw 'Permission not found in store, cannot remove permission';
      const request = await makeRequest(`permissions/${perm.id}`, 'DELETE', {});
      if (request.status === 'success') {
        node.permissions = node.permissions.filter(p => p.id !== perm.id);
      } else throw request.message;
    },
    async post(node: Partial<Node>): Promise<DB_Node> {
      const request = await makeRequest('nodes', 'POST', node);
      if (request.status == 'success') {
        this.nodes.set((request.result as DB_Node).id, { ...(request.result as DB_Node), partial: false, shared: false, permissions: [] });
        return request.result as DB_Node;
      } else throw request.message;
    },
    async update(node: Node) {
      if (node.partial) {
        console.log('[store/nodes] Node looks partial, cannot update it directly.');
        const full_node = await this.fetch({ id: node.id });
        if (!full_node) throw 'Node not found';
        node = mergeNode(node, full_node);
      }
      const request = await makeRequest(`nodes/${node.id}`, 'PUT', node);
      if (request.status == 'success') {
        this.nodes.set(node.id, node);
        return this.nodes;
      } else throw request.message;
    },
    async duplicate(node: Node): Promise<DB_Node> {
      if (!node) throw 'Node not found in store, cannot duplicate';
      if (node.partial) {
        console.log('[store/nodes] Node looks partial, cannot duplcate it directly.');
        const full_node = await this.fetch({ id: node.id });
        if (!full_node) throw 'Node not found';
        node = mergeNode(node, full_node);
      }
      // use the post method to duplicate the node
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
      const newNode = await this.post(newNodeData);
      return newNode;
    },
    async delete(id: string) {
      const request = await makeRequest(`nodes/${id}`, 'DELETE', {});
      if (request.status == 'success') {
        const allChildrens = this.getAllChildrensIds(id);
        this.nodes.delete(id);
        allChildrens.forEach(childId => this.nodes.delete(childId));
      } else throw request.message;
    },
  },
});

function parseTags(tags: string): string[] {
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);
  }
  return [];
}

function mergeNode(node: Node, full_node: Node): Node {
  const result: Node = { ...full_node };

  for (const key in node) {
    const localValue = node[key as keyof Node];
    if (localValue !== undefined && localValue !== null && localValue !== '') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result as any)[key] = localValue; // keep local value if it's defined
    }
  }

  result.partial = false;
  return result;
}
