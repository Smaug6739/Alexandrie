import Base from './Base';
import type { ConnectionLog, ConnectionLogDB } from '../types';

export class ConnectionsLogsManager extends Base<ConnectionLog> {
  constructor(app: App) {
    super(app);
  }
  public getConnections(user_id: string): Promise<ConnectionLogDB[]> {
    return new Promise((resolve, reject) => {
      this.app.db.query<ConnectionLogDB[]>(
        'SELECT * FROM connections_logs WHERE user_id = ?',
        [user_id],
        async (err, results) => {
          if (err) return reject('Internal database error.');
          resolve(results);
        },
      );
    });
  }
  public createConnection(connection: ConnectionLog) {
    return new Promise((resolve, reject) => {
      this.app.db.query<ConnectionLogDB[]>(
        'INSERT INTO connections_logs (id, user_id, ip_adress, user_agent, location, type, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
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
    if (data.ip_adress && data.ip_adress.length > 50) return 'connection log ip adress invalid';
    if (data.user_agent && data.user_agent.length > 200) return 'connection log user agent invalid';
    if (data.location && data.location.length > 200) return 'connection log location invalid';
    if (!data.type || data.type.length > 10) return 'connection log type invalid';
    if (!data.timestamp || data.timestamp.length > 50) return 'connection log timestamp invalid';
    return false;
  }
  async getLocationFromIp(ip: string): Promise<string> {
    const ipType = this.ipType(ip);
    const location_id = ipType === 'ipv4' ? await this.getLocationIdFromIpV4(ip) : await this.getLocationIdFromIpV6(ip);
    if (!location_id) return 'Unknown';
    return new Promise((resolve, reject) => {
      this.app.db.query<ConnectionLogDB[]>(
        'SELECT * FROM City_Locations_fr WHERE geoname_id = ?',
        [location_id],
        async (err, results) => {
          if (err) return reject(err);
          const result = results?.[0];
          if (!result) return resolve('Unknown');
          resolve(
            `${result.city_name ? result.city_name + ', ' : ''}${
              result.subdivision_1_name ? result.subdivision_1_name + ', ' : ''
            }${result.country_name ? result.country_name : ''}`,
          );
        },
      );
    });
  }
  private ipType(ip: string): string {
    if (ip.includes(':')) return 'ipv6';
    return 'ipv4';
  }
  private getLocationIdFromIpV4(ip: string): Promise<string | undefined> {
    const ip_int = ip
      .split('.')
      .map(Number)
      .reduce((acc, cur, i) => acc + cur * 256 ** (3 - i), 0)
      .toString();
    return new Promise((resolve, reject) => {
      this.app.db.query<ConnectionLogDB[]>(
        'SELECT * FROM City_IPv4_complete WHERE ? BETWEEN network_start_integer AND network_last_integer',
        [ip_int],
        async (err, results) => {
          if (err) return reject('Internal database error.');
          resolve(results?.[0]?.geoname_id);
        },
      );
    });
  }
  private getLocationIdFromIpV6(ip: string): Promise<string | undefined> {
    const ip_int = ip
      .split(':')
      .map(str => BigInt(parseInt(str, 16)))
      .reduce(function (int, value) {
        return BigInt(int) * BigInt(65536) + BigInt(value);
      });

    console.log(ip_int);

    return new Promise((resolve, reject) => {
      this.app.db.query<ConnectionLogDB[]>(
        'SELECT * FROM City_IPv6_complete WHERE ? BETWEEN network_start_integer AND network_last_integer',
        [ip_int],
        async (err, results) => {
          if (err) return reject('Internal database error.');
          resolve(results?.[0]?.geoname_id);
        },
      );
    });
  }
}
