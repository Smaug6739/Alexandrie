import Base from './Base';
import { Validator } from './Validator';
import type { Session, SessionDB } from '../types';

export class SessionsManager extends Base {
  constructor(app: App) {
    super(app);
    this.deleteOldSessions();
    setInterval(() => this.deleteOldSessions(), 1000 * 60 * 60); // 1 hour
  }

  public validator = new Validator({
    id: { minLength: 1, maxLength: 50, type: 'string', error: 'session id invalid' },
    user_id: { minLength: 1, maxLength: 50, type: 'string', error: 'session user id invalid' },
    refresh_token: { maxLength: 200, type: 'string', error: 'session refresh token invalid', optional: true },
    expire_token: { minLength: 1, maxLength: 50, type: 'string', error: 'session expire token invalid' },
    last_refresh_timestamp: { minLength: 1, maxLength: 50, type: 'string', error: 'session last refresh invalid' },
    active: { type: 'number', error: 'session active invalid' },
    login_timestamp: { minLength: 1, maxLength: 50, type: 'string', error: 'session last login invalid' },
    logout_timestamp: { minLength: 1, maxLength: 50, type: 'string', error: 'session last logout invalid' },
  });

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
  markSessionInactive(refresh_token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.app.db.query<SessionDB[]>('UPDATE sessions SET active = 0 WHERE refresh_token = ?', [refresh_token], async err => {
        if (err) return reject('Internal database error.');
        resolve(true);
      });
    });
  }
  markAllSessionsInactive(user_id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.app.db.query<SessionDB[]>('UPDATE sessions SET active = 0 WHERE user_id = ?', [user_id], async err => {
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
}
