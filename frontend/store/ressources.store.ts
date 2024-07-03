import { defineStore } from 'pinia';
import type { DB_Ressource } from './db_strustures';
export const useRessourcesStore = defineStore('ressources', {
  state: () => ({
    ressources: [] as DB_Ressource[],
  }),
  getters: {
    getAll: state => state.ressources,
  },
  actions: {
    fetch: async function () {
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest(`ressources`, 'GET', {});
        if (request.status == 'success') {
          this.ressources = request.result as DB_Ressource[];
          resolve(this.ressources);
        } else reject(request.message);
      });
    },
    post(ressource: DB_Ressource) {
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest(`ressources`, 'POST', ressource);
        if (request.status == 'success') resolve(this.ressources.push(request.result as DB_Ressource));
        else reject(request.message);
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
