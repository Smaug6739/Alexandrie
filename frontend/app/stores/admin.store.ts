import { makeRequest } from './_utils';
import type { User, Document, Category, Ressource } from './db_strustures';

interface UserData extends User {
  documents?: Document[];
  categories?: Category[];
  files?: Ressource[];
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
    async fetchUserDocuments(userId: string): Promise<Document[] | undefined> {
      const cachedUser = this.users?.find(user => user.id === userId);
      if (cachedUser && cachedUser.documents) return cachedUser.documents;
      const responce = await makeRequest<Document[]>(`documents/${userId}`, 'GET', {});
      if (responce.status === 'success') {
        if (cachedUser) cachedUser.documents = responce.result;
        return responce.result;
      } else throw responce.message;
    },
    async fetchUserDocument(userId: string, docId: string): Promise<Document | undefined> {
      const responce = await makeRequest<Document>(`documents/${userId}/${docId}`, 'GET', {});
      if (responce.status === 'success') {
        return responce.result;
      } else throw responce.message;
    },
  },
});
