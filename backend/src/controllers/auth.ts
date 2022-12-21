import { MemberClass } from '../classes/Members';
import { checkAndChange } from '../utils/functions';
import { sign } from 'jsonwebtoken';
import type { Request, Response } from 'express';
import type { App } from '../app';

const Members = new MemberClass();

export function auth(client: App, req: Request, res: Response): void {
  Members.auth(req.body.username, req.body.password)
    .then(result => {
      const token = sign(
        {
          exp: Math.floor(Math.floor(Date.now() / 1000) + 6 * 60 * 60),
          expiresIn: 20000,
          userId: result.id,
          userPermissions: result.permissions,
        },
        process.env.JWT_SECRET || '',
      );
      res.cookie('user_token', `${token}`, {
        maxAge: 3600000 * 3,
        httpOnly: true,
        domain: process.env.FRONT_DOMAIN,
        secure: process.env.NODE_ENV == 'production' ? true : false,
        sameSite: 'lax',
      }); //process.env.NODE_ENV == 'production' ? 'None' : 'lax'
      res.cookie('user_id', `${result.id}`, {
        maxAge: 3600000 * 3,
        httpOnly: true,
        domain: process.env.FRONT_DOMAIN,
        secure: process.env.NODE_ENV == 'production' ? true : false,
        sameSite: 'lax',
      }); //process.env.NODE_ENV == 'production' ? 'None' : 'lax'
      res.cookie('user_auth', `true`, {
        maxAge: 3600000 * 3,
        httpOnly: false,
        domain: process.env.FRONT_DOMAIN,
        secure: process.env.NODE_ENV == 'production' ? true : false,
        sameSite: 'lax',
      }); //process.env.NODE_ENV == 'production' ? 'None' : 'lax'
      res.status(200).json(
        checkAndChange({
          auth: {
            auth: true,
          },
        }),
      );
    })
    .catch(error => res.json(checkAndChange(error)));
}
export function disconnection(client: App, req: Request, res: Response): void {
  res.clearCookie('user_auth', { domain: process.env.FRONT_DOMAIN });
  res.clearCookie('user_id', { domain: process.env.FRONT_DOMAIN });
  res.clearCookie('user_token', { domain: process.env.FRONT_DOMAIN });
  res.status(200).json(checkAndChange('success'));
}
