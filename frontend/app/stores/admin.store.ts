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
    fetchAll(): Promise<UserData[] | undefined> {
      return new Promise(async (resolve, reject) => {
        if (this.users) return resolve(this.users);
        const responce = await makeRequest<User[]>(`users`, 'GET', {});
        if (responce.status === 'success') {
          if (responce.result) this.users = responce.result as User[];
          return resolve(this.users);
        } else reject(responce.message);
      });
    },
    fetchById(id: string): Promise<User | undefined> {
      return new Promise(async (resolve, reject) => {
        const cachedUser = this.users?.find(user => user.id === id);
        if (cachedUser) return resolve(cachedUser);
        const responce = await makeRequest<{ user: User }>(`users/${id}`, 'GET', {});
        if (responce.status === 'success') return resolve(responce.result?.user as User);
        else reject(responce.message);
      });
    },
    update(user: User) {
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest(`users/${user.id}`, 'PATCH', user);
        if (request.status === 'success') {
          const index = this.users?.findIndex(u => u.id === user.id);
          if (index !== undefined && index >= 0) this.users![index] = request.result as User;
          return resolve(request.result);
        } else reject(request.message);
      });
    },
    fetchUserDocuments(userId: string): Promise<Document[] | undefined> {
      return new Promise(async (resolve, reject) => {
        const cachedUser = this.users?.find(user => user.id === userId);
        if (cachedUser && cachedUser.documents) return resolve(cachedUser.documents);
        const responce = await makeRequest<Document[]>(`documents/${userId}`, 'GET', {});
        if (responce.status === 'success') {
          if (cachedUser) cachedUser.documents = responce.result;
          return resolve(responce.result);
        } else reject(responce.message);
      });
    },
    fetchUserDocument(userId: string, docId: string): Promise<Document | undefined> {
      return new Promise(async (resolve, reject) => {
        const responce = await makeRequest<Document>(`documents/${userId}/${docId}`, 'GET', {});
        if (responce.status === 'success') {
          return resolve(responce.result);
        } else reject(responce.message);
      });
    },
  },
});
