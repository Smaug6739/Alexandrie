import { access, constants, unlink } from 'fs';
import sharp from 'sharp';
import BaseController from './BaseController';
import { RessourcesManager } from '../classes';
import type { Ressource } from '../types';
import type { Request, Response } from 'express';

export function convertImageToWebp(upload_path: string, filename: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const path = `${upload_path}/images/${filename}`;
    access(path, constants.F_OK, err => {
      if (err) return reject(new Error('File not found.'));
      return sharp(path)
        .toFile(`${upload_path}/webp/${filename.split('.')[0]}.webp`)
        .then(() => resolve([`/images/${filename}`, `/webp/${filename.split('.')[0]}.webp`]))
        .catch(() => reject(new Error('Error converting image.')));
    });
  });
}
export default class RessourcesController extends BaseController<RessourcesManager> {
  constructor(app: App) {
    super(new RessourcesManager(app));
  }

  async get(req: Request, res: Response) {
    if (!req.user_id) return res.status(401).json(this.utils.error('Unauthorized'));
    return this.manager
      .getRessources(req.user_id)
      .then((result: Ressource[]) => res.status(200).json(this.utils.success(result)))
      .catch(e => res.status(500).json(this.utils.error(e)));
  }

  async add(req: Request, res: Response) {
    try {
      if (typeof req.files != 'object' || !('file' in req.files) || !req.files.file[0]) {
        throw new Error('No file provided.');
      }
      const file = req.files['file'][0];
      const filename = file.filename;

      if (!filename) throw new Error('No file provided.');
      const ressource: Ressource = {
        id: this.app.snowflake.generate().toString(),
        filename: file.originalname,
        file_size: file.size,
        file_type: file.mimetype,
        original_path: '',
        transformed_path: '',
        author_id: req.user_id!,
        created_timestamp: Date.now().toString(),
      };
      if (Object.keys(this.utils.MIME_TYPES_IMAGE).includes(file.mimetype)) {
        const converted = await convertImageToWebp(this.app.config.upload_path, filename);
        ressource.original_path = String(converted[0]);
        ressource.transformed_path = String(converted[1]);
      } else ressource.original_path = `/other/${filename}`;

      this.manager
        .createRessource(ressource)
        .then(r => res.status(201).json(this.utils.success(r)))
        .catch(err => res.status(500).json(this.utils.error(err)));
    } catch (err) {
      res.status(500).json(this.utils.error(err));
    }
  }

  async addAvatar(req: Request, res: Response) {
    try {
      if (typeof req.files != 'object' || !('file' in req.files) || !req.files.file[0]) {
        throw new Error('No file provided.');
      }
      const file = req.files['file'][0];
      const filename = file.filename;
      if (!filename) throw new Error('No file provided.');
      if (Object.keys(this.utils.MIME_TYPES_IMAGE).includes(file.mimetype)) {
        const converted = await convertImageToWebp(this.app.config.upload_path, filename);
        res.status(201).json(this.utils.success({ original_path: converted[0], transformed_path: converted[1] }));
      }
    } catch (err) {
      res.status(500).json(this.utils.error(err));
    }
  }

  async delete(req: Request, res: Response) {
    if (!req.user_id) return res.status(401).json(this.utils.error('Unauthorized'));
    if (!req.params.id) return res.status(400).json(this.utils.error('No id provided.'));
    const ressource = await this.manager.getRessource(req.params.id);
    if (!ressource) return res.status(404).json(this.utils.error('Ressource not found.'));
    if (ressource.author_id !== req.user_id) return res.status(403).json(this.utils.error('Unauthorized'));
    try {
      await this.manager.deleteRessource(req.params.id);
      if (ressource.original_path) await deleteFile(`${this.app.config.upload_path}/${ressource.original_path}`);
      if (ressource.transformed_path) await deleteFile(`${this.app.config.upload_path}/${ressource.transformed_path}`);
      return res.status(200).json(this.utils.success('Ressource deleted.'));
    } catch (err) {
      return res.status(500).json(this.utils.error(err));
    }
  }
}

function deleteFile(path: string): Promise<void> {
  // Check if file exists and permissions are correct before deleting
  return new Promise((resolve, reject) => {
    access(path, constants.F_OK, err => {
      if (err) return reject(new Error('File not found.'));
      unlink(path, err => {
        if (err) return reject(new Error('Error deleting file.'));
        resolve();
      });
    });
  });
}
