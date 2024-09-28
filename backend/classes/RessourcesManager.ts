import Base from './Base';
import { Validator } from './Validator';
import type { IObject, Ressource, RessourceDB } from '../types';

export class RessourcesManager extends Base {
  constructor(app: App) {
    super(app);
  }

  public validator = new Validator({
    id: { minLength: 1, maxLength: 50, type: 'string', error: 'ressource id invalid' },
    filename: { minLength: 1, maxLength: 50, type: 'string', error: 'ressource filename invalid' },
    file_size: { type: 'number', error: 'ressource file size invalid' },
    file_type: { minLength: 1, maxLength: 100, type: 'string', error: 'ressource file type invalid' },
    original_path: { minLength: 1, maxLength: 100, type: 'string', error: 'ressource original path invalid' },
    transformed_path: { maxLength: 100, type: 'string', error: 'ressource transformed path invalid', optional: true },
    author_id: { minLength: 1, maxLength: 50, type: 'string', error: 'ressource author id invalid' },
    created_timestamp: { minLength: 1, maxLength: 50, type: 'string', error: 'ressource created timestamp invalid' },
  });

  public getRessources(user_id: string): Promise<Ressource[]> {
    return new Promise((resolve, reject) => {
      this.app.db.query<RessourceDB[]>('SELECT * FROM ressources WHERE author_id = ?', [user_id], async (err, results) => {
        if (err) return reject('Internal database error.');
        resolve(results);
      });
    });
  }
  public getRessource(ressource_id: string): Promise<Ressource | undefined> {
    return new Promise((resolve, reject) => {
      this.app.db.query<RessourceDB[]>('SELECT * FROM ressources WHERE id = ?', [ressource_id], async (err, results) => {
        if (err) return reject('Internal database error.');
        resolve(results[0]);
      });
    });
  }

  public getUserRessourcesSize(user_id: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.app.db.query<RessourceDB[]>(
        'SELECT SUM(file_size) as size FROM ressources WHERE author_id = ?',
        [user_id],
        async (err, results) => {
          if (err) return reject('Internal database error.');
          resolve(results[0]?.size);
        },
      );
    });
  }

  public createRessource(ressource: Ressource): Promise<IObject> {
    return new Promise((resolve, reject) => {
      this.app.db.query<RessourceDB[]>(
        'INSERT INTO ressources (id, filename, file_size, file_type, original_path, transformed_path,author_id, created_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          ressource.id,
          ressource.filename,
          ressource.file_size,
          ressource.file_type,
          ressource.original_path,
          ressource.transformed_path,
          ressource.author_id,
          ressource.created_timestamp,
        ],
        async err => {
          if (err) return reject('Internal database error.');
          resolve(ressource);
        },
      );
    });
  }

  public deleteRessource(ressource_id: string): Promise<IObject> {
    return new Promise((resolve, reject) => {
      this.app.db.query<RessourceDB[]>('DELETE FROM ressources WHERE id = ?', [ressource_id], async err => {
        if (err) return reject('Internal database error.');
        resolve({ id: ressource_id });
      });
    });
  }

  public validate(data: Ressource): string | false {
    if (!data.id || data.id.length > 50) return 'ressource id invalid';
    if (!data.filename || data.filename.length > 50) return 'ressource filename invalid';
    if (!data.file_size) return 'ressource file size invalid';
    if (!data.file_type || data.file_type.length > 100) return 'ressource file type invalid';
    if (!data.original_path || data.original_path.length > 100) return 'ressource original path invalid';
    if (data.transformed_path && data.transformed_path.length > 100) return 'ressource transformed path invalid';
    if (!data.author_id || data.author_id.length > 50) return 'ressource author id invalid';
    if (!data.created_timestamp || data.created_timestamp.length > 50) return 'ressource created timestamp invalid';
    return false;
  }
}
