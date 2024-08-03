import Base from './Base';
import { Validator } from './Validator';
import type { Document, DocumentDB } from '../types';

export class DocumentsManager extends Base {
  constructor(app: App) {
    super(app);
  }

  public validator = new Validator({
    id: { minLength: 1, maxLength: 50, type: 'string', error: 'Document id invalid' },
    name: { minLength: 1, maxLength: 50, type: 'string', error: 'Document name invalid' },
    description: { maxLength: 255, type: 'string', error: 'Document description invalid', optional: true },
    tags: { maxLength: 200, type: 'string', error: 'Document tags invalid', optional: true },
    category: { maxLength: 50, type: 'string', error: 'Document category invalid', optional: true },
    parent_id: { maxLength: 50, type: 'string', error: 'Document parent id invalid', optional: true },
    accessibility: { minLength: 1, maxLength: 3, type: 'number', error: 'Document accessibility invalid' },
    content_markdown: { maxLength: 4_294_967_295, type: 'string', error: 'Document content markdown invalid', optional: true },
    content_html: { maxLength: 4_294_967_295, type: 'string', error: 'Document content html invalid', optional: true },
    author_id: { minLength: 1, maxLength: 50, type: 'string', error: 'Document author id invalid' },
    created_timestamp: { maxLength: 50, type: 'string', error: 'Document created timestamp invalid' },
    updated_timestamp: { maxLength: 50, type: 'string', error: 'Document updated timestamp invalid' },
  });

  public getAll(user_id: string) {
    return new Promise<Document[]>((resolve, reject) => {
      this.app.db.query<DocumentDB[]>(
        `SELECT id, name, description, tags, category, parent_id, accessibility, author_id, created_timestamp, updated_timestamp FROM documents WHERE author_id = ? ORDER BY name`,
        [user_id],
        (err, result) => {
          if (err) return reject('Internal database error.');
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
  get(id: string, author_id: string) {
    return new Promise<Document | undefined>((resolve, reject) => {
      this.app.db.query<DocumentDB[]>(
        'SELECT * FROM documents WHERE id = ? AND author_id = ?',
        [id, author_id],
        (err, result) => {
          if (err) return reject('Internal database error.');
          resolve(result[0]);
        },
      );
    });
  }
  public add(data: Document) {
    return new Promise((resolve, reject) => {
      const error = this.validator.validate(data);
      if (error) return reject(error);
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
      const error = this.validator.validate(data);
      if (error) return reject(error);
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
}
