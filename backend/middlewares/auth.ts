import { verify } from 'jsonwebtoken';
import { parseCookies, error } from '../utils';
import type { Request, Response } from 'express';

if (!process.env.JWT_SECRET) throw 'Missing JWT_SECRET';

export default (req: Request, res: Response, next: Function) => {
  try {
    req.cookies = parseCookies(req.headers.cookie);
    if (!req.cookies) throw 'Missing cookies';
    if (!req.cookies.user_token) throw 'Missing token cookies.';
    verify(req.cookies.user_token, process.env.JWT_SECRET!, async (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json(error('Requete non authentifiée'));
      }
      req.user_id = decoded.userId;
      return next();
    });
  } catch (err) {
    res.status(401).json(error('Requete non authentifiée'));
  }
};
