import { Router, type Request, type Response, NextFunction } from 'express';
import RessourcesController from '../../controllers/cdn.controller';
import auth from '../../middlewares/auth';
import multerCdn from '../../middlewares/multer.cdn';
import multer from 'multer';
import { error } from '../../utils/functions';

const CDNRouter: Router = Router();

export default (client: App): Iroute => {
  const controller = new RessourcesController(client);
  return {
    route: 'ressources',
    version: 1,
    router() {
      CDNRouter.get('/:user_id', auth, (req: Request, res: Response) => controller.get(req, res));
      CDNRouter.post('/', auth, multerCdn, (req: Request, res: Response) => controller.add(req, res), multerErrors);
      return CDNRouter;
    },
  };
};

function multerErrors(err: any, _: Request, res: Response, next: NextFunction) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json(error('File size is too large.'));
    else res.status(400).json(error(err.message));
  }
  if (err) {
    if (err.message === 'BAD_MIMETYPE') return res.status(415).json(error('Invalid file format.'));
    return res.status(400).json(error(err.message));
  }
  return next();
}
