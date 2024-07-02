import Base from './Base';
import type { IObject, Ressource, RessourceDB } from '../types';
import type { PartialRessource } from '../controllers/cdn.controller';

export default class RessourcesManager extends Base {
  constructor(app: App) {
    super(app);
  }
  public getRessources(user_id: string): Promise<Ressource[]> {
    return new Promise((resolve, reject) => {
      this.app.db.query<RessourceDB[]>('SELECT * FROM ressources WHERE author_id = ?', [user_id], async (err, results) => {
        if (err) return reject('Internal database error.');
        resolve(results);
      });
    });
  }
  public createRessource(ressource: PartialRessource): Promise<IObject> {
    return new Promise((resolve, reject) => {
      const time = Date.now().toString();
      const id = this.app.snowflake.generate().toString();
      this.app.db.query<RessourceDB[]>(
        'INSERT INTO ressources (id, filename, file_size, file_type, original_path, transformed_path,author_id, created_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          id,
          ressource.filename,
          ressource.file_size,
          ressource.file_type,
          ressource.original_path,
          ressource.transformed_path,
          ressource.author_id,
          time,
        ],
        async err => {
          if (err) return reject('Internal database error.');
          resolve({ id, ...ressource, created_timestamp: time });
        },
      );
    });
  }
}
