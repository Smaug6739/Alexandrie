import Base from './Base';
import type { App } from '../app';
import type { Category, CategoryDB } from '../types';

export default class CategoriesDB extends Base {
  constructor(app: App) {
    super(app);
  }

  public getAll(): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      this.app.db.query<CategoryDB[]>('SELECT * FROM `categories` ORDER BY `order`', [], (err, themes) => {
        if (err) return reject('Internal database error.');
        resolve(themes);
      });
    });
  }

  public add(data: Omit<Category, 'id'>): Promise<Category> {
    return new Promise((resolve, reject) => {
      const id = this.app.snowflake.generate().toString();
      if (!data.name) return reject(new Error('name must be provided'));
      this.app.db.query(
        'INSERT INTO categories (`id`, `name`,`icon`, `order`, `parent_id`) VALUES (?, ?, ?, ?, ?)',
        [id, data.name, data.icon, data.order, data.parent_id],
        err => {
          if (err) return reject('Internal database error.');
          else resolve({ id, ...data });
        },
      );
    });
  }

  update(data: Category): Promise<Category> {
    return new Promise((resolve, reject) => {
      if (!data.id) return reject(new Error('id must be provided'));
      if (!data.name) return reject(new Error('name must be provided'));

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
