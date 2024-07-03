import Base from './Base';
import type { Connection, ConnectionDB } from '../types';

export class ConnectionsManager extends Base<Connection> {
  constructor(app: App) {
    super(app);
  }
  public getConnection(user_id: string): Promise<Connection> {
    return new Promise((resolve, reject) => {
      this.app.db.query<ConnectionDB[]>('SELECT * FROM users_auth WHERE user_id = ?', [user_id], async (err, results) => {
        if (err) return reject('Internal database error.');
        resolve(results[0] || { user_id, refresh_token: '', expire_token: '0', last_login: '0', last_logout: '0' });
      });
    });
  }
  public createConnection(connection: Connection) {
    return new Promise((resolve, reject) => {
      this.app.db.query<ConnectionDB[]>(
        'INSERT INTO users_auth (user_id, refresh_token, expire_token, last_login, last_logout) VALUES (?, ?, ?, ?, ?)',
        [connection.user_id, connection.refresh_token, connection.expire_token, connection.last_login, connection.last_logout],
        async err => {
          if (err) return reject('Internal database error.');
          resolve(connection);
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
          resolve(connection);
        },
      );
    });
  }
  public validate(data: Connection): string | false {
    if (!data.user_id || data.user_id.length > 50) return 'connection user id invalid';
    if (data.refresh_token && data.refresh_token.length > 200) return 'connection refresh token invalid';
    if (!data.expire_token) return 'connection expire token invalid';
    if (!data.last_login) return 'connection last login invalid';
    if (!data.last_logout) return 'connection last logout invalid';
    return false;
  }
}
