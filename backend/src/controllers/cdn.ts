import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';
import { error, success } from '../utils/functions';
import type { Response } from 'express';

export function uploadImage(req: any, res: Response) {
  const file = req.files?.file[0]?.filename;
  if (!file) return res.status(400).json(error('No file provided.'));
  const path = join(__dirname, `../../public/uploads/images/${file}`);

  if (existsSync(path)) {
    sharp(path)
      .toFile(join(__dirname, `../../public/uploads/webp/${file}.webp`))
      .then(() => {
        res.status(200).json(success(`/uploads/webp/${file}.webp`));
      })
      .catch(_ => {
        res.status(500).json({
          success: false,
          message: 'Error uploading image',
        });
      });
  } else res.status(404).json(error('File not found.'));
}
