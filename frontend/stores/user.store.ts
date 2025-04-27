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
        if (response.status == 'success') {
          if (import.meta.client) localStorage.setItem('isLoggedIn', 'true');
          return true;
        } else throw response.message;
      } catch (e) {
        return e;
      }
    },

    register(user: Omit<User, 'id' | 'created_timestamp'>) {
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest('users', 'POST', user);
        request.status === 'success' ? resolve(true) : reject(request.message);
      });
    },
    fetch(): Promise<User | undefined> {
      return new Promise(async (resolve, reject) => {
        if (this.user) return resolve(this.user);
        const responce = await makeRequest<{ user: User; last_connection: ConnectionLog }>(`users/@me`, 'GET', {});
        if (responce.status === 'success') {
          if (responce.result) this.user = responce.result.user as User;
          if (responce.result?.last_connection) this.last_connection = responce.result.last_connection as ConnectionLog;
          return resolve(this.user);
        } else reject(responce.message);
      });
    },
    fetchById(id: string): Promise<User | undefined> {
      return new Promise(async (resolve, reject) => {
        const responce = await makeRequest<{ user: User }>(`users/${id}`, 'GET', {});
        if (responce.status === 'success') return resolve(responce.result?.user as User);
        else reject(responce.message);
      });
    },
    update(user: User) {
      return new Promise(async (resolve, reject) => {
        if (!this.user) return;
        const request = await makeRequest(`users/${user.id}`, 'PATCH', user);
        if (request.status === 'success') {
          if (this.user.id == user.id) this.user = request.result as User;
          return resolve(this.user);
        } else reject(request.message);
      });
    },
    updatePassword(newPassword: string) {
      return new Promise(async (resolve, reject) => {
        if (!this.user) return;
        const request = await makeRequest(`users/${this.user.id}/password`, 'PATCH', { password: newPassword });
        if (request.status === 'success') {
          return resolve(true);
        } else reject(request.message);
      });
    },
    logout() {
      return new Promise(async (resolve, reject) => {
        if (!this.user) return;
        const request = await makeRequest(`auth/logout`, 'POST', {});
        if (request.status === 'success') {
          return resolve(true);
        } else reject(request.message);
      });
    },
    logout_all() {
      return new Promise(async (resolve, reject) => {
        if (!this.user) return;
        const request = await makeRequest(`auth/logout/all`, 'POST', {});
        if (request.status === 'success') {
          return resolve(true);
        } else reject(request.message);
      });
    },
    deleteAccount() {
      return new Promise(async (resolve, reject) => {
        if (!this.user) return;
        const request = await makeRequest(`users/${this.user.id}`, 'DELETE', {});
        if (request.status === 'success') {
          this.user = undefined;
          return resolve(true);
        } else reject(request.message);
      });
    },
    post_logout() {
      this.user = undefined;
      if (import.meta.client) localStorage.removeItem('isLoggedIn');
    },
  },
});
