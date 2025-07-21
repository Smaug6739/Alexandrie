import { makeRequest } from './_utils';
import type { DB_Ressource, Ressource } from './db_strustures';

export const useRessourcesStore = defineStore('ressources', {
  state: () => ({
    ressources: ref<Ressource[]>([]),
  }),
  getters: {
    getAll: state => state.ressources,
    getById: state => (id: string) => state.ressources.find(c => c.id == id),
  },
  actions: {
    fetch: function () {
      if (this.ressources.length > 0) return this.ressources;
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest(`ressources/@me`, 'GET', {});
        if (request.status == 'success') {
          this.ressources = (request.result as DB_Ressource[]).map((d: DB_Ressource) => ({ ...d, type: 'ressource' })) as Ressource[];
          resolve(this.ressources);
        } else reject(request.message);
      });
    },
    post(ressource: FormData): Promise<Ressource | string> {
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest(`ressources`, 'POST', ressource);
        if (request.status == 'success') {
          this.ressources.push(request.result as Ressource);
          resolve(request.result as Ressource);
        } else reject(request.message);
      });
    },
    postAvatar(ressource: FormData): Promise<{ original_path: string; transformed_path: string }> {
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest(`ressources/avatar`, 'POST', ressource);
        if (request.status == 'success') {
          resolve(request.result as { original_path: string; transformed_path: string });
        } else reject(request.message);
      });
    },
    update(ressource: Ressource): Promise<Ressource | string> {
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest(`ressources/${ressource.id}`, 'PUT', ressource);
        if (request.status == 'success') {
          const index = this.ressources.findIndex(c => c.id == ressource.id);
          if (index != -1) this.ressources[index] = ressource as Ressource;
          resolve(request.result as Ressource);
        } else reject(request.message);
      });
    },
    delete(id: string) {
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest(`ressources/${id}`, 'DELETE', {});
        if (request.status == 'success') resolve((this.ressources = this.ressources.filter(c => c.id != id)));
        else reject(request.message);
      });
    },
  },
});
