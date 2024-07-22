import { defineStore } from 'pinia';
import type { User, ConnectionLog } from './db_strustures'; // Assurez-vous d'avoir les bonnes définitions de types

export const useUserStore = defineStore('user', {
  state: () => ({
    user: ref<User>(),
    last_connection: null as ConnectionLog | null,
  }),
  actions: {
    fetch() {
      return new Promise(async (resolve, reject) => {
        const responce = await makeRequest<{ user: User; last_connection: ConnectionLog }>(`users/@me`, 'GET', {});
        if (responce.status === 'success') {
          if (responce.result?.user) this.user = responce.result.user as User;
          if (responce.result?.last_connection) this.last_connection = responce.result.last_connection as ConnectionLog;
          return resolve(this.user);
        } else reject(responce.message);
      });
    },
    update(user: User) {
      return new Promise(async (resolve, reject) => {
        if (!this.user) return;
        const request = await makeRequest(`users/${user.id}`, 'PATCH', user);
        if (request.status === 'success') {
          this.user = request.result as User;
          return resolve(this.user);
        } else reject(request.message);
      });
    },
    updatePassword(newPassword: string) {
      return new Promise(async (resolve, reject) => {
        if (!this.user) return;
        const request = await makeRequest(`users/${this.user.id}/password`, 'PATCH', { password: newPassword });
        if (request.status === 'success') {
          this.user = request.result as User;
          return resolve(this.user);
        } else reject(request.message);
      });
    },
  },
});
