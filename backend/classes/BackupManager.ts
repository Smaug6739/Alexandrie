import Base from './Base';
import { JsonStreamStringify } from 'json-stream-stringify';
import { createWriteStream } from 'fs';
import { Validator } from './Validator';

export class BackupManager extends Base {
  constructor(app: App) {
    super(app);
  }

  public validator = new Validator({});

  public saveBackup(user_id: string, file_path: string) {
    return new Promise((resolve, reject) => {
      const stream = this.app.db.query('SELECT * from `documents` WHERE `author_id` = ?', [user_id]).stream();
      const writeStream = createWriteStream(file_path);
      new JsonStreamStringify(stream).pipe(writeStream).on('error', (err: Error) => reject(err));

      writeStream.on('finish', () => resolve(file_path));
    });
  }
}
