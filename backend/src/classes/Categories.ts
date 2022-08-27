import { Snowflake } from '../utils/Snowflake';
import db from '../models/db';

const idgen = new Snowflake(1661327668261);

interface Category {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
  parent_category: string;
}

export default class CategoriesClass {
  public getAll() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM main_categories', [], (err, themes) => {
        if (err) return reject(new Error(err.message));
        db.query('SELECT * FROM sub_categories', [], (err, categories) => {
          if (err) return reject(new Error(err.message));
          for (const theme of themes) {
            theme.categories = categories.filter((c: Category) => c.parent_category === theme.path);
          }
          resolve(themes);
        });
      });
    });
  }

  public addMainCategory(name: string, description: string, path: string, icon: string) {
    return new Promise((resolve, reject) => {
      const id = idgen.generate().toString();
      if (!name) return reject(new Error('[MISSING_ARGUMENT] : name must be provided'));
      if (!description) return reject(new Error('[MISSING_ARGUMENT] : description must be provided'));
      if (!path) return reject(new Error('[MISSING_ARGUMENT] : path must be provided'));
      if (!icon) return reject(new Error('[MISSING_ARGUMENT] : icon must be provided'));
      db.query(
        'INSERT INTO main_categories (id, name, description, path, icon) VALUES (?, ?, ?, ?, ?)',
        [id, name, description, path, icon],
        err => {
          if (err) return reject(new Error(err.message));
          else
            resolve({
              id,
              name,
              description,
              path,
              icon,
            });
        },
      );
    });
  }
  public addSubCategory(name: string, description: string, path: string, icon: string, parent_category: string) {
    return new Promise((resolve, reject) => {
      if (!name) return reject(new Error('[MISSING_ARGUMENT] : name must be provided'));
      if (!description) return reject(new Error('[MISSING_ARGUMENT] : description must be provided'));
      if (!path) return reject(new Error('[MISSING_ARGUMENT] : path must be provided'));
      if (!icon) return reject(new Error('[MISSING_ARGUMENT] : icon must be provided'));
      if (!parent_category) return reject(new Error('[MISSING_ARGUMENT] : parent_category must be provided'));
      const id = idgen.generate();
      db.query(
        'INSERT INTO sub_categories (id, name, description, path, icon, parent_category) VALUES (?, ?, ?, ?, ?, ?)',
        [id, name, description, path, icon, parent_category],
        err => {
          if (err) return reject(new Error(err.message));
          else
            resolve({
              id,
              name,
              description,
              path,
              icon,
              parent_category,
            });
        },
      );
    });
  }
  updateMainCategory(id: string, name: string, description: string, path: string, icon: string) {
    return new Promise((resolve, reject) => {
      if (!id) return reject(new Error('[MISSING_ARGUMENT] : id must be provided'));
      db.query('SELECT * FROM main_categories WHERE id = ? LIMIT 1', [id], (err, result) => {
        if (err) return reject(new Error(err.message));
        if (!result || !result.length) return reject(new Error('[ERROR] : Invalid id'));
        else {
          if (!name) name = result[0].name;
          if (!path) path = result[0].path;
          if (!description) description = result[0].description;
          if (!icon) icon = result[0].icon;
          db.query(
            'UPDATE main_categories SET name = ?, description = ?, path = ?, icon = ? WHERE id = ?',
            [name, description, path, icon, id],
            err => {
              if (err) return reject(new Error(err.message));
              else resolve(true);
            },
          );
        }
      });
    });
  }
  public updateSubCategory(id: string, name: string, description: string, path: string, icon: string, parent_category: string) {
    return new Promise((resolve, reject) => {
      if (!id) return reject(new Error('[MISSING_ARGUMENT] : id must be provided'));
      db.query('SELECT * FROM sub_categories WHERE id = ? LIMIT 1', [id], (err, result) => {
        if (err) return reject(new Error(err.message));
        if (!result || !result.length) return reject(new Error('[ERROR] : Invalid id'));
        else {
          if (!name) name = result[0].name;
          if (!path) path = result[0].path;
          if (!description) description = result[0].description;
          if (!icon) icon = result[0].icon;
          if (!parent_category) parent_category = result[0].parent_category;
          db.query(
            'UPDATE sub_categories SET name = ?, description = ?, path = ?, icon = ?, parent_category = ? WHERE id = ?',
            [name, description, path, icon, parent_category, id],
            err => {
              if (err) return reject(new Error(err.message));
              else resolve(true);
            },
          );
        }
      });
    });
  }
  public deleteMainCategory(id: string) {
    return new Promise((resolve, reject) => {
      if (!id) return reject(new Error('[MISSING_ARGUMENT] : id must be provided'));
      db.query('DELETE FROM main_categories WHERE id = ?', [id], (err, r) => {
        if (err) return reject(new Error(err.message));
        else resolve(true);
      });
    });
  }
  public deleteSubCategory(id: string) {
    return new Promise((resolve, reject) => {
      if (!id) return reject(new Error('[MISSING_ARGUMENT] : id must be provided'));
      db.query('DELETE FROM sub_categories WHERE id = ?', [id], (err, r) => {
        if (err) return reject(new Error(err.message));
        else resolve(true);
      });
    });
  }
}
