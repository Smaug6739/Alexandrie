import { randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';

import BaseController from './BaseController';
import { UsersManager, SessionsManager, ConnectionsLogsManager } from '../classes';

import type { Session, User, ConnectionLog } from '../types';
import type { Request, Response } from 'express';

export default class Authentification extends BaseController<UsersManager, User> {
  sessions: SessionsManager;
  logs: ConnectionsLogsController;
  constructor(app: App) {
    super(new UsersManager(app));
    this.sessions = new SessionsManager(app);
    this.logs = new ConnectionsLogsController(app);
  }
  public async login(req: Request, res: Response) {
    try {
      this.app.logger.info(`[AUTH] User ${req.body.username} is trying to connect...`);
      const user = await this.manager.get(req.body.username);
      if (!user) throw new Error('Bad username/password.');
      if (!(await this.check_password(user, req.body.password))) throw new Error('Bad username/password.');
      const session: Session = {
        id: this.app.snowflake.generate().toString(),
        user_id: user.id,
        refresh_token: this.generate_refresh_token(),
        expire_token: (Date.now() + this.app.config.refresh_token_expiration).toString(),
        last_refresh_timestamp: '0',
        active: 1,
        login_timestamp: Date.now().toString(),
        logout_timestamp: '0',
      };

      await this.sessions.createConnection(session);
      const accessToken = this.sign_access_token(user);
      console.log(`[AUTH] User ${user.id} connected. Signing new token...`);
      this.set_cookies(res, accessToken, session.refresh_token);
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(this.utils.success({ auth: true, user: userWithoutPassword }));

      this.app.logger.success(`[AUTH] User ${user.username} connected.`);
      this.logs.add(req, 'login', user.id);
    } catch (e) {
      res.status(500).json(this.utils.error(e));
    }
  }
  public logout(_: Request, res: Response): void {
    res.clearCookie('user_auth', { domain: process.env.FRONT_DOMAIN });
    res.clearCookie('user_id', { domain: process.env.FRONT_DOMAIN });
    res.clearCookie('user_token', { domain: process.env.FRONT_DOMAIN });
    res.status(200).json(this.utils.success({ auth: false }));
  }

  public async refresh_session(req: Request, res: Response) {
    this.app.logger.info(`[AUTH] Refreshing access token...`);
    req.cookies = this.utils.parseCookies(req.headers.cookie);
    const refreshToken = req.cookies.user_refresh_token;
    try {
      if (!refreshToken) throw 'No refresh token provided';

      // Check if refresh token is valid
      const session = await this.sessions.getSession(refreshToken);
      if (!session) throw 'Session not found';
      if (BigInt(session.expire_token) < Date.now()) throw 'Refresh_token expired';

      // Check if user still exists
      const user = await this.manager.getById(session?.user_id);
      if (!user) throw 'User not found'; // if user deleted account

      const new_session: Session = await this.sessions.updateConnection({
        ...session,
        refresh_token: this.generate_refresh_token(),
        expire_token: (Date.now() + this.app.config.refresh_token_expiration).toString(),
        last_refresh_timestamp: Date.now().toString(),
      });
      const accessToken = this.sign_access_token(user);
      this.set_cookies(res, accessToken, new_session.refresh_token);
      res.status(200).json(this.utils.success({ auth: true }));
      this.app.logger.success(`[AUTH] User ${user.username} refreshed token.`);
    } catch (e) {
      this.app.logger.error(`[AUTH] Error while refreshing token: ${e}`);
      this.sessions.deleteSession(refreshToken);
      res.status(401).json(this.utils.error(e));
    }
  }
  private async check_password(user: User, password: string): Promise<boolean> {
    const valid = await compare(password, user.password);
    return valid;
  }
  private sign_access_token(user: User): string {
    return sign({ userId: user.id }, process.env.JWT_SECRET || '', {
      expiresIn: this.app.config.access_token_expiration,
    });
  }
  private generate_refresh_token(): string {
    return randomBytes(40).toString('hex');
  }
  private set_cookies(res: Response, accessToken: string, refreshToken: string): void {
    res.cookie('user_token', `${accessToken}`, {
      ...this.utils.COOKIE_CONFIG,
      maxAge: this.app.config.access_token_expiration_ms,
    });
    res.cookie('user_refresh_token', `${refreshToken}`, {
      ...this.utils.COOKIE_CONFIG,
      maxAge: this.app.config.refresh_token_expiration,
    });
  }
}

class ConnectionsLogsController extends BaseController<ConnectionsLogsManager, ConnectionLog> {
  constructor(app: App) {
    super(new ConnectionsLogsManager(app));
  }

  async add(req: Request, type: string, user_id: string) {
    this.app.logger.info(`[CONNECTIONS LOGS] Adding connection log...`);
    try {
      const ip = req.ip || req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || '';
      const location = await this.manager.getLocationFromIp(ip);
      const connectionLog: ConnectionLog = {
        id: this.app.snowflake.generate().toString(),
        user_id,
        ip_adress: ip,
        user_agent: req.get('user-agent'),
        location,
        type,
        timestamp: Date.now().toString(),
      };
      const err = this.manager.validate(connectionLog);
      if (!err) this.manager.createConnection(connectionLog);
    } catch (e) {
      this.app.logger.error(`[CONNECTIONS LOGS] Error while adding connection log: ${e}`);
    }
  }
}
