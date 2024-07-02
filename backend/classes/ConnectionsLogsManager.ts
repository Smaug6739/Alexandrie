import Base from './Base';
import type { ConnectionLog, ConnectionLogDB } from '../types';

export default class ConnectionsLogsManager extends Base {
  constructor(app: App) {
    super(app);
  }
  public getConnections(user_id: string): Promise<ConnectionLogDB[]> {
    return new Promise((resolve, reject) => {
      this.app.db.query<ConnectionLogDB[]>('SELECT * FROM connections WHERE user_id = ?', [user_id], async (err, results) => {
        if (err) return reject('Internal database error.');
        resolve(results);
      });
    });
  }
  public createConnexion(connection: Omit<ConnectionLog, 'id' | 'timestamp'>) {
    return new Promise((resolve, reject) => {
      const time = Date.now().toString();
      const id = this.app.snowflake.generate().toString();
      this.app.db.query<ConnectionLogDB[]>(
        'INSERT INTO connections (id, user_id, ip_adress, user_agent, location, type, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, connection.user_id, connection.ip_adress, connection.user_agent, connection.location, connection.type, time],
        async err => {
          if (err) return reject('Internal database error.');
          resolve({ id, ...connection, created_timestamp: time });
        },
      );
    });
  }
}
