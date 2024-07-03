import Base from './Base';
import type { Document, DocumentDB } from '../types';

export class DocumentsManager extends Base<Document> {
  constructor(app: App) {
    super(app);
  }

  public getAll(all?: string) {
    // If all is true, return all documents, else return only public documents (accessibility = 1)
    return new Promise<Document[]>((resolve, reject) => {
      this.app.db.query<DocumentDB[]>(
        `SELECT id, name, description, tags, category, parent_id, accessibility, author_id, created_timestamp, updated_timestamp FROM documents ${
          all == 'true' ? '' : 'WHERE `accessibility` = 1'
        } ORDER BY \`name\``,
        (err, result) => {
          if (err) {
            console.error(err);
            console.error(err.stack);
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
  public add(data: Document) {
    return new Promise((resolve, reject) => {
      if (!data.name) return reject(new Error('name must be provided'));
      if (!data.accessibility && data.accessibility != 0) return reject(new Error('accessibility must be provided'));
      if (!data.author_id) return reject(new Error('author_id must be provided'));
      this.app.db.query<DocumentDB[]>(
        'INSERT INTO documents (`id`, `name`, `description`, `tags`, `category`, `parent_id`, `accessibility`, `content_markdown`, `content_html`, `author_id`, `created_timestamp`, `updated_timestamp`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          data.id,
          data.name,
          data.description,
          data.tags,
          data.category,
          data.parent_id,
          data.accessibility,
          data.content_markdown,
          data.content_html,
          data.author_id,
          data.created_timestamp,
          data.updated_timestamp,
        ],
        err => {
          if (err) return reject('Internal database error.');
          resolve(data);
        },
      );
    });
  }
  public put(id: string, data: Omit<Document, 'id' | 'created_timestamp'>) {
    return new Promise((resolve, reject) => {
      if (!id) return reject(new Error('id must be provided'));
      if (!data.name) return reject(new Error('name must be provided'));
      if (!data.accessibility && data.accessibility != 0) return reject(new Error('accessibility must be provided'));
      if (!data.author_id) return reject(new Error('author_id must be provided'));
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
          data.updated_timestamp,
          id,
        ],
        err => {
          if (err) return reject('Internal database error.');
          resolve({ id, ...data });
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

  public validate(data: Document): string | false {
    if (!data.id || data.id.length > 50) return 'document id invalid';
    if (!data.name || data.name.length > 50) return 'document name invalid';
    if (data.description && data.description.length > 255) return 'document description invalid';
    if (data.tags && data.tags.length > 200) return 'document tags invalid';
    if (data.category && data.category.length > 50) return 'document category invalid';
    if (data.parent_id && data.parent_id.length > 50) return 'document parent id invalid';
    if (!data.accessibility && data.accessibility > 10) return 'document accessibility invalid';
    if (!data.content_markdown || data.content_markdown.length > 4_294_967_295) return 'document content markdown invalid';
    if (data.content_html && data.content_html.length > 4_294_967_295) return 'document content html invalid';
    if (!data.author_id || data.author_id.length > 50) return 'document author id invalid';
    if (!data.created_timestamp || data.created_timestamp.length > 50) return 'document created timestamp invalid';
    if (!data.updated_timestamp || data.updated_timestamp.length > 50) return 'document updated timestamp invalid';
    return false;
  }
}
