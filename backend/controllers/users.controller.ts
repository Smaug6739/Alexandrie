import { hash } from 'bcrypt';
import BaseController from './BaseController';
import { UsersManager, ConnectionsLogsManager } from '../classes';

import type { Request, Response } from 'express';

export default class Authentification extends BaseController<UsersManager> {
  connections: ConnectionsLogsManager;
  constructor(app: App) {
    super(new UsersManager(app));
    this.connections = new ConnectionsLogsManager(app);
  }
  public async getMe(req: Request, res: Response) {
    try {
      const user = await this.manager.getPublic(req.user_id as string);
      const last_connection = await this.connections.getLastConnection(req.user_id as string);
      res.status(200).json(this.utils.success({ user, last_connection }));
    } catch (e) {
      res.status(500).json(this.utils.error(e));
    }
  }
  public async update(req: Request, res: Response) {
    const user_db = await this.manager.getById(req.params.id!);
    if (!user_db) return res.status(404).json(this.utils.error('User not found.'));
    if (req.params.id != req.user_id) return res.status(401).json(this.utils.error('Unauthorized'));
    return this.manager
      .put(req.params.id!, {
        username: user_db.username,
        firstname: req.body.firstname ?? user_db.firstname,
        lastname: req.body.lastname ?? user_db.lastname,
        avatar: req.body.avatar ?? user_db.avatar,
        email: req.body.email ?? user_db.email,
        updated_timestamp: Date.now().toString(),
      })
      .then(r => res.status(200).json(this.utils.success(r)))
      .catch(e => res.status(500).json(this.utils.error(e)));
  }
  public async updatePassword(req: Request, res: Response) {
    try {
      const passwordStr = req.body.password as string;
      if (!passwordStr) return res.status(400).json(this.utils.error('Password must be provided.'));
      if (req.params.id != req.user_id) return res.status(401).json(this.utils.error('Unauthorized'));
      const hashed = await hash(passwordStr, 10);
      const r = await this.manager.updatePassword({
        id: req.params.id!,
        password: hashed,
      });
      return res.status(200).json(this.utils.success(r));
    } catch (e) {
      return res.status(500).json(this.utils.error(e));
    }
  }
}
