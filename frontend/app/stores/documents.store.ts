import { makeRequest, type FetchOptions } from './_utils';
import type { DB_Document, Document } from './db_strustures';

interface SearchOptions {
  query?: string;
  fromDate?: Date;
  toDate?: Date;
  dateType?: 'created' | 'modified';
  tags?: string[];
  category?: string;
}

export const useDocumentsStore = defineStore('documents', {
  state: () => ({
    documents: [] as Document[],
    allTags: [] as string[],
    isFetching: false,
  }),
  getters: {
    getAll: state => state.documents,
    getAllTags: state => state.allTags,
    getById: state => (id: string) => state.documents.find((d: Document) => d.id == id),
    getByCategories: state => (category: string) => state.documents.filter(d => d.category == category),

    getNext: state => (doc?: Document) => {
      const cdocs = state.documents.filter(d => d.category == doc?.category);
      const index = cdocs.findIndex(d => d.id == doc?.id);
      if (index == -1) return;
      return cdocs[index + 1];
    },

    getPrevious: state => (doc?: Document) => {
      const cdocs = state.documents.filter(d => d.category == doc?.category);
      const index = cdocs.findIndex(d => d.id == doc?.id);
      if (index == -1) return;
      return cdocs[index - 1];
    },
    getAllChildrensIds: state => (id: string) => {
      const childrens: string[] = [id];
      const getChildrens = (parent: Document) => {
        state.documents.forEach(doc => {
          if (doc.parent_id == parent.id) {
            childrens.push(doc.id);
            getChildrens(doc);
          }
        });
      };
      const parent = state.documents.find(d => d.id == id);
      if (parent) getChildrens(parent);
      return childrens;
    },
    search: state => (options: SearchOptions) => {
      const { query, fromDate, toDate, dateType, tags, category } = options;
      let filtered = [...state.documents];
      if (query) {
        filtered = filtered.filter(doc => {
          const docContent = `${doc.name} ${doc.description} ${doc.tags}`.toLowerCase();
          return docContent.includes(query.toLowerCase());
        });
      }

      if (fromDate) {
        filtered = filtered.filter(doc => {
          const docDate = new Date(doc[dateType === 'created' ? 'created_timestamp' : 'updated_timestamp']);
          return docDate >= fromDate;
        });
      }

      if (toDate) {
        filtered = filtered.filter(doc => {
          const docDate = new Date(doc[dateType === 'created' ? 'created_timestamp' : 'updated_timestamp']);
          return docDate <= toDate;
        });
      }

      if (tags && tags.length > 0) {
        filtered = filtered.filter(doc => {
          if (!doc.tags) return false;
          const docTags = parseTags(doc.tags);
          return tags.some(tag => docTags.includes(tag));
        });
      }

      if (category) {
        filtered = filtered.filter(doc => doc.category === category);
      }

      return filtered;
    },
  },
  actions: {
    recomputeTags() {
      const tags = new Set<string>();
      this.documents.forEach(doc => {
        if (doc.tags) {
          parseTags(doc.tags).forEach(tag => tags.add(tag));
        }
      });
      this.allTags = Array.from(tags).sort();
    },
    async fetch<T extends FetchOptions>(opts?: T): Promise<'id' extends keyof T ? Document : Document[]> {
      console.log(`[store/documents] Fetching documents with options: ${JSON.stringify(opts)}`);
      this.isFetching = true;
      const request = await makeRequest(`documents/@me/${opts?.id || ''}`, 'GET', {});
      this.isFetching = false;
      if (request.status == 'success') {
        if (opts?.id) {
          const index = this.documents.findIndex(d => d.id == opts?.id);
          const updatedDocument: Document = { ...(request.result as DB_Document), partial: false, type: 'document' };
          if (index == -1) this.documents.push(updatedDocument);
          else this.documents[index] = updatedDocument;
          return updatedDocument as 'id' extends keyof T ? Document : Document[];
        } else {
          this.documents = (request.result as DB_Document[]).map((d: DB_Document) => ({ ...d, partial: true, type: 'document' }));
          this.recomputeTags();
          return this.documents as 'id' extends keyof T ? Document : Document[];
        }
      } else throw request;
    },
    async post(doc: Document): Promise<DB_Document> {
      const request = await makeRequest('documents', 'POST', doc);
      if (request.status == 'success') {
        this.documents.push({ ...(request.result as DB_Document), type: 'document', partial: false });
        return request.result as DB_Document;
      } else throw request.message;
    },
    async update(doc: Document) {
      if (doc.partial) {
        console.log('[store/documents] Document is partial, cannot update it directly.');
        const fullDoc = await this.fetch({ id: doc.id });
        if (!fullDoc) throw 'Document not found';
        doc = { ...doc, content_markdown: fullDoc.content_markdown, content_html: fullDoc.content_html, partial: false }; // Merge with full document data
      }
      const request = await makeRequest(`documents/${doc.id}`, 'PUT', doc);
      if (request.status == 'success') return (this.documents = this.documents.map(d => (d.id == doc.id ? doc : d)));
      else throw request.message;
    },
    async delete(id: string) {
      const request = await makeRequest(`documents/${id}`, 'DELETE', {});
      if (request.status == 'success') return (this.documents = this.documents.filter(d => d.id != id));
      else throw request.message;
    },
  },
});

function parseTags(tags: string): string[] {
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);
  }
  return [];
}
