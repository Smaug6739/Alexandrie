import Base from './Base';
import { compare } from 'bcrypt';
import type { IObject, UserDB } from '../types';
import type { App } from '../app';

export default class MemberClass extends Base {
  constructor(app: App) {
    super(app);
  }
  public auth(username: string, password: string): Promise<IObject> {
    return new Promise((resolve, reject) => {
      if (!username || (username && username.trim() === '')) return reject('Username must be provided.');
      if (!password || (password && password.trim() === '')) return reject('Password must be provided.');
      this.app.db.query<UserDB[]>('SELECT * FROM users WHERE username = ? LIMIT 1', [username], async (err, results) => {
        if (err) return reject('Internal database error.');
        if (!results[0]) return reject('Bad username/password.');
        const valid = await compare(password, results[0].password);
        if (!valid) return reject('Bad username/password.');
        resolve(results[0]);
      });
    });
  }
}
