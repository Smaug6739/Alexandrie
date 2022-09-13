import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { makeRequest } from './utils';
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
    getAll: function (state) {
      return computed(() => state.articles);
    },
    getById: state => {
      return computed(() => (id: string) => state.articles.find((a: Article) => a.id == id));
    },
    getAllByCategory: state => {
      return computed(() => (category: string) => state.articles.filter((a: Article) => a.main_category == category));
    },
    getByPaths: state => {
      return (article: string, category: string, subject: string) =>
        computed(() => {
          console.log('getByPaths', article, category, subject, state.articles);

          return state.articles.find(a => a.path == article && a.sub_category == category && a.main_category == subject);
        }).value;
    },
  },
  actions: {
    async fetchAll() {
      console.log('fetchAll');

      const request = await makeRequest('articles', 'GET', {});
      if (request.status == 'success') this.articles = request.data;

      console.log('fetched all articles', this.articles.length);
    },
    async postArticle(article: Article) {
      const request = await makeRequest('articles', 'POST', article);
      if (request.status == 'success') {
        this.articles.push(request.data);
      }
    },
    async updateArticle(article: Article) {
      const request = await makeRequest(`articles/${article.id}`, 'PATCH', article);
      if (request.status == 'success') {
        this.articles = this.articles.map(a => (a.id == article.id ? article : a));
      }
    },
    async deleteArticle(id: string) {
      const request = await makeRequest(`articles/${id}`, 'DELETE', {});
      if (request.status == 'success') {
        this.articles = this.articles.filter(a => a.id != id);
      }
    },
  },
});
