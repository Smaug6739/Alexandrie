import BaseController from './BaseController';
import { UsersManager } from '../classes';

import type { User } from '../types';
import type { Request, Response } from 'express';

export default class Authentification extends BaseController<UsersManager, User> {
  constructor(app: App) {
    super(new UsersManager(app));
  }
  public async getMe(req: Request, res: Response) {
    this.manager
      .getPublic(req.user_id as string)
      .then(r => res.status(200).json(this.utils.success(r)))
      .catch(e => res.status(500).json(this.utils.error(e)));
  }
}
