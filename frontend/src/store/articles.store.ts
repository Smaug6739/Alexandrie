import { defineStore } from 'pinia';

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
    async getAll(category: string | undefined): Promise<Article[]> {
      if (!category || this.articles.filter(a => a.main_category == category).length) return this.articles;
      const response = await fetch('http://localhost:8082/api/v1/articles/category/' + category);
      const result = await response.json();
      if (result.status == 'success') {
        result.result.forEach((a: Article) => {
          if (!this.getCache(a.main_category, a.sub_category, a.path)) {
            this.articles.push(a);
          }
        });
      }
      return this.articles;
    },
    async getAllPage() {
      const response = await fetch('http://localhost:8082/api/v1/articles/');
      const result = await response.json();
      if (result.status == 'success') {
        result.result.forEach((a: Article) => {
          if (!this.getCache(a.main_category, a.sub_category, a.path)) {
            this.articles.push(a);
          }
        });
      }
      return this.articles;
    },
    async get(subject: string, category: string, article: string): Promise<Article | undefined> {
      if (!this.articles.length) await this.getAll(subject);
      return this.articles.find((a: Article) => a.path == article && a.sub_category == category && a.main_category == subject);
    },
    async getById(id: string): Promise<Article | undefined> {
      if (!this.articles.length) await this.getAllPage();
      return this.articles.find((a: Article) => a.id == id);
    },
    getCache(subject: string, category: string, article: string): Article | undefined {
      return this.articles.find((a: Article) => a.path == article && a.sub_category == category && a.main_category == subject);
    },
    async updateArticle(article: Article) {
      const response = await fetch('http://localhost:8082/api/v1/articles/' + article.id, {
        method: 'PATCH',
        body: JSON.stringify(article),
        credentials: 'include',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const result = await response.json();
      if (result.status == 'success') {
        this.articles = this.articles.map(a => (a.id == article.id ? article : a));
      }
    },
  },
});
