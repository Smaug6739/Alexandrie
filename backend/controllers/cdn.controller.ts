import { access, constants } from 'fs';
import sharp from 'sharp';
import { MIME_TYPES_IMAGE, UPLOADS_PATH } from '../utils/constants';
import type { Request, Response } from 'express';
import { Ressource } from '../types';
import { error, success } from '../utils/functions';
import RessourcesManager from '../classes/RessourcesManager';

export type PartialRessource = Omit<Ressource, 'id' | 'created_timestamp'>;

export function convertImageToWebp(filename: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const path = `${UPLOADS_PATH}/images/${filename}`;
    access(path, constants.F_OK, err => {
      if (err) return reject(new Error('File not found.'));
      return sharp(path)
        .toFile(`${UPLOADS_PATH}/webp/${filename.split('.')[0]}.webp`)
        .then(() => resolve([`/images/${filename}`, `/webp/${filename.split('.')[0]}.webp`]))
        .catch(() => reject(new Error('Error converting image.')));
    });
  });
}
export default class RessourcesController {
  app: App;
  manager: RessourcesManager;
  constructor(app: App) {
    this.app = app;
    this.manager = new RessourcesManager(app);
  }

  async get(req: Request, res: Response) {
    this.manager
      .getRessources(req.params.user_id as string)
      .then((result: Ressource[]) => res.status(200).json(success(result)))
      .catch(e => res.status(500).json(error(e)));
  }

  async add(req: Request, res: Response) {
    try {
      if (typeof req.files != 'object' || !('file' in req.files) || !req.files.file[0]) {
        throw new Error('No file provided.');
      }
      const file = req.files['file'][0];
      const filename = file.filename;

      if (!filename) throw new Error('No file provided.');
      const ressource: PartialRessource = {
        filename: file.originalname,
        file_size: file.size,
        file_type: file.mimetype,
        original_path: '',
        transformed_path: '',
        author_id: req.user_id!,
      };
      if (Object.keys(MIME_TYPES_IMAGE).includes(file.mimetype)) {
        const converted = await convertImageToWebp(filename);
        ressource.original_path = String(converted[0]);
        ressource.transformed_path = String(converted[1]);
      } else ressource.original_path = `/other/${filename}`;

      this.manager
        .createRessource(ressource)
        .then(r => res.status(201).json(success(r)))
        .catch(err => res.status(500).json(error(err.message)));
    } catch (err) {
      if (err instanceof Error) res.status(500).json(error(err.message));
      res.status(500).json(error('Internal server error.'));
    }
  }
}
