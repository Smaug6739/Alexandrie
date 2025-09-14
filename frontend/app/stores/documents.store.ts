import { makeRequest, type FetchOptions } from './_utils';
import type { DB_Node, Node } from './db_strustures';

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
    nodes: [] as Array<Node | Node>,
    public_nodes: [] as Node[],
    allTags: [] as string[],
    isFetching: false,
  }),
  getters: {
    getAll: state => state.nodes,
    getAllTags: state => state.allTags,
    getById: state => (id: string) => state.nodes.find((d: Node) => d.id == id),
    getByCategories: state => (category: string) => state.nodes.filter(d => d.parent_id == category),
    getParents: state => state.nodes.filter(c => !c.parent_id),
    getChilds: state => (id: string) => state.nodes.filter(c => c.parent_id == id),
    categories: state => state.nodes.filter(d => d.role === 1 || d.role === 2),
    documents: state => state.nodes.filter(d => d.role === 3),
    ressources: state => state.nodes.filter(d => d.role === 4),

    getNext: state => (node?: Node) => {
      const cnodes = state.nodes.filter(d => d.parent_id == node?.parent_id);
      const index = cnodes.findIndex(d => d.id == node?.id);
      if (index == -1) return;
      return cnodes[index + 1];
    },

    getPrevious: state => (node?: Node) => {
      const cnodes = state.nodes.filter(d => d.parent_id == node?.parent_id);
      const index = cnodes.findIndex(d => d.id == node?.id);
      if (index == -1) return;
      return cnodes[index - 1];
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
      let filtered = [...state.nodes];
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
  },
  actions: {
    recomputeTags() {
      const tags = new Set<string>();
      this.nodes.forEach(node => {
        if (node.tags) {
          parseTags(node.tags).forEach(tag => tags.add(tag));
        }
      });
      this.allTags = Array.from(tags).sort();
    },
    async fetch<T extends FetchOptions>(opts?: T): Promise<'id' extends keyof T ? Node : Node[]> {
      console.log(`[store/nodes] Fetching nodes with options: ${JSON.stringify(opts)}`);
      if (!this.nodes.length) this.isFetching = true;
      const request = await makeRequest(`nodes/@me/${opts?.id || ''}`, 'GET', {});
      this.isFetching = false;
      if (request.status == 'success') {
        if (opts?.id) {
          const index = this.nodes.findIndex(d => d.id == opts?.id);
          const updatedNode: Node = { ...(request.result as DB_Node), partial: false };
          if (index == -1) this.nodes.push(updatedNode);
          else this.nodes[index] = updatedNode;
          return updatedNode as 'id' extends keyof T ? Node : Node[];
        } else {
          this.nodes = (request.result as DB_Node[]).map((d: DB_Node) => ({ ...d, partial: true }));
          this.recomputeTags();
          return this.nodes as 'id' extends keyof T ? Node : Node[];
        }
      } else throw request;
    },
    async fetchPublic(id: string): Promise<Node | undefined> {
      console.log(`[store/nodes] Fetching public nodeument with id: ${id}`);
      const existingDoc = this.public_nodes.find(d => d.id === id);
      if (existingDoc) return existingDoc;
      const request = await makeRequest(`nodes/public/${id}`, 'GET', {});
      if (request.status === 'success') {
        const fetchedDoc: Node = { ...(request.result as DB_Node), partial: false };
        this.public_nodes.push(fetchedDoc);
        return fetchedDoc;
      } else return undefined;
    },
    async post(node: Partial<Node>): Promise<DB_Node> {
      const request = await makeRequest('nodes', 'POST', node);
      if (request.status == 'success') {
        this.nodes.push({ ...(request.result as DB_Node), partial: false });
        return request.result as DB_Node;
      } else throw request.message;
    },

    async update(node: Node) {
      if (node.partial) {
        console.log('[store/nodes] Node is partial, cannot update it directly.');
        const full_node = await this.fetch({ id: node.id });
        if (!full_node) throw 'Node not found';
        node = { ...full_node, ...node, partial: false }; // Merge with full nodeument data
      }
      const request = await makeRequest(`nodes/${node.id}`, 'PUT', node);
      if (request.status == 'success') return (this.nodes = this.nodes.map(d => (d.id == node.id ? node : d)));
      else throw request.message;
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
