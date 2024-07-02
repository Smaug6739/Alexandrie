import Base from './Base';
import type { UserDB } from '../types';

export default class MemberClass extends Base {
  constructor(app: App) {
    super(app);
  }
  public get(username: string): Promise<UserDB> {
    return new Promise((resolve, reject) => {
      this.app.db.query<UserDB[]>('SELECT * FROM users WHERE username = ? LIMIT 1', [username], async (err, results) => {
        if (err) return reject('Internal database error.');
        if (!results[0]) return reject('Bad username.');
        resolve(results[0]);
      });
    });
  }
  public getById(id: string): Promise<UserDB> {
    return new Promise((resolve, reject) => {
      this.app.db.query<UserDB[]>('SELECT * FROM users WHERE id = ? LIMIT 1', [id], async (err, results) => {
        if (err) return reject('Internal database error.');
        if (!results[0]) return reject('Bad user id.');
        resolve(results[0]);
      });
    });
  }
}
