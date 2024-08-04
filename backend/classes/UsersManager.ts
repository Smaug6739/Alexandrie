import Base from './Base';
import { Validator } from './Validator';
import type { User, UserDB } from '../types';

export class UsersManager extends Base {
  constructor(app: App) {
    super(app);
  }

  public validator = new Validator({
    id: { maxLength: 50, type: 'string', error: 'user id invalid' },
    username: { minLength: 5, maxLength: 25, type: 'string', error: 'user username invalid' },
    firstname: { maxLength: 25, type: 'string', error: 'user firstname invalid', optional: true },
    lastname: { maxLength: 25, type: 'string', error: 'user lastname invalid', optional: true },
    role: { minLength: 1, maxLength: 3, type: 'number', error: 'user role invalid' },
    avatar: { maxLength: 75, type: 'string', error: 'user avatar invalid', optional: true },
    email: { maxLength: 50, type: 'string', error: 'user email invalid' },
    password: { maxLength: 255, type: 'string', error: 'user password invalid' },
    created_timestamp: { maxLength: 50, type: 'string', error: 'user created timestamp invalid' },
    updated_timestamp: { maxLength: 50, type: 'string', error: 'user updated timestamp invalid' },
  });

  public get(username: string): Promise<UserDB> {
    return new Promise((resolve, reject) => {
      this.app.db.query<UserDB[]>('SELECT * FROM users WHERE username = ? LIMIT 1', [username], async (err, results) => {
        if (err) return reject('Internal database error.');
        if (!results[0]) return reject('Bad username or password.');
        resolve(results[0]);
      });
    });
  }
  public getAll(): Promise<UserDB[]> {
    return new Promise((resolve, reject) => {
      this.app.db.query<UserDB[]>(
        'SELECT id, username, firstname, lastname, role, avatar, email, created_timestamp, updated_timestamp FROM users',
        async (err, results) => {
          if (err) return reject('Internal database error.');
          resolve(results);
        },
      );
    });
  }
  public exists(username: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.app.db.query<UserDB[]>('SELECT id FROM users WHERE username = ? LIMIT 1', [username], async (err, results) => {
        if (err) return reject('Internal database error.');
        resolve(!!results[0]);
      });
    });
  }
  public getPublic(id: string): Promise<UserDB> {
    return new Promise((resolve, reject) => {
      this.app.db.query<UserDB[]>(
        'SELECT id, username, firstname, lastname, role, avatar, email, created_timestamp, updated_timestamp FROM users WHERE id = ?',
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
      this.app.db.query<UserDB[]>('SELECT * FROM users WHERE id = ?', [id], async (err, results) => {
        if (err) return reject('Internal database error.');
        if (!results[0]) return reject('Bad user id.');
        resolve(results[0]);
      });
    });
  }
  public post(data: User) {
    return new Promise((resolve, reject) => {
      this.app.db.query<UserDB[]>(
        'INSERT INTO users (id, username, firstname, lastname, role, avatar, email, password, created_timestamp, updated_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          data.id,
          data.username,
          data.firstname,
          data.lastname,
          data.role,
          data.avatar,
          data.email,
          data.password,
          data.created_timestamp,
          data.updated_timestamp,
        ],
        err => {
          if (err) return reject('Internal database error.');
          resolve(data);
        },
      );
    });
  }
  public put(id: string, data: Omit<User, 'id' | 'password' | 'created_timestamp'>) {
    return new Promise((resolve, reject) => {
      const error = this.validator.validate(data);
      if (error) return reject(error);
      this.app.db.query<UserDB[]>(
        'UPDATE users SET firstname = ?, lastname = ?, avatar = ?, email = ?, updated_timestamp = ? WHERE id = ?',
        [data.firstname, data.lastname, data.avatar, data.email, data.updated_timestamp, id],
        err => {
          if (err) return reject('Internal database error.');
          resolve({ id, ...data });
        },
      );
    });
  }
  public updatePassword(data: Pick<User, 'password' | 'id'>) {
    return new Promise((resolve, reject) => {
      const error = this.validator.validate(data);
      if (error) return reject(error);
      this.app.db.query<UserDB[]>('UPDATE users SET password = ? WHERE id = ?', [data.password, data.id], err => {
        if (err) return reject('Internal database error.');
        resolve(true);
      });
    });
  }
}
