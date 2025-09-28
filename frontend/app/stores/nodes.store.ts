import { makeRequest, type FetchOptions } from './_utils';
import { Collection } from './collection';
import type { DB_Node, Node, Permission } from './db_strustures';

interface SearchOptions {
  query?: string;
  fromDate?: Date;
  toDate?: Date;
  dateType?: 'created' | 'modified';
  tags?: string[];
  category?: string;
}

export const useNodesStore = defineStore('nodes', {
  state: () => ({
    nodes: new Collection<string, Node>(),
    public_nodes: [] as Node[],
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
    getNext: state => (node?: Node) => {
      if (!node) return state.nodes.first();
      return state.nodes.next(node.id);
    },

    getPrevious: state => (node?: Node) => {
      if (!node) return state.nodes.last();
      return state.nodes.previous(node.id);
    },

    getAllChildrens: state => (id: string) => {
      const parent = state.nodes.find(d => d.id == id);
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
      const parent = state.nodes.find(d => d.id == id);
      if (parent) getChildrens(parent);
      return childrens;
    },
    search: state => (options: SearchOptions) => {
      const { query, fromDate, toDate, dateType, tags, category } = options;
      let filtered = state.nodes.toArray()!;
      if (query) {
        filtered = filtered.filter(node => {
          const nodeContent = `${node.name} ${node.description} ${node.tags}`.toLowerCase();
          return nodeContent.includes(query.toLowerCase());
        });
      }

      if (fromDate) {
        filtered = filtered.filter(node => {
          const nodeDate = new Date(node[dateType === 'created' ? 'created_timestamp' : 'updated_timestamp']);
          return nodeDate >= fromDate;
        });
      }

      if (toDate) {
        filtered = filtered.filter(node => {
          const nodeDate = new Date(node[dateType === 'created' ? 'created_timestamp' : 'updated_timestamp']);
          return nodeDate <= toDate;
        });
      }

      if (tags && tags.length > 0) {
        filtered = filtered.filter(node => {
          if (!node.tags) return false;
          const nodeTags = parseTags(node.tags);
          return tags.some(tag => nodeTags.includes(tag));
        });
      }

      if (category) {
        filtered = filtered.filter(node => node.parent_id === category);
      }

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
        const parentNode = state.nodes.find(n => n.id === currentNode.parent_id);
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
        if (node.parent_id && !this.nodes.find(n => n.id === node.parent_id)) {
          node.parent_id = '';
        }
      });
      this.allTags = Array.from(tags).sort();
    },
    async fetch<T extends FetchOptions>(opts?: T): Promise<'id' extends keyof T ? Node : Collection<string, Node>> {
      if (opts?.id && this.nodes.find(d => d.id == opts.id && !d.partial))
        return this.nodes.find(d => d.id == opts.id) as 'id' extends keyof T ? Node : Collection<string, Node>;
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
      const existingDoc = this.public_nodes.find(d => d.id === id);
      if (existingDoc) return existingDoc;
      const request = await makeRequest(`nodes/public/${id}`, 'GET', {});
      if (request.status === 'success') {
        const fetchedDoc: Node = { ...(request.result as DB_Node), partial: false, shared: false, permissions: [] };
        this.public_nodes.push(fetchedDoc);
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
      const node = this.nodes.find(n => n.id === perm.node_id);
      if (!node) throw 'Node not found in store, cannot add permission';
      const request = await makeRequest(`permissions`, 'POST', perm);
      if (request.status === 'success') {
        node.permissions.push(request.result as Permission);
        return request.result as Permission;
      } else throw request.message;
    },
    async updatePermission(perm: Permission) {
      console.log(`[store/nodes/permissions] Updating permission for user ${perm.user_id} on node ${perm.node_id}`);
      const node = this.nodes.find(n => n.id === perm.node_id);
      if (!node) throw 'Node not found in store, cannot update permission';
      const request = await makeRequest(`permissions/${perm.id}`, 'PATCH', { permission: perm.permission });
      if (request.status === 'success') {
        const index = node.permissions.findIndex(p => p.id === perm.id);
        if (index !== -1) node.permissions[index]!.permission = perm.permission;
      } else throw request.message;
    },
    async removePermission(nodeId: string, userId: string) {
      console.log(`[store/nodes/permissions] Removing permission for user ${userId} on node ${nodeId}`);
      const node = this.nodes.find(n => n.id === nodeId);
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
    async delete(id: string) {
      const request = await makeRequest(`nodes/${id}`, 'DELETE', {});
      if (request.status == 'success') return (this.nodes = this.nodes.filter(d => d.id != id));
      else throw request.message;
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
