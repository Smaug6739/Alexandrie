import Base from './Base';
import type { Connection, ConnectionDB } from '../types';

export default class ConnectionsLogsManager extends Base {
  constructor(app: App) {
    super(app);
  }
  public getConnection(user_id: string): Promise<Connection> {
    return new Promise((resolve, reject) => {
      this.app.db.query<ConnectionDB[]>('SELECT * FROM users_auth WHERE user_id = ?', [user_id], async (err, results) => {
        if (err) return reject('Internal database error.');
        resolve(results[0] || { user_id, refresh_token: '', expire_token: 0, last_login: 0, last_logout: 0 });
      });
    });
  }
  public createConnection(connection: Connection) {
    return new Promise((resolve, reject) => {
      this.app.db.query<ConnectionDB[]>(
        'INSERT INTO users_auth (user_id, refresh_token, expire_token, last_login, last_logout) VALUES (?, ?, ?, ?, ?)',
        [connection.user_id, connection.refresh_token, connection.expire_token, connection.last_login, connection.last_logout],
        async err => {
          console.log(err);

          if (err) return reject('Internal database error.');
          resolve({ ...connection });
        },
      );
    });
  }
  public updateConnection(connection: Connection) {
    return new Promise((resolve, reject) => {
      this.app.db.query<ConnectionDB[]>(
        'UPDATE users_auth SET refresh_token = ?, expire_token = ?, last_login = ?, last_logout = ? WHERE user_id = ?',
        [connection.refresh_token, connection.expire_token, connection.last_login, connection.last_logout, connection.user_id],
        async err => {
          if (err) return reject('Internal database error.');
          resolve({ ...connection });
        },
      );
    });
  }
}
