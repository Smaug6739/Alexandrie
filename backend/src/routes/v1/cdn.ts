import { Router } from 'express';
import * as CDNCtrl from '../../controllers/cdn';
import auth from '../../middlewares/auth';
import multerCdn from '../../middlewares/multer.cdn';
import { Iroute } from '../../types';
const CDNRouter: Router = Router();

CDNRouter.post('/image/', auth, multerCdn, CDNCtrl.uploadImage);

export const infos: Iroute = {
  route: 'cdn',
  version: 1,
  router: CDNRouter,
};
