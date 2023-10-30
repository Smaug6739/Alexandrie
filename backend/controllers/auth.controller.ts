import UsersManager from '../classes/Users';
import { success, error } from '../utils/functions';
import { sign } from 'jsonwebtoken';
import type { CookieOptions, Request, Response } from 'express';
import type { App } from '../app';

const COOKIE_CONFIG: CookieOptions = {
  maxAge: 3600000 * 3,
  httpOnly: true,
  domain: process.env.FRONT_DOMAIN,
  secure: process.env.NODE_ENV == 'production' ? true : false,
  sameSite: 'lax',
};

export default class Authentification {
  Users: UsersManager;
  constructor(app: App) {
    this.Users = new UsersManager(app);
  }
  authentification(_: App, req: Request, res: Response): void {
    this.Users.auth(req.body.username, req.body.password)
      .then(result => {
        const token = sign({ expiresIn: '6h', userId: result.id }, process.env.JWT_SECRET || '');
        res.cookie('user_token', `${token}`, COOKIE_CONFIG); //process.env.NODE_ENV == 'production' ? 'None' : 'lax'
        res.cookie('user_id', `${result.id}`, COOKIE_CONFIG); //process.env.NODE_ENV == 'production' ? 'None' : 'lax'
        res.cookie('user_auth', `true`, { ...COOKIE_CONFIG, httpOnly: false }); //process.env.NODE_ENV == 'production' ? 'None' : 'lax'
        res.status(200).json(success({ auth: true }));
      })
      .catch(e => res.json(error(e)));
  }
  disconnection(_: App, __: Request, res: Response): void {
    res.clearCookie('user_auth', { domain: process.env.FRONT_DOMAIN });
    res.clearCookie('user_id', { domain: process.env.FRONT_DOMAIN });
    res.clearCookie('user_token', { domain: process.env.FRONT_DOMAIN });
    res.status(200).json(success('success'));
  }
}
