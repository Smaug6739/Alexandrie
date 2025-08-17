import { makeRequest, type FetchOptions } from './_utils';
import type { DB_Document, Document } from './db_strustures';

export const useDocumentsStore = defineStore('documents', {
  state: () => ({
    documents: [] as Document[],
  }),
  getters: {
    getAll: state => state.documents,
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
  },
  actions: {
    fetch: function <T extends FetchOptions>(opts?: T): Promise<'id' extends keyof T ? Document : Document[]> {
      console.log(`[store/documents] Fetching documents with options: ${JSON.stringify(opts)}`);
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest(`documents/@me/${opts?.id || ''}`, 'GET', {});
        if (request.status == 'success') {
          if (opts?.id) {
            const index = this.documents.findIndex(d => d.id == opts?.id);
            const updatedDocument: Document = { ...(request.result as DB_Document), partial: false, type: 'document' };
            if (index == -1) this.documents.push(updatedDocument);
            else this.documents[index] = updatedDocument;
            resolve(updatedDocument as 'id' extends keyof T ? Document : Document[]);
          } else {
            this.documents = (request.result as DB_Document[]).map((d: DB_Document) => ({ ...d, partial: true, type: 'document' }));
            resolve(this.documents as 'id' extends keyof T ? Document : Document[]);
          }
        } else reject(request);
      });
    },
    post(doc: Document): Promise<DB_Document> {
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest('documents', 'POST', doc);
        if (request.status == 'success') {
          this.documents.push({ ...(request.result as DB_Document), type: 'document', partial: false });
          resolve(request.result as DB_Document);
        } else reject(request.message);
      });
    },
    update(doc: Document) {
      return new Promise(async (resolve, reject) => {
        if (doc.partial) {
          console.log('[store/documents] Document is partial, cannot update it directly.');
          const fullDoc = await this.fetch({ id: doc.id });
          if (!fullDoc) return reject('Document not found');
          doc = { ...doc, content_markdown: fullDoc.content_markdown, content_html: fullDoc.content_html, partial: false }; // Merge with full document data
        }
        const request = await makeRequest(`documents/${doc.id}`, 'PUT', doc);
        if (request.status == 'success') resolve((this.documents = this.documents.map(d => (d.id == doc.id ? doc : d))));
        else reject(request.message);
      });
    },
    delete(id: string) {
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest(`documents/${id}`, 'DELETE', {});
        if (request.status == 'success') resolve((this.documents = this.documents.filter(d => d.id != id)));
        else reject(request.message);
      });
    },
  },
});
