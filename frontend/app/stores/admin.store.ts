import { makeRequest } from './_utils';
import type { User, Node } from './db_strustures';

interface UserData extends User {
  nodes?: Node[];
}

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: ref<UserData[]>(),
  }),
  actions: {
    async fetchAll(): Promise<UserData[] | undefined> {
      if (this.users) return this.users;
      const responce = await makeRequest<User[]>(`users`, 'GET', {});
      if (responce.status === 'success') {
        if (responce.result) this.users = responce.result as User[];
        return this.users;
      } else throw responce.message;
    },
    async fetchById(id: string): Promise<User | undefined> {
      const cachedUser = this.users?.find(user => user.id === id);
      if (cachedUser) return cachedUser;
      const responce = await makeRequest<{ user: User }>(`users/${id}`, 'GET', {});
      if (responce.status === 'success') return responce.result?.user as User;
      else throw responce.message;
    },
    async update(user: User) {
      const request = await makeRequest(`users/${user.id}`, 'PATCH', user);
      if (request.status === 'success') {
        const index = this.users?.findIndex(u => u.id === user.id);
        if (index !== undefined && index >= 0) this.users![index] = request.result as User;
        return request.result;
      } else throw request.message;
    },
    async fetchUserDocuments(userId: string): Promise<Node[] | undefined> {
      const cachedUser = this.users?.find(user => user.id === userId);
      if (cachedUser && cachedUser.nodes) return cachedUser.nodes;
      const responce = await makeRequest<Node[]>(`nodes/user/${userId}`, 'GET', {});
      if (responce.status === 'success') {
        if (cachedUser) cachedUser.nodes = responce.result;
        return responce.result;
      } else throw responce.message;
    },
    async fetchUserDocument(userId: string, docId: string): Promise<Node | undefined> {
      const responce = await makeRequest<{ node: Node; permissions: [] }>(`nodes/${docId}`, 'GET', {});
      if (responce.status === 'success') {
        return responce.result?.node;
      } else throw responce.message;
    },
  },
});
