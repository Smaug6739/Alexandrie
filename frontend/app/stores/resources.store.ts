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
        useNodesStore().nodes.set((request.result as Node).id, request.result as Node);
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
        useNodesStore().nodes.set(ressource.id, ressource as Node);
        return request.result as Node;
      } else throw request.message;
    },
    async delete(id: string) {
      const request = await makeRequest(`ressources/${id}`, 'DELETE', {});
      if (request.status == 'success') return useNodesStore().nodes.delete(id); // Remove the node from the cache
      else throw request.message;
    },
    // Loop through ids and delete them one by one
    // Only update the store after all deletions are successful
    // Return the list of deleted ids and failed ids
    async bulkDelete(ids: string[]) {
      const deletedIds: string[] = [];
      const failedIds: { id: string; message: string }[] = [];
      for (const id of ids) {
        try {
          const request = await makeRequest(`nodes/${id}`, 'DELETE', {});
          if (request.status === 'success') {
            deletedIds.push(id);
          } else {
            failedIds.push({ id, message: request.message || 'Unknown error' });
          }
        } catch (error) {
          failedIds.push({ id, message: (error as Error).message });
        }
      }
      // Update store
      deletedIds.forEach(id => {
        useNodesStore().nodes.delete(id);
      });
      return { deletedIds, failedIds };
    },
    clear() {
      this.ressources = [];
      this.isFetching = false;
    },
  },
});
