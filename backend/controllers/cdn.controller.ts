import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';
import { error, success } from '../utils/functions';
import type { Request, Response } from 'express';
import type { App } from '../app';

export function convertImageToWebp(_: App, req: Request, res: Response) {
  if (typeof req.files != 'object' || !('file' in req.files) || !req.files.file[0]) {
    res.status(400).json(error('No file provided.'));
    return;
  }

  const filename = req.files['file'][0].filename;

  if (!filename) {
    res.status(400).json(error('No file provided.'));
    return;
  }

  const path = join(__dirname, `../../../uploads/images/${filename}`);

  if (existsSync(path)) {
    sharp(path)
      .toFile(join(__dirname, `../../../uploads/webp/${filename.split('.')[0]}.webp`))
      .then(() => res.status(200).json(success(`/webp/${filename.split('.')[0]}.webp`)))
      .catch(_ => res.status(500).json(error('Error while converting image to webp.')));
  } else res.status(404).json(error('File not found.'));
}
