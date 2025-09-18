import { makeRequest } from './_utils';
import type { User, PublicUser, ConnectionLog } from './db_strustures';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: ref<User>(),
    users: [] as PublicUser[],
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

    async register(user: Omit<User, 'id' | 'created_timestamp'>) {
      const request = await makeRequest('users', 'POST', user);
      if (request.status === 'success') return true;
      throw request.message;
    },
    async fetch(): Promise<User | undefined> {
      if (this.user) return this.user;
      const responce = await makeRequest<{ user: User; last_connection: ConnectionLog }>(`users/@me`, 'GET', {});
      if (responce.status === 'success') {
        if (responce.result) this.user = responce.result.user as User;
        if (responce.result?.last_connection) this.last_connection = responce.result.last_connection as ConnectionLog;
        return this.user;
      } else throw responce.message;
    },
    async fetchPublicUser(usernameOrEmailOrId: string): Promise<PublicUser> {
      const existingUser = this.users.find(u => u.id === usernameOrEmailOrId);
      if (existingUser) return existingUser;
      const responce = await makeRequest<PublicUser>(`users/public/${usernameOrEmailOrId}`, 'GET', {});
      if (responce.status === 'success') {
        const user = responce.result as PublicUser;
        if (!this.users.find(u => u.id === user.id)) this.users.push(user);
        return user;
      }
      throw responce.message;
    },
    async fetchById(id: string): Promise<User | undefined> {
      const responce = await makeRequest<{ user: User }>(`users/${id}`, 'GET', {});
      if (responce.status === 'success') return responce.result?.user as User;
      throw responce.message;
    },
    async update(user: User) {
      if (!this.user) return;
      const request = await makeRequest(`users/${user.id}`, 'PATCH', user);
      if (request.status === 'success') {
        if (this.user.id == user.id) this.user = request.result as User;
        return this.user;
      } else throw request.message;
    },
    async updatePassword(newPassword: string) {
      if (!this.user) return;
      const request = await makeRequest(`users/${this.user.id}/password`, 'PATCH', { password: newPassword });
      if (request.status === 'success') {
        return true;
      } else throw request.message;
    },
    async requestReset(username: string) {
      const request = await makeRequest(`auth/request-reset`, 'POST', { username });
      if (request.status === 'success') return true;
      throw request.message;
    },
    async resetPassword(token: string, newPassword: string) {
      const request = await makeRequest(`auth/reset-password`, 'POST', { token, password: newPassword });
      if (request.status === 'success') return true;
      throw request.message;
    },
    async logout() {
      if (!this.user) return;
      const request = await makeRequest(`auth/logout`, 'POST', {});
      if (request.status === 'success') {
        return true;
      } else throw request.message;
    },
    async logout_all() {
      if (!this.user) return;
      const request = await makeRequest(`auth/logout/all`, 'POST', {});
      if (request.status === 'success') {
        return true;
      } else throw request.message;
    },
    async deleteAccount() {
      if (!this.user) return;
      const request = await makeRequest(`users/${this.user.id}`, 'DELETE', {});
      if (request.status === 'success') {
        this.user = undefined;
        return true;
      } else throw request.message;
    },
    async post_logout() {
      this.user = undefined;
      if (import.meta.client) localStorage.removeItem('isLoggedIn');
    },
  },
});
