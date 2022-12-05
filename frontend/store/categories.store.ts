import { defineStore } from 'pinia';
import { makeRequest, baseUrl, type APIResult } from './utils';
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
    fetchCategories: async function () {
      if (process.client) return; // only fetch on server side
      const { data, error } = await useAsyncData<APIResult<Theme[]>>('categories', () => {
        return $fetch(`${baseUrl}/api/v1/categories`);
      });
      if (!error.value && data.value?.result) this.categories = data.value.result;
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
        this.categories.push(request.result);
      }
    },
    async postSubCategory(category: Category) {
      const request = await makeRequest(`categories/sub`, 'POST', category);
      if (request.status == 'success') {
        const p = this.categories.find(c => c.id == category.parent_category);
        if (!p) return;
        p.categories.push(request.result);
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
