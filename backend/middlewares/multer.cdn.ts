import { join } from 'path';
import multer from 'multer';
import type { IObject } from '../types';

const tailleMax = 20 * 1024 * 1024; // 20MB

enum MIME_TYPES_IMAGE {
  'image/jpg' = 'jpg',
  'image/jpeg' = 'jpg',
  'image/png' = 'png',
  'image/gif' = 'gif',
  'image/webp' = 'webp',
  'image/svg+xml' = 'svg',
}

const storage = multer.diskStorage({
  destination: (_, __: Express.Multer.File, callback: Function) => {
    callback(null, `${join(__dirname, `../../uploads/images`)}`);
  },
  filename: (_, file: IObject, callback: Function) => {
    const mimetype = file.mimetype as unknown as keyof typeof MIME_TYPES_IMAGE;
    const extension = MIME_TYPES_IMAGE[mimetype];
    const fullName = Date.now().toString() + '.' + extension;
    callback(null, fullName);
  },
});

export default multer({
  storage: storage,
  limits: {
    fileSize: tailleMax,
  },
  fileFilter: (_, file: IObject, cb: Function) => {
    const mimetype = file.mimetype as unknown as keyof typeof MIME_TYPES_IMAGE;
    if (MIME_TYPES_IMAGE[mimetype]) cb(null, true);
    else cb(new Error('[BAD_MIMETYPE]'));
  },
}).fields([
  {
    name: 'file',
    maxCount: 1,
  },
]);
