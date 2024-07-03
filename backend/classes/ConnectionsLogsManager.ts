import Base from './Base';
import type { ConnectionLog, ConnectionLogDB } from '../types';

export class ConnectionsLogsManager extends Base<ConnectionLog> {
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
  public createConnexion(connection: ConnectionLog) {
    return new Promise((resolve, reject) => {
      this.app.db.query<ConnectionLogDB[]>(
        'INSERT INTO connections (id, user_id, ip_adress, user_agent, location, type, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          connection.id,
          connection.user_id,
          connection.ip_adress,
          connection.user_agent,
          connection.location,
          connection.type,
          connection.timestamp,
        ],
        async err => {
          if (err) return reject('Internal database error.');
          resolve(connection);
        },
      );
    });
  }

  public validate(data: ConnectionLog): string | false {
    if (!data.id || data.id.length > 50) return 'connection log id invalid';
    if (!data.user_id || data.user_id.length > 50) return 'connection log user id invalid';
    if (!data.ip_adress || data.ip_adress.length > 50) return 'connection log ip adress invalid';
    if (data.user_agent && data.user_agent.length > 200) return 'connection log user agent invalid';
    if (data.location && data.location.length > 200) return 'connection log location invalid';
    if (!data.type || data.type.length > 10) return 'connection log type invalid';
    if (!data.timestamp || data.timestamp.length > 50) return 'connection log timestamp invalid';
    return false;
  }
}
