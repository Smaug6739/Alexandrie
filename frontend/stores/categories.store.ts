import { makeRequest, type FetchOptions } from './_utils';
import type { Category, DB_Category } from './db_strustures';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as Category[],
  }),
  getters: {
    getAll: state => state.categories,
    getById: state => (id: string) => state.categories.find((c: Category) => c.id == id),
    getParents: state => state.categories.filter(c => !c.parent_id),
    getChilds: state => (id: string) => state.categories.filter(c => c.parent_id == id),
  },
  actions: {
    fetch: function (opts?: FetchOptions) {
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest(`categories/${opts?.id || ''}`, 'GET', {});
        if (request.status == 'success') {
          if (opts?.id) {
            // replace the document with the new one
            const index = this.categories.findIndex(d => d.id == opts?.id);
            if (index == -1) this.categories.push({ ...(request.result as DB_Category), type: 'category' });
            else this.categories[index] = { ...(request.result as DB_Category), type: 'category' };
          } else this.categories = (request.result as DB_Category[]).map((d: DB_Category) => ({ ...d, type: 'category' }));
          resolve(this.categories);
        } else reject(request.message);
      });
    },
    post(category: Category) {
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest(`categories`, 'POST', category);
        if (request.status == 'success') resolve(this.categories.push({ ...(request.result as DB_Category), type: 'category' }));
        else reject(request.message);
      });
    },
    update(category: Category) {
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest(`categories/${category.id}`, 'PATCH', category);
        if (request.status == 'success') {
          this.categories = this.categories.map(c => {
            if (c.id == category.id) return category;
            return c;
          });
          resolve(category);
        } else reject(request.message);
      });
    },

    delete(id: string) {
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest(`categories/${id}`, 'DELETE', {});
        if (request.status == 'success') resolve((this.categories = this.categories.filter(c => c.id != id)));
        else reject(request.message);
      });
    },
  },
});
