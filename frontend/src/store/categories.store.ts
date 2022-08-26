import { defineStore } from 'pinia';
import { makeRequest } from './utils';

export interface Theme {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
  categories: Category[];
}
interface Category {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
  parent_category: string;
}

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as Theme[],
  }),
  actions: {
    async getById(id: string): Promise<Theme | undefined> {
      if (!this.categories.length) await this.getAll();
      return this.categories.find((a: Theme) => a.id == id);
    },
    async getAll(): Promise<Theme[]> {
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
        const p = await this.getById(parent);
        if (!p) return;
        p.categories = p.categories.map(c => {
          if (c.id == category.id) return category;
          return c;
        });
      }
    },
  },
});
