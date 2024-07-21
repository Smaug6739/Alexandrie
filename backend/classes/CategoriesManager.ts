import Base from './Base';
import { Validator } from './Validator';
import type { Category, CategoryDB } from '../types';

export class CategoriesManager extends Base {
  constructor(app: App) {
    super(app);
  }

  public validator = new Validator({
    id: { minLength: 1, maxLength: 50, type: 'string', error: 'category id invalid' },
    name: { minLength: 1, maxLength: 50, type: 'string', error: 'category name invalid' },
    icon: { maxLength: 10_000, type: 'string', error: 'category icon invalid', optional: true },
    order: { type: 'number', error: 'category order invalid', optional: true },
    parent_id: { maxLength: 50, type: 'string', error: 'category parent id invalid', optional: true },
    author_id: { minLength: 1, maxLength: 50, type: 'string', error: 'category author id invalid' },
  });

  public getAll(author_id: Category['author_id']): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      this.app.db.query<CategoryDB[]>(
        'SELECT * FROM `categories` WHERE `author_id` = ? ORDER BY `order`',
        [author_id],
        (err, themes) => {
          if (err) return reject('Internal database error.');
          resolve(themes);
        },
      );
    });
  }
  public get(id: Category['id'], author_id: Category['author_id']): Promise<Category | undefined> {
    return new Promise((resolve, reject) => {
      this.app.db.query<CategoryDB[]>(
        'SELECT * FROM `categories` WHERE `id` = ? AND `author_id` = ?',
        [id, author_id],
        (err, themes) => {
          if (err) return reject('Internal database error.');
          resolve(themes[0]);
        },
      );
    });
  }

  public add(data: Category): Promise<Category> {
    return new Promise((resolve, reject) => {
      const error = this.validator.validate(data);
      if (error) return reject(error);
      this.app.db.query(
        'INSERT INTO categories (`id`, `name`,`icon`, `order`, `parent_id`, `author_id`) VALUES (?, ?, ?, ?, ?, ?)',
        [data.id, data.name, data.icon, data.order, data.parent_id, data.author_id],
        err => {
          if (err) return reject('Internal database error.');
          else resolve(data);
        },
      );
    });
  }

  update(data: Category): Promise<Category> {
    return new Promise((resolve, reject) => {
      const error = this.validator.validate(data);
      if (error) return reject(error);
      this.app.db.query(
        'UPDATE categories SET name = ?, icon = ?, `order` = ?, parent_id = ? WHERE id = ?',
        [data.name, data.icon, data.order, data.parent_id, data.id],
        err => {
          if (err) return reject('Internal database error.');
          else resolve(data);
        },
      );
    });
  }

  public delete(id: Category['id']): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!id) return reject(new Error('id must be provided'));
      this.app.db.query('DELETE FROM categories WHERE id = ?', [id], err => {
        if (err) return reject('Internal database error.');
        else resolve(true);
      });
    });
  }
}
