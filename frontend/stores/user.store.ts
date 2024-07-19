import { defineStore } from 'pinia';
import type { User } from './db_strustures'; // Assurez-vous d'avoir les bonnes définitions de types

export const useUserStore = defineStore('user', {
  state: () => ({
    user: ref<User | null>(null),
  }),
  actions: {
    fetch() {
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest(`users/@me`, 'GET', {});
        if (request.status === 'success') {
          this.user = request.result as User;
          return resolve(this.user);
        } else reject(request.message);
      });
    },
  },
});
