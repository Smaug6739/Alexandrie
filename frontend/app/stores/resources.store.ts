import { makeRequest } from './_utils';
import type { Node } from './db_strustures';
export const useRessourcesStore = defineStore('ressources', {
  state: () => ({
    ressources: [] as Node[],
    isFetching: false,
  }),
  getters: {
    getAll: state => state.ressources,
    getById: state => (id: string) => state.ressources.find(c => c.id == id),
  },
  actions: {
    async post(ressource: FormData): Promise<Node> {
      const request = await makeRequest(`ressources`, 'POST', ressource);
      if (request.status == 'success') {
        useNodesStore().nodes.push(request.result as Node);
        return request.result as Node;
      } else throw request.message;
    },
    async postAvatar(ressource: FormData): Promise<{ original_path: string; content_compiled: string }> {
      const request = await makeRequest(`ressources/avatar`, 'POST', ressource);
      if (request.status == 'success') {
        return request.result as { original_path: string; content_compiled: string };
      } else throw request.message;
    },
    async update(ressource: Node): Promise<Node | string> {
      const request = await makeRequest(`ressources/${ressource.id}`, 'PUT', ressource);
      if (request.status == 'success') {
        const index = useNodesStore().nodes.findIndex(c => c.id == ressource.id);
        if (index != -1) useNodesStore().nodes[index] = ressource as Node;
        return request.result as Node;
      } else throw request.message;
    },
    async delete(id: string) {
      const request = await makeRequest(`ressources/${id}`, 'DELETE', {});
      if (request.status == 'success') return (useNodesStore().nodes = useNodesStore().nodes.filter(c => c.id != id));
      else throw request.message;
    },
  },
});
