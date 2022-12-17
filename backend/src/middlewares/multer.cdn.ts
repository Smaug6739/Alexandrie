import { join } from 'path';
import { IObject } from '../types';
import multer from 'multer';

let name;
let extension;
let fullName;
const tailleMax = 20 * 1024 * 1024; // 20MB

const MIME_TYPES_IMAGE: IObject = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
};

const storage = multer.diskStorage({
  destination: (_, file: IObject, callback: Function) => {
    if (MIME_TYPES_IMAGE[file.mimetype]) callback(null, `${join(__dirname, `../../public/uploads/images`)}`);
    else callback(null, `${join(__dirname, `../../public/uploads/other`)}`);
  },
  filename: (_, file: IObject, callback: Function) => {
    name = file.originalname.split(' ').join('_').replace('.', '_');
    extension = MIME_TYPES_IMAGE[file.mimetype];
    fullName = name + Date.now() + '.' + extension;
    if (!extension) callback(new Error('Only images allowed'));
    callback(null, fullName);
  },
});

export default multer({
  storage: storage,
  limits: {
    fileSize: tailleMax,
  },
  fileFilter: (_, file: IObject, cb: Function) => {
    if (MIME_TYPES_IMAGE[file.mimetype]) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
}).fields([
  {
    name: 'file',
    maxCount: 1,
  },
]);
