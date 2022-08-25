import { defineStore } from 'pinia';

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
    async getAll(): Promise<Theme[]> {
      if (this.categories.length) return this.categories;
      const response = await fetch('http://192.168.0.25:8082/api/v1/categories');
      const result = await response.json();
      if (result.status == 'success') {
        this.categories = result.result;
      }
      return this.categories;
    },
    async getById(id: string): Promise<Theme | undefined> {
      if (!this.categories.length) await this.getAll();
      return this.categories.find((a: Theme) => a.id == id);
    },
    async updateMainCategory(category: Theme) {
      const response = await fetch(`http://192.168.0.25:8082/api/v1/categories/main/${category.id}`, {
        method: 'PATCH',
        body: JSON.stringify(category),
        credentials: 'include',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const result = await response.json();
      if (result.status == 'success') {
        this.categories = this.categories.map(c => {
          if (c.id == category.id) {
            return category;
          }
          return c;
        });
      }
    },
    async updateSubCategory(parent: string, category: Category) {
      const response = await fetch(`http://192.168.0.25:8082/api/v1/categories/sub/${category.id}`, {
        method: 'PATCH',
        body: JSON.stringify(category),
        credentials: 'include',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const result = await response.json();
      if (result.status == 'success') {
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
