import { makeRequest } from './_utils';
import type { Node } from './db_strustures';
export const useResourcesStore = defineStore('resources', {
  state: () => ({}),
  actions: {
    async post(resource: FormData): Promise<Node> {
      const defaultUploadFolder = usePreferences().get('defaultUploadFolder').value;
      const nodesStore = useNodesStore();
      if (defaultUploadFolder && nodesStore.nodes.has(defaultUploadFolder)) {
        resource.append('parent_id', defaultUploadFolder);
      }
      const request = await makeRequest(`resources`, 'POST', resource);
      if (request.status == 'success') {
        nodesStore.nodes.set((request.result as Node).id, request.result as Node);
        return request.result as Node;
      } else throw request.message;
    },
    async postAvatar(resource: FormData): Promise<{ original_path: string; content_compiled: string }> {
      const request = await makeRequest(`resources/avatar`, 'POST', resource);
      if (request.status == 'success') {
        return request.result as { original_path: string; content_compiled: string };
      } else throw request.message;
    },
  },
});
