import { defineStore } from 'pinia';
import { makeRequest, type FetchOptions } from './_utils';
import { Collection } from './collection';
import type { DB_Node, Node, Permission } from './db_strustures';
import { useUserStore } from './user.store';

// Helper function
function parseTags(tags: string): string[] {
  return tags
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

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
    public_nodes: new Collection<string, Node>(),
    allTags: [] as string[],
    isFetching: false,
    // New state for tab management
    openTabs: [] as { id: string; path: string; title: string }[],
    activeTabId: null as string | null,
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
    // New getter to get the node currently active in the tab system
    getActiveNode: state => {
      if (!state.activeTabId) return undefined;
      return state.nodes.get(state.activeTabId);
    },
    isDescendant:
      state =>
      (node: Node, descendantId: string): boolean => {
        if (node.id === descendantId) return true;
        const checkDescendants = (currentNode: Node): boolean => {
          const children = state.nodes.filter(d => d.parent_id === currentNode.id);
          for (const child of children) {
            if (child.id === descendantId) return true;
            if (checkDescendants(child)) return true;
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
    search: state => (options: SearchOptions) => {
      const { query, fromDate, toDate, dateType, tags, category } = options;
      let filtered = state.nodes.toArray().filter(n => n.role === 3); // Only documents
      if (query) {
        filtered = filtered.filter(node => {
          const nodeTagsString = node.tags ? parseTags(node.tags).join(' ') : '';
          const nodeContent = `${node.name} ${node.description} ${nodeTagsString}`.toLowerCase();
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
    // New actions for tab management
    openNote(note: { id: string; path: string; title: string }) {
      const isAlreadyOpen = this.openTabs.some(tab => tab.id === note.id);
      if (!isAlreadyOpen) {
        this.openTabs.push(note);
      }
      this.setActiveTab(note.id);
    },
    closeNote(noteId: string) {
      const indexToClose = this.openTabs.findIndex(tab => tab.id === noteId);
      if (indexToClose === -1) return; // Tab not found

      // If the closed tab was active, determine the next active tab
      if (this.activeTabId === noteId) {
        if (this.openTabs.length <= 1) {
          this.activeTabId = null; // No tabs left
        } else {
          // Activate the tab to the left, or the new first tab if closing the first one
          const newIndex = Math.max(0, indexToClose - 1);
          this.activeTabId = this.openTabs[newIndex === indexToClose ? 0 : newIndex].id;
        }
      }

      // Remove the tab
      this.openTabs.splice(indexToClose, 1);
    },
    setActiveTab(noteId: string) {
      // Only set active if the tab is actually open
      if (this.openTabs.some(tab => tab.id === noteId)) {
        this.activeTabId = noteId;
      }
    },

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
      if (opts?.id && !this.nodes.get(opts.id)?.partial) {
        return this.nodes.get(opts.id) as 'id' extends keyof T ? Node : Collection<string, Node>;
      }
      console.log(`[store/nodes] Fetching nodes with options: ${JSON.stringify(opts)}`);
      if (!this.nodes.size) this.isFetching = true;

      const request = await makeRequest(`nodes/@me/${opts?.id || ''}`, 'GET', {});
      this.isFetching = false;

      if (request.status === 'success') {
        if (opts?.id) {
          const result = request.result as { node: DB_Node; permissions: Permission[] };
          const existingNode = this.nodes.get(opts.id);
          const updatedNode: Node = {
            ...existingNode,
            ...(result.node as DB_Node),
            partial: false,
            permissions: result.permissions,
          };
          this.nodes.set(opts.id, updatedNode);
          return updatedNode as 'id' extends keyof T ? Node : Collection<string, Node>;
        } else {
          const results = request.result as { node: DB_Node; permissions: Permission[] }[];
          for (const item of results) {
            const node: Node = {
              ...(item.node as DB_Node),
              partial: true,
              shared: false, // Default value, can be updated later
              permissions: item.permissions,
            };
            this.nodes.set(node.id, node);
          }
          this.recomputeTags();
        }
      } else {
        console.error(`[store/nodes] Failed to fetch nodes:`, request.message);
      }

      if (opts?.id) {
        return this.nodes.get(opts.id) as 'id' extends keyof T ? Node : Collection<string, Node>;
      } else {
        return this.nodes as 'id' extends keyof T ? Node : Collection<string, Node>;
      }
    },
  },
});