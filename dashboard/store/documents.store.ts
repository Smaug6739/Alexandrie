import { defineStore } from 'pinia';
import { ref } from 'vue';
import { makeRequest, type FetchOptions } from './utils';
import type { Document } from './db_strustures';

export const useDocumentsStore = defineStore('documents', {
  state: () => ({
    documents: ref<Document[]>([]),
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
  },
  actions: {
    fetch: async function <T extends FetchOptions<Array<keyof Document>>>(opts?: T): Promise<'id' extends keyof T ? Document : Document[]> {
      console.log(`[store/documents] Fetching documents with options: ${JSON.stringify(opts)}`);
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest(`documents/${opts?.id || ''}?all=true`, 'GET', {});
        if (request.status == 'success') {
          if (opts?.id) {
            const index = this.documents.findIndex(d => d.id == opts?.id);
            const updatedDocument: Document = { ...request.result, partial: false, type: 'document' };
            if (index == -1) this.documents.push(updatedDocument);
            else this.documents[index] = updatedDocument;
            resolve(updatedDocument as 'id' extends keyof T ? Document : Document[]);
          } else {
            this.documents = request.result.map((d: Document) => ({ ...d, partial: true, type: 'document' }));
            resolve(this.documents as 'id' extends keyof T ? Document : Document[]);
          }
        } else reject(request.message);
      });
    },
    post(doc: Document) {
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest('documents', 'POST', doc);
        if (request.status == 'success') resolve(this.documents.push(request.result));
        else reject(request.message);
      });
    },
    update(doc: Document) {
      return new Promise(async (resolve, reject) => {
        const request = await makeRequest(`documents/${doc.id}`, 'PATCH', doc);
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
