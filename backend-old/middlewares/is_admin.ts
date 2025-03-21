import { error } from '../utils';
import type { Request, Response } from 'express';

export default (req: Request, res: Response, next: Function) => {
  try {
    if (req.user_role !== 2) throw 'Unauthorized';
    return next();
  } catch (err) {
    res.status(403).json(error(err));
  }
};
