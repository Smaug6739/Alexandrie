import Base from './Base';
import type { App } from '../app';
import type { Document, DocumentDB } from '../types';

export default class DocumentsManager extends Base {
  constructor(app: App) {
    super(app);
  }

  public getAll(all?: string) {
    // If all is true, return all documents, else return only public documents (accessibility = 1)
    return new Promise<Document[]>((resolve, reject) => {
      this.app.db.query<DocumentDB[]>(
        `SELECT * FROM documents ${all == 'true' ? '' : 'WHERE `accessibility` = 1'} ORDER BY \`name\``,
        (err, result) => {
          if (err) {
            console.log(err);
            return reject('Internal database error.');
          }
          resolve(result);
        },
      );
    });
  }

  public getAllByCategory(category: string) {
    return new Promise<Document[]>((resolve, reject) => {
      if (!category) return reject(new Error('category must be provided'));
      this.app.db.query<DocumentDB[]>(
        'SELECT * FROM documents WHERE category = ? AND `accessibility` = 1 ORDER BY `name`',
        [category],
        (err, result) => {
          if (err) return reject('Internal database error.');
          resolve(result);
        },
      );
    });
  }
  get(id: string) {
    return new Promise<Document>((resolve, reject) => {
      if (!id) return reject(new Error('id must be provided'));
      this.app.db.query<DocumentDB[]>('SELECT * FROM documents WHERE id = ?', [id], (err, result) => {
        if (err) return reject('Internal database error.');
        if (!result[0]) return reject('Document not found.');
        resolve(result[0]);
      });
    });
  }
  public add(data: Omit<Document, 'id' | 'created_timestamp' | 'updated_timestamp'>) {
    return new Promise((resolve, reject) => {
      const time = Date.now().toString();
      const id = this.app.snowflake.generate().toString();
      if (!data.name) return reject(new Error('name must be provided'));
      if (!data.accessibility && data.accessibility != 0) return reject(new Error('accessibility must be provided'));
      if (!data.author_id) return reject(new Error('author_id must be provided'));

      this.app.db.query<DocumentDB[]>(
        'INSERT INTO documents (`id`, `name`, `description`, `tags`, `category`, `parent_id`, `accessibility`, `content_markdown`, `content_html`, `author_id`, `created_timestamp`, `updated_timestamp`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          id,
          data.name,
          data.description,
          data.tags,
          data.category,
          data.parent_id,
          data.accessibility,
          data.content_markdown,
          data.content_html,
          data.author_id,
          time,
          time,
        ],
        err => {
          if (err) return reject('Internal database error.');
          resolve({ id, ...data, created_timestamp: time, updated_timestamp: time });
        },
      );
    });
  }
  public put(id: string, data: Omit<Document, 'id' | 'created_timestamp' | 'updated_timestamp'>) {
    return new Promise((resolve, reject) => {
      if (!id) return reject(new Error('id must be provided'));
      if (!data.name) return reject(new Error('name must be provided'));
      if (!data.accessibility && data.accessibility != 0) return reject(new Error('accessibility must be provided'));
      if (!data.author_id) return reject(new Error('author_id must be provided'));
      const time = Date.now().toString();
      this.app.db.query<DocumentDB[]>(
        'UPDATE documents SET name = ?, description = ?, tags = ?, category = ?, parent_id = ?, accessibility = ?, content_markdown = ?, content_html = ?, updated_timestamp = ? WHERE id = ?',
        [
          data.name,
          data.description,
          data.tags,
          data.category,
          data.parent_id,
          data.accessibility,
          data.content_markdown,
          data.content_html,
          time,
          id,
        ],
        err => {
          if (err) return reject('Internal database error.');
          resolve({ id, ...data, updated_timestamp: time });
        },
      );
    });
  }

  public delete(id: string) {
    return new Promise((resolve, reject) => {
      if (!id) return reject(new Error('id must be provided'));
      this.app.db.query<DocumentDB[]>('DELETE FROM documents WHERE id = ?', [id], err => {
        if (err) return reject('Internal database error.');
        resolve(true);
      });
    });
  }
}
