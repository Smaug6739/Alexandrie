import { defineStore } from 'pinia';
import { ref } from 'vue';
import { type Result, baseUrl } from './utils';

export interface Article {
  id: string;
  name: string;
  description?: string;
  path: string;
  main_category: string;
  sub_category: string;
  content_html?: string;
  content_markdown?: string;
  created_timestamp?: string;
  updated_timestamp?: string;

  partial: boolean; // if true, the article is not fully loaded
}

export const useArticlesStore = defineStore('articles', {
  state: () => ({
    articles: ref<Article[]>([]),
  }),
  getters: {
    getAll: state => state.articles,
    getByCategories: state => (theme: string, category: string) =>
      state.articles.filter((a: Article) => a.main_category == theme && a.sub_category == category),

    getByPaths: state => (slug: string, category: string, subject: string) =>
      state.articles.find(a => a.path == slug && a.sub_category == category && a.main_category == subject),

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
      const { data: articles } = await useAsyncData<Result<Article[]>>(async () => {
        return $fetch(`${baseUrl}/api/v1/articles?fields=id,name,path,main_category,sub_category`);
      });
      if (!articles.value?.result) return;
      const data = [];
      for (const article of articles.value.result) {
        data.push({ ...article, partial: true });
      }
      this.articles = data;
      return this.articles;
    },
    fetchArticle: async function (id: string) {
      // check if article is already in cache
      const cache = this.articles.find(a => a.id == id);
      if (cache && !cache.partial) return cache;
      // fetch article from server
      const { data: article } = await useAsyncData<Result<Article>>(async () => {
        return $fetch(`${baseUrl}/api/v1/articles/${id}`);
      });
      if (!article.value?.result) return;
      // update cache
      const index = this.articles.findIndex(a => a.id == id);
      if (index == -1) this.articles.push({ ...article.value.result, partial: false });
      else this.articles[index] = article.value.result;
      return article.value.result;
    },
    search: function (query: string) {
      return this.articles.filter((a: Article) => a.name.toLowerCase().includes(query.toLowerCase()));
    },
  },
});
