import multer from 'multer';
import { MIME_TYPES_IMAGE, ACCEPTED_MIME_TYPES, maxSize, UPLOADS_PATH } from '../utils/constants';
import type { IObject } from '../types';

const storage = multer.diskStorage({
  destination: (_, file: Express.Multer.File, callback: Function) => {
    if (Object.keys(MIME_TYPES_IMAGE).includes(file.mimetype)) return callback(null, `${UPLOADS_PATH}/images`);
    callback(null, `${UPLOADS_PATH}/other`);
  },
  filename: (_, file: IObject, callback: Function) => {
    const mimetype = file.mimetype as keyof typeof ACCEPTED_MIME_TYPES;
    const extension = ACCEPTED_MIME_TYPES[mimetype];
    const fullName = `${Date.now().toString()}.${extension}`;
    callback(null, fullName);
  },
});

export default multer({
  storage: storage,
  limits: {
    fileSize: maxSize,
  },
  fileFilter: (_, file: IObject, cb: Function) => {
    const mimetype = file.mimetype as unknown as keyof typeof ACCEPTED_MIME_TYPES;
    if (ACCEPTED_MIME_TYPES[mimetype]) cb(null, true);
    else cb(new Error('BAD_MIMETYPE'));
  },
}).fields([
  {
    name: 'file',
    maxCount: 1,
  },
]);
