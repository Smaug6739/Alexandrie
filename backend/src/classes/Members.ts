import db from '../models/db';
import { compare } from 'bcrypt';
import type { IObject, User } from '../types';

export class MemberClass {
  public auth(username: string, password: string): Promise<IObject> {
    return new Promise((resolve, reject) => {
      if (!username || (username && username.trim() === '')) return reject(new Error('Username must be provided.'));
      if (!password || (password && password.trim() === '')) return reject(new Error('Password must be provided.'));
      db.query<User[]>('SELECT * FROM members WHERE username = ? LIMIT 1', [username], async (err, results) => {
        if (err) return reject('Internal database error.');
        if (!results[0]) return reject(new Error('Bad username/password.'));
        const valid = await compare(password, results[0].password);
        if (!valid) return reject(new Error('Bad username/password.'));
        resolve(results[0]);
      });
    });
  }
}
