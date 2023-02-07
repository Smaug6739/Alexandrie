import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';
import { error, success } from '../utils/functions';
import type { Request, Response } from 'express';
import type { App } from '@app';

export function uploadImage(_: App, req: Request, res: Response): void {
  if (!req.files || !('file' in req.files) || !req.files.file?.length || !req.files.file[0]) {
    res.status(400).json(error('No file provided.'));
    return;
  }

  const file = req.files.file[0].filename;
  if (!file) {
    res.status(400).json(error('No file provided.'));
    return;
  }
  const path = join(__dirname, `../../public/uploads/images/${file}`);

  // TODO: Remove synchronous code
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
