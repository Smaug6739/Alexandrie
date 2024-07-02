import UsersManager from '../classes/Users';
import ConnectionsManager from '../classes/ConnectionsManager';
import { success, error } from '../utils/functions';
import { sign } from 'jsonwebtoken';

import { Connection, User } from '../types';
import { compare } from 'bcrypt';
import { randomBytes } from 'crypto';
import { parseCookies } from '../utils/functions';

import type { CookieOptions, Request, Response } from 'express';

const COOKIE_CONFIG: CookieOptions = {
  httpOnly: true,
  domain: process.env.FRONT_DOMAIN,
  secure: process.env.NODE_ENV == 'production' ? true : false,
  sameSite: 'lax',
};

export default class Authentification {
  usersManager: UsersManager;
  connectionsManager: ConnectionsManager;
  constructor(app: App) {
    this.usersManager = new UsersManager(app);
    this.connectionsManager = new ConnectionsManager(app);
  }
  async authentification(_: App, req: Request, res: Response) {
    try {
      const user = await this.usersManager.get(req.body.username);
      if (!user) throw new Error('Bad username/password.');
      if (!(await this.check_password(user, req.body.password))) throw new Error('Bad username/password.');
      const connection: Connection = await this.connectionsManager.getConnection(user.id);

      if (!connection.refresh_token || connection.expire_token < Date.now()) {
        connection.refresh_token = randomBytes(64).toString('hex');
        connection.expire_token = Date.now() + 3600000 * 24 * 1; // 1 day
      }
      const in_database = connection.last_login != 0;
      connection.last_login = Date.now();
      if (in_database) await this.connectionsManager.updateConnection(connection);
      else await this.connectionsManager.createConnection(connection);
      const accessToken = sign({ userId: user.id }, process.env.JWT_SECRET || '', { expiresIn: '18s' });
      console.log(`[AUTH] User ${user.id} connected. Signing new token...`);
      res.cookie('user_token', `${accessToken}`, { ...COOKIE_CONFIG, maxAge: 3600000 * 0.5 });
      res.cookie('user_refresh_token', `${connection.refresh_token}`, { ...COOKIE_CONFIG, maxAge: 3600000 * 24 * 1 });
      res.cookie('user_auth', `true`, { ...COOKIE_CONFIG, httpOnly: false });
      res.status(200).json(success({ auth: true }));
    } catch (e) {
      if (e instanceof Error) res.status(401).json(error(e.message));
      else res.status(500).json(error(String(e)));
    }
  }
  disconnection(_: App, __: Request, res: Response): void {
    res.clearCookie('user_auth', { domain: process.env.FRONT_DOMAIN });
    res.clearCookie('user_id', { domain: process.env.FRONT_DOMAIN });
    res.clearCookie('user_token', { domain: process.env.FRONT_DOMAIN });
    res.status(200).json(success('success'));
  }
  async check_password(user: User, password: string): Promise<boolean> {
    const valid = await compare(password, user.password);
    return valid;
  }
  async refresh_access_token(req: Request, res: Response) {
    req.cookies = parseCookies(req.headers.cookie);
    try {
      const userId = req.params.user_id;
      const refreshToken = req.cookies.user_refresh_token;
      if (!refreshToken) throw 'No refresh token provided';
      if (!userId) throw 'No user id provided';

      // Check if refresh token is valid
      const connection = await this.connectionsManager.getConnection(userId);
      if (connection.refresh_token !== refreshToken || connection.expire_token < Date.now()) throw 'Invalid refresh token';

      // Check if user still exists
      const user = await this.usersManager.getById(userId);
      if (!user) throw 'User not found'; // if user deleted account

      const accessToken = sign({ userId }, process.env.JWT_SECRET || '', { expiresIn: '18s' });
      res.cookie('user_token', `${accessToken}`, { ...COOKIE_CONFIG, maxAge: 3600000 * 0.5 });
      res.status(200).json(success({ auth: true }));
    } catch (e) {
      res.status(401).json(error(e));
    }
  }
}
