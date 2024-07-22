import * as fs from 'fs/promises';
import * as path from 'path';
import type { Request, Response } from 'express';
import BaseController from './BaseController';
import { BackupManager } from '../classes';

export default class BackupController extends BaseController<any> {
  constructor(app: any) {
    super(new BackupManager(app));
    this.app = app;
  }

  async add(req: Request, res: Response) {
    const userId = req.user_id;
    if (!userId) return res.status(401).send({ message: 'Unauthorized' });
    const date = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();
    const name = `backup-${date}-${timestamp}.json`;

    const backupDir = path.join(this.app.config.upload_path, 'backups', userId);
    const backupFile = path.join(backupDir, name);

    try {
      // Check if the directory exists
      try {
        await fs.access(backupDir);
        // If directory exists, clean it
        const files = await fs.readdir(backupDir);
        await Promise.all(files.map(file => fs.unlink(path.join(backupDir, file))));
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          // If directory does not exist, create it
          await fs.mkdir(backupDir, { recursive: true });
        } else {
          throw error;
        }
      }

      await this.manager.saveBackup(userId, backupFile);
      res.status(201).json(this.utils.success({ url: `/backups/${req.user_id}/${name}` }));
    } catch (err) {
      res.status(500).json(this.utils.error(err));
    }
  }
}
