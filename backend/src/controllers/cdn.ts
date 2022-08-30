import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';
import { IObject } from '../types';
import { error, success } from '../utils/functions';

export function uploadImage(req: IObject, res: IObject): void {
  const file = req.files.file[0].filename;
  const path = join(__dirname, `../../public/uploads/images/${file}`);

  if (existsSync(path)) {
    sharp(path)
      .toFile(join(__dirname, `../../public/uploads/images/webp/${file}.webp`))
      .then(() => {
        res.status(200).json(success(`/uploads/images/webp/${file}.webp`));
      })
      .catch(err => {
        console.log(err);

        res.status(500).json({
          success: false,
          message: 'Error uploading image',
        });
      });
  } else res.status(404).json(error('File not found.'));
}
