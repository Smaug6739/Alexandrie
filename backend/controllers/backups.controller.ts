import { createWriteStream, unlinkSync, readdirSync } from 'fs';
import { spawn } from 'child_process';
import { error, success } from '../utils/functions';
import type { Request, Response } from 'express';

export default class BackupController {
  app: App;
  constructor(app: App) {
    this.app = app;
  }

  async add(_: Request, res: Response) {
    // Clean the uploads directory
    const files = readdirSync(this.app.config.upload_path + '/backups');
    for (const file of files) {
      if (file.endsWith('.sql')) unlinkSync(`${this.app.config.upload_path}/backups/${file}`);
    }
    const name = `backup-${new Date().toISOString().split('T')[0]}-${Date.now()}`;
    const mysqldump = spawn('mysqldump', [
      '-u',
      `${process.env.DATABASE_USER}`,
      `-p${process.env.DATABASE_PASSWORD}`,
      'alexandrie',
    ]);

    const wstream = createWriteStream(`${this.app.config.upload_path}/backups/${name}.sql`);
    const backupPromise = new Promise<void | string>((resolve, reject) => {
      mysqldump.stdout
        .pipe(wstream)
        .on('finish', function () {
          resolve();
        })
        .on('error', function (err) {
          reject(err.message);
        });
    });
    backupPromise
      .then(() => res.json(success({ url: `/backups/${name}.sql` })))
      .catch((err: Error) => res.json(error(err.message)));
  }
}
