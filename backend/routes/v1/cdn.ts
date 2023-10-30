import { Router, type Request, type Response, NextFunction } from 'express';
import * as CDNCtrl from '../../controllers/cdn.controller';
import auth from '../../middlewares/auth';
import multerCdn from '../../middlewares/multer.cdn';
import type { Iroute } from '../../types';
import type { App } from '../../app';
import multer from 'multer';
import { error } from '../../utils/functions';
const CDNRouter: Router = Router();

export default (app: App): Iroute => {
  return {
    route: 'cdn',
    version: 1,
    router() {
      CDNRouter.post(
        '/image',
        auth,
        multerCdn,
        (req: Request, res: Response) => CDNCtrl.convertImagetoWebp(app, req, res),
        multerErrors,
      );
      return CDNRouter;
    },
  };
};

function multerErrors(err: any, _: Request, res: Response, next: NextFunction) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json(error('File size is too large.'));
    else res.status(400).json(error(err.message));
  }
  if (err) {
    if (err.message === '[BAD_MIMETYPE]') return res.status(400).json(error('Only images and vectors are alowed.'));
    return res.status(400).json(error(err.message));
  }
  return next();
}
