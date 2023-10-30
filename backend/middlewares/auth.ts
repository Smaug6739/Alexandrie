import { verify } from 'jsonwebtoken';
import { error } from '../utils/functions';
import type { Request, Response } from 'express';

export default (req: Request, res: Response, next: Function) => {
  try {
    const cookies = req.headers.cookie;
    if (cookies) {
      req.cookies = cookies.split(';').reduce((obj: any, c: string) => {
        var n: any = c.trim().split('=');
        obj[n[0]] = n[1].trim();
        return obj;
      }, {});
    }
    if (!req.cookies) throw 'Missing cookies';
    if (!req.cookies.user_token) throw 'Missing token cookie.';
    if (!req.cookies.user_id) throw 'Missing token cookie.';
    if (!process.env.JWT_SECRET) throw 'Missing JWT_SECRET';
    const decoded: any = verify(req.cookies.user_token, process.env.JWT_SECRET);
    if (req.cookies.user_id != decoded.userId) throw 'Bad user';
    return next();
  } catch (err) {
    return res.status(401).json(error('Requete non authentifiée'));
  }
};
