import { join } from 'path';
import multer from 'multer';
import type { IObject } from '@types';

const tailleMax = 20 * 1024 * 1024; // 20MB

enum MIME_TYPES_IMAGE {
  'image/jpg' = 'jpg',
  'image/jpeg' = 'jpg',
  'image/png' = 'png',
  'image/gif' = 'gif',
  'image/webp' = 'webp',
}

const storage = multer.diskStorage({
  destination: (_, file: Express.Multer.File, callback: Function) => {
    const mimetype = file.mimetype as unknown as keyof typeof MIME_TYPES_IMAGE;
    if (MIME_TYPES_IMAGE[mimetype]) callback(null, `${join(__dirname, `../../public/uploads/images`)}`);
    else callback(null, `${join(__dirname, `../../public/uploads/other`)}`);
  },
  filename: (_, file: IObject, callback: Function) => {
    const mimetype = file.mimetype as unknown as keyof typeof MIME_TYPES_IMAGE;
    const name = file.originalname.split(' ').join('_').replace('.', '_');
    const extension = MIME_TYPES_IMAGE[mimetype];
    if (!extension) callback(new Error('Only images allowed'));
    const fullName = name + Date.now() + '.';
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
    else cb(null, false);
  },
}).fields([
  {
    name: 'file',
    maxCount: 1,
  },
]);
