import { defineStore } from 'pinia';
import { ref } from 'vue';
import { baseUrl, type Result } from './utils';

export interface Article {
  id: string;
  main_category: string;
  sub_category: string;
  path: string;
  name: string;
  description: string;
  content_html: string;
  content_markdown: string;
  created_timestamp: string;
  updated_timestamp: string;
}

export const useArticlesStore = defineStore('articles', {
  state: () => ({
    articles: ref<Article[]>([]),
  }),
  getters: {
    getAll: state => state.articles,
    getById: state => (id: string) => state.articles.find((a: Article) => a.id == id),
    getByCategories: state => (theme: string, category: string) =>
      state.articles.filter((a: Article) => a.main_category == theme && a.sub_category == category),

    getByPaths: state => (article: string, category: string, subject: string) =>
      state.articles.find(a => a.path == article && a.sub_category == category && a.main_category == subject),

    getNext: state => (article?: Article) => {
      const articles_of_category = state.articles.filter(
        (a: Article) => a.main_category == article?.main_category && a.sub_category == article?.sub_category,
      );
      const index = articles_of_category.findIndex((a: Article) => a.id == article?.id);
      if (index == -1) return;
      return articles_of_category[index + 1];
    },

    getPrevious: state => (article?: Article) => {
      const articles_of_category = state.articles.filter(
        a => a.main_category == article?.main_category && a.sub_category == article?.sub_category,
      );
      const index = articles_of_category.findIndex((a: Article) => a.id == article?.id);
      if (index == -1) return;
      return articles_of_category[index - 1];
    },
  },
  actions: {
    fetchArticles: async function () {
      if (!process.server) return;
      const { $getCache, $setCache } = useNuxtApp();
      const { data, error } = await useAsyncData<Result<Article[]>>('articles', async () => {
        const cache = await $getCache<Article[]>('articles');
        if (cache) return cache;
        else return $fetch(`${baseUrl}/api/v1/articles`);
      });
      if (!error.value && data.value?.result) {
        this.articles = data.value.result;
        if (data.value.type != 'cache') $setCache('articles', data.value.result);
      }
    },
  },
});
