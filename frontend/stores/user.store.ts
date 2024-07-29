import { defineStore } from 'pinia';
import { makeRequest } from './_utils';
import type { User, ConnectionLog } from './db_strustures';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: ref<User>(),
    last_connection: null as ConnectionLog | null,
  }),
  actions: {
    async login(username: string, password: string) {
      try {
        const response = await makeRequest<{ auth: boolean }>('auth', 'POST', { username, password });
        if (response.status == 'success' && response.result?.auth) {
          if (import.meta.client) localStorage.setItem('isLoggedIn', 'true');
          return true;
        }
      } catch (e) {
        return e;
      }
    },
    logout() {
      if (import.meta.client) localStorage.removeItem('isLoggedIn');
    },
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
