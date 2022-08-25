import { IObject } from '../types';
import { verify } from 'jsonwebtoken';
import { config } from '../config';
import { error } from '../utils/functions';

export default (req: IObject, res: IObject, next: any) => {
  try {
    var cookies = req.headers.cookie;
    if (cookies) {
      req.cookies = cookies.split(';').reduce((obj: Array<string>, c: string) => {
        var n: any = c.trim().split('=');
        obj[n[0]] = n[1].trim();
        return obj;
      }, {});
    }
    if (!req.cookies) throw 'Missing cookies';
    if (!req.cookies.user_token) throw 'Missing token cookie.';
    if (!req.cookies.user_id) throw 'Missing token cookie.';
    const decoded: any = verify(req.cookies.user_token, config.secret);
    if (req.cookies.user_id != decoded.userId) throw 'Bad user';
    next();
  } catch (err) {
    console.log(err);

    return res.status(401).json(error('Requete non authentifiée'));
  }
};
