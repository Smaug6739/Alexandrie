import { defineStore } from 'pinia';
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
    articles: [] as Article[],
  }),
  actions: {
    async getById(id: string): Promise<Article | undefined> {
      if (!this.articles.length) await this.getAll();
      return this.articles.find((a: Article) => a.id == id);
    },
    async getByPaths(subject: string, category: string, article: string): Promise<Article | undefined> {
      if (!this.articles.length || !this.articles.find(a => a.main_category == category)) await this.getAllByCategory(subject);
      return this.articles.find((a: Article) => a.path == article && a.sub_category == category && a.main_category == subject);
    },

    async getAll(): Promise<Article[]> {
      if (!this.articles.length) {
        const request = await makeRequest('articles', 'GET', {});
        if (request.status == 'success') this.articles = request.data;
      }
      return this.articles;
    },
    async getAllByCategory(category_path: string): Promise<Article[]> {
      const results = this.articles.filter(article => article.main_category == category_path);

      if (results.length > 0) return results;
      const request = await makeRequest(`articles?category=${category_path}`, 'GET', {});
      if (request.status == 'success') {
        this.checkAndUpdateCache(request.data);
        return request.data;
      }
      return [];
    },
    checkAndUpdateCache(articles: Article[]) {
      for (const article of articles) {
        if (!this.articles.find(a => a.id == article.id)) this.articles.push(article);
      }
    },
    getCache(subject: string, category: string, article: string): Article | undefined {
      return this.articles.find((a: Article) => a.path == article && a.sub_category == category && a.main_category == subject);
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
