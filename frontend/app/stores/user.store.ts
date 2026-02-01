import { makeRequest } from './_utils';
import type { User, PublicUser, Session } from './db_strustures';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: undefined as User | undefined,
    users: {} as Record<string, PublicUser>,
    sessions: [] as Session[],
    current_fetching: [] as string[], // List of curently fetching user ids to avoid duplicate requests
  }),
  getters: {
    getById: state => (id: string) => state.users[id],
    search: state => (query: string) => {
      const lowerQuery = query.toLowerCase();
      return Object.values(state.users).filter(u => u.username?.toLowerCase().includes(lowerQuery));
    },
  },
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

    async register(user: Omit<User, 'id' | 'created_timestamp' | 'updated_timestamp'>): Promise<boolean> {
      const request = await makeRequest('users', 'POST', user);
      if (request.status === 'success') return true;
      throw request.message;
    },

    async fetch(): Promise<User | undefined> {
      if (this.user) return this.user;
      const responce = await makeRequest<User>(`users/@me`, 'GET', {});
      if (responce.status === 'success') {
        if (responce.result) this.user = responce.result as User;
        return this.user;
      } else throw responce.message;
    },

    async fetchSessions(): Promise<Session[]> {
      if (this.sessions.length) return this.sessions;
      const response = await makeRequest<Session[]>(`auth/sessions`, 'GET', {});
      if (response.status === 'success') {
        this.sessions = response.result as Session[];
        return this.sessions;
      }
      throw response.message;
    },

    async fetchPublicUser(id: string): Promise<PublicUser | null> {
      if (this.users[id]) return this.users[id];
      if (this.current_fetching.includes(id)) return null;
      this.current_fetching.push(id);
      const response = await makeRequest<PublicUser[]>(`users/public/${id}`, 'GET', {});
      if (response.status === 'success' && response.result?.length) {
        const user = response.result[0] as PublicUser;
        this.users[user.id] = user;
        this.current_fetching = this.current_fetching.filter(uid => uid !== id);
        return user;
      }
      throw response.message;
    },

    async searchFetch(query: string): Promise<PublicUser[]> {
      const response = await makeRequest<PublicUser[]>(`users/public/${query}`, 'GET', {});
      if (response.status === 'success') {
        const users = response.result as PublicUser[];
        users.forEach(user => {
          this.users[user.id] = user;
        });
        return users;
      }
      throw response.message;
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
      useNodesStore().clear();
      useUserStore().clear();
      if (import.meta.client) localStorage.removeItem('isLoggedIn');
    },

    clear() {
      this.user = undefined;
      this.users = {};
      this.sessions = [];
      this.current_fetching = [];
    },
  },
});
