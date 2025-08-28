import { makeRequest, type FetchOptions } from './_utils';
import type { Category, DB_Category } from './db_strustures';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as Category[],
    isFetching: false,
  }),
  getters: {
    getAll: state => state.categories,
    getById: state => (id: string) => state.categories.find((c: Category) => c.id == id),
    getParents: state => state.categories.filter(c => !c.parent_id),
    getChilds: state => (id: string) => state.categories.filter(c => c.parent_id == id),
  },
  actions: {
    async fetch(opts?: FetchOptions) {
      this.isFetching = true;
      const request = await makeRequest(`categories/@me/${opts?.id || ''}`, 'GET', {});
      this.isFetching = false;
      if (request.status == 'success') {
        if (opts?.id) {
          // replace the document with the new one
          const index = this.categories.findIndex(d => d.id == opts?.id);
          if (index == -1) this.categories.push({ ...(request.result as DB_Category), type: 'category' });
          else this.categories[index] = { ...(request.result as DB_Category), type: 'category' };
        } else this.categories = (request.result as DB_Category[]).map((d: DB_Category) => ({ ...d, type: 'category' }));
        return this.categories;
      } else throw request.message;
    },
    async post(category: Partial<Category>): Promise<string | number> {
      const response = await makeRequest(`categories`, 'POST', category);
      if (response.status == 'success') return this.categories.push({ ...(response.result as DB_Category), type: 'category' });
      else throw response.message;
    },
    async update(category: Category) {
      const request = await makeRequest(`categories/${category.id}`, 'PUT', category);
      if (request.status == 'success') {
        this.categories = this.categories.map(c => {
          if (c.id == category.id) return category;
          return c;
        });
        return category;
      } else throw request.message;
    },

    async delete(id: string) {
      const request = await makeRequest(`categories/${id}`, 'DELETE', {});
      if (request.status == 'success') return (this.categories = this.categories.filter(c => c.id != id));
      else throw request.message;
    },
  },
});
