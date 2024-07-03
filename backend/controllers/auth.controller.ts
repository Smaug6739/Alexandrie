import { randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';

import BaseController from './BaseController';
import { UsersManager, ConnectionsManager } from '../classes';
import type { Connection, User } from '../types';
import type { Request, Response } from 'express';

export default class Authentification extends BaseController<UsersManager, User> {
  connectionsManager: ConnectionsManager;
  constructor(app: App) {
    super(new UsersManager(app));
    this.connectionsManager = new ConnectionsManager(app);
  }
  async authentification(_: App, req: Request, res: Response) {
    try {
      console.log('\x1b[44m[AUTH]\x1b[0m Initial connection');
      const user = await this.manager.get(req.body.username);
      if (!user) throw new Error('Bad username/password.');
      if (!(await this.check_password(user, req.body.password))) throw new Error('Bad username/password.');
      const connection: Connection = await this.connectionsManager.getConnection(user.id);

      if (!connection.refresh_token || BigInt(connection.expire_token) < Date.now()) {
        connection.refresh_token = randomBytes(64).toString('hex');
        connection.expire_token = (Date.now() + this.app.config.refresh_token_expiration).toString(); // 1 day
      }
      const in_database = connection.last_login != '0';
      connection.last_login = Date.now().toString();
      if (in_database) await this.connectionsManager.updateConnection(connection);
      else await this.connectionsManager.createConnection(connection);
      const accessToken = sign({ userId: user.id }, process.env.JWT_SECRET || '', {
        expiresIn: this.app.config.access_token_expiration,
      });
      console.log(`[AUTH] User ${user.id} connected. Signing new token...`);
      res.cookie('user_token', `${accessToken}`, { ...this.utils.COOKIE_CONFIG });
      res.cookie('user_refresh_token', `${connection.refresh_token}`, { ...this.utils.COOKIE_CONFIG, maxAge: 3600000 * 24 * 1 });
      res.cookie('user_auth', `true`, { ...this.utils.COOKIE_CONFIG, httpOnly: false });
      res.status(200).json(this.utils.success({ auth: true }));
      console.log('\x1b[42m[AUTH]\x1b[0m Connection successful');
    } catch (e) {
      console.log('\x1b[41m[AUTH]\x1b[0m Error during initial connection');
      console.error(e);
      res.status(500).json(this.utils.error(e));
    }
  }
  disconnection(_: App, __: Request, res: Response): void {
    res.clearCookie('user_auth', { domain: process.env.FRONT_DOMAIN });
    res.clearCookie('user_id', { domain: process.env.FRONT_DOMAIN });
    res.clearCookie('user_token', { domain: process.env.FRONT_DOMAIN });
    res.status(200).json(this.utils.success({ auth: false }));
  }
  async check_password(user: User, password: string): Promise<boolean> {
    const valid = await compare(password, user.password);
    return valid;
  }
  async refresh_access_token(req: Request, res: Response) {
    console.log('\x1b[44m[AUTH]\x1b[0m Refreshing access token');
    req.cookies = this.utils.parseCookies(req.headers.cookie);
    const userId = req.params.user_id;
    const refreshToken = req.cookies.user_refresh_token;
    try {
      if (!refreshToken) throw 'No refresh token provided';
      if (!userId) throw 'No user id provided';

      // Check if refresh token is valid
      const connection = await this.connectionsManager.getConnection(userId);
      if (connection.refresh_token !== refreshToken || BigInt(connection.expire_token) < Date.now())
        throw 'Invalid refresh token';

      // Check if user still exists
      const user = await this.manager.getById(userId);
      if (!user) throw 'User not found'; // if user deleted account
      connection.expire_token = (Date.now() + this.app.config.refresh_token_expiration).toString(); // 1 day
      await this.connectionsManager.updateConnection(connection);
      const accessToken = sign({ userId }, process.env.JWT_SECRET || '', { expiresIn: this.app.config.access_token_expiration });
      res.cookie('user_token', `${accessToken}`, { ...this.utils.COOKIE_CONFIG });
      res.status(200).json(this.utils.success({ auth: true }));
      console.log('\x1b[42m[AUTH]\x1b[0m Access token refreshed');
    } catch (e) {
      console.log('\x1b[41m[AUTH]\x1b[0m Error during refresh access token');
      console.error(e);
      res.clearCookie('user_auth');
      res.status(401).json(this.utils.error(e));
    }
  }
}
