import Base from './Base';
import type { User, UserDB } from '../types';

export class UsersManager extends Base<User> {
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
  public getPublic(id: string): Promise<UserDB> {
    return new Promise((resolve, reject) => {
      this.app.db.query<UserDB[]>(
        'SELECT id, username, firstname, lastname, avatar, email, created_timestamp FROM users WHERE id = ? LIMIT 1',
        [id],
        async (err, results) => {
          if (err) return reject('Internal database error.');
          if (!results[0]) return reject('Bad id.');
          resolve(results[0]);
        },
      );
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

  public validate(data: User): string | false {
    if (!data.id || data.id.length > 50) return 'user id invalid';
    if (!data.username || data.username.length > 25) return 'user username invalid';
    if (!data.firstname || data.firstname.length > 25) return 'user firstname invalid';
    if (!data.lastname || data.lastname.length > 25) return 'user lastname invalid';
    if (!data.avatar || data.avatar.length > 75) return 'user avatar invalid';
    if (!data.email || data.email.length > 50) return 'user email invalid';
    if (!data.password || data.password.length > 255) return 'user password invalid';
    if (!data.created_timestamp || data.created_timestamp.length > 50) return 'user created timestamp invalid';
    return false;
  }
}
