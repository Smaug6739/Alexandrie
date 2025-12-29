import { makeRequest } from './_utils';
import type { Node } from './db_strustures';
export const useRessourcesStore = defineStore('ressources', {
  state: () => ({}),
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
  },
});
