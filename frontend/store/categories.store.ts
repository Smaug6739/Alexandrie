import { defineStore } from 'pinia';
import { baseUrl, type APIResult } from './utils';
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
      const { data, error } = await useLazyAsyncData<APIResult<Theme[]>>('categories', () => {
        return $fetch(`${baseUrl}/api/v1/categories`);
      });
      if (!error.value && data.value?.result) this.categories = data.value.result;
    },
  },
});
