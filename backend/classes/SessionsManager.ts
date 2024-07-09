import Base from './Base';
import type { Session, SessionDB } from '../types';

export class SessionsManager extends Base<Session> {
  constructor(app: App) {
    super(app);
    setInterval(() => this.deleteOldSessions(), 1000 * 60 * 60); // 1 hour
  }
  public getSession(token: string): Promise<Session | undefined> {
    return new Promise((resolve, reject) => {
      this.app.db.query<SessionDB[]>('SELECT * FROM sessions WHERE refresh_token = ?', [token], async (err, results) => {
        if (err) return reject('Internal database error.');
        resolve(results[0]);
      });
    });
  }
  public createConnection(session: Session) {
    return new Promise((resolve, reject) => {
      this.app.db.query<SessionDB[]>(
        'INSERT INTO sessions (id, user_id, refresh_token, expire_token, last_refresh_timestamp, active, login_timestamp, logout_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          session.id,
          session.user_id,
          session.refresh_token,
          session.expire_token,
          session.last_refresh_timestamp,
          session.active,
          session.login_timestamp,
          session.logout_timestamp,
        ],
        async err => {
          if (err) return reject('Internal database error.');
          resolve(session);
        },
      );
    });
  }
  public updateConnection(session: Session): Promise<Session> {
    return new Promise((resolve, reject) => {
      this.app.db.query<SessionDB[]>(
        'UPDATE sessions SET refresh_token = ?, expire_token = ?, last_refresh_timestamp = ?, active = ?, login_timestamp = ?, logout_timestamp = ? WHERE id = ?',
        [
          session.refresh_token,
          session.expire_token,
          session.last_refresh_timestamp,
          session.active,
          session.login_timestamp,
          session.logout_timestamp,
          session.id,
        ],
        async err => {
          if (err) return reject('Internal database error.');
          resolve(session);
        },
      );
    });
  }
  deleteSession(refresh_token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.app.db.query<SessionDB[]>('DELETE FROM sessions WHERE refresh_token = ?', [refresh_token], async err => {
        if (err) return reject('Internal database error.');
        resolve(true);
      });
    });
  }
  deleteOldSessions(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.app.logger.info('[SESSIONS] Deleting old sessions...');
      this.app.db.query<SessionDB[]>(
        'DELETE FROM sessions WHERE expire_token < ? OR active = 0',
        [Date.now().toString()],
        async err => {
          if (err) return reject('Internal database error.');
          resolve(true);
        },
      );
    });
  }
  public validate(data: Session): string | false {
    if (!data.id || data.id.length > 50) return 'session user id invalid';
    if (!data.user_id || data.user_id.length > 50) return 'session user id invalid';
    if (data.refresh_token && data.refresh_token.length > 200) return 'session refresh token invalid';
    if (!data.expire_token) return 'session expire token invalid';
    if (!data.last_refresh_timestamp) return 'session last refresh invalid';
    if (data.active != 0 && data.active != 1) return 'session active invalid';
    if (!data.login_timestamp) return 'session last login invalid';
    if (!data.logout_timestamp) return 'session last logout invalid';
    return false;
  }
}
