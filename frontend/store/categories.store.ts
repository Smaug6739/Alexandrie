import { defineStore } from 'pinia';
import { makeRequest } from './utils';

export interface Theme {
  id: string;
  name: string;
  description: string;
  order: number;
  path: string;
  icon: string;
  categories: Category[];
}
export interface Category {
  id: string;
  name: string;
  description: string;
  order: number;
  path: string;
  icon: string;
  parent_category: string;
}

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as Theme[],
  }),
  getters: {
    getAll: function (state) {
      return state.categories;
    },
    getById: state => {
      return (id: string) => state.categories.find(a => a.id == id);
    },
    getByPath: state => {
      return (path: string) => state.categories.find((a: Theme) => a.path == path);
    },
  },
  actions: {
    async fetchAll(): Promise<Theme[]> {
      if (process.server) return [];
      if (!this.categories.length) {
        const request = await makeRequest('categories', 'GET', {});
        if (request.status == 'success') this.categories = request.data;
      }
      return this.categories;
    },
    async updateMainCategory(category: Theme) {
      const request = await makeRequest(`categories/main/${category.id}`, 'PATCH', category);
      if (request.status == 'success') {
        this.categories = this.categories.map(c => {
          if (c.id == category.id) {
            return category;
          }
          return c;
        });
      }
    },
    async updateSubCategory(parent: string, category: Category) {
      const request = await makeRequest(`categories/sub/${category.id}`, 'PATCH', category);
      if (request.status == 'success') {
        const p = this.categories.find(c => c.id == parent);
        if (!p) return;
        p.categories = p.categories.map(c => {
          if (c.id == category.id) return category;
          return c;
        });
      }
    },
    async postMainCategory(category: Theme) {
      const request = await makeRequest(`categories/main`, 'POST', category);
      if (request.status == 'success') {
        this.categories.push(request.data);
      }
    },
    async postSubCategory(category: Category) {
      const request = await makeRequest(`categories/sub`, 'POST', category);
      if (request.status == 'success') {
        const p = this.categories.find(c => c.id == category.parent_category);
        if (!p) return;
        p.categories.push(request.data);
      }
    },
    async deleteMainCategory(id: string) {
      const request = await makeRequest(`categories/main/${id}`, 'DELETE', {});
      if (request.status == 'success') {
        this.categories = this.categories.filter(c => c.id != id);
      }
    },
    async deleteSubCategory(parent: string, id: string) {
      const request = await makeRequest(`categories/sub/${id}`, 'DELETE', {});
      if (request.status == 'success') {
        const p = this.categories.find(c => c.id == parent);
        if (!p) return;
        p.categories = p.categories.filter(c => c.id != id);
      }
    },
  },
});
