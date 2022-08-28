import db from '../models/db';
import { IObject } from '../types';
import { compare } from 'bcrypt';
import type { RowDataPacket } from 'mysql2';

interface IUser extends RowDataPacket {
  id: string;
  username: string;
  permissions: number;
  banishment: number;
  avatar: string;
  password: string;
  first_name: string;
  last_name: string;
  age: string;
  phone_number: string;
  email: string;
  date_insert: number;
}

export class MemberClass {
  public auth(username: string, password: string): Promise<IObject> {
    return new Promise((resolve, reject) => {
      if (!username || (username && username.trim() === '')) return reject(new Error('Username must be provided.'));
      if (!password || (password && password.trim() === '')) return reject(new Error('Password must be provided.'));
      db.query<IUser[]>('SELECT * FROM members WHERE username = ? LIMIT 1', [username], (err, result: Array<IObject>): void => {
        if (err) return reject(new Error(err.message));
        if (result[0]) {
          compare(password, result[0].password).then((valid: Boolean): void => {
            if (!valid) return reject(new Error('Bad username/password.'));
            else return resolve(result[0]);
          });
        } else return reject(new Error('Bad username/password.'));
      });
    });
  }
}
