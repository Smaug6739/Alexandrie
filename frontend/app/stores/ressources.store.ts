import { makeRequest } from './_utils';
import type { DB_Ressource, Ressource } from './db_strustures';

export const useRessourcesStore = defineStore('ressources', {
  state: () => ({
    ressources: [] as Ressource[],
    isFetching: false,
  }),
  getters: {
    getAll: state => state.ressources,
    getById: state => (id: string) => state.ressources.find(c => c.id == id),
  },
  actions: {
    async fetch(): Promise<Ressource[]> {
      if (this.ressources.length > 0) return this.ressources;
      this.isFetching = true;
      const request = await makeRequest(`ressources/@me`, 'GET', {});
      this.isFetching = false;
      if (request.status == 'success') {
        this.ressources = (request.result as DB_Ressource[]).map((d: DB_Ressource) => ({ ...d, type: 'ressource' })) as Ressource[];
        return this.ressources;
      } else throw request.message;
    },
    async post(ressource: FormData): Promise<Ressource | string> {
      const request = await makeRequest(`ressources`, 'POST', ressource);
      if (request.status == 'success') {
        this.ressources.unshift(request.result as Ressource);
        return request.result as Ressource;
      } else throw request.message;
    },
    async postAvatar(ressource: FormData): Promise<{ original_path: string; transformed_path: string }> {
      const request = await makeRequest(`ressources/avatar`, 'POST', ressource);
      if (request.status == 'success') {
        return request.result as { original_path: string; transformed_path: string };
      } else throw request.message;
    },
    async update(ressource: Ressource): Promise<Ressource | string> {
      const request = await makeRequest(`ressources/${ressource.id}`, 'PUT', ressource);
      if (request.status == 'success') {
        const index = this.ressources.findIndex(c => c.id == ressource.id);
        if (index != -1) this.ressources[index] = ressource as Ressource;
        return request.result as Ressource;
      } else throw request.message;
    },
    async delete(id: string) {
      const request = await makeRequest(`ressources/${id}`, 'DELETE', {});
      if (request.status == 'success') return (this.ressources = this.ressources.filter(c => c.id != id));
      else throw request.message;
    },
  },
});
