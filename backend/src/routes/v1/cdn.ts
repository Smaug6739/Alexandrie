import { Router } from 'express';
import * as CDNCtrl from '../../controllers/cdn';
import auth from '../../middlewares/auth';
import multerCdn from '../../middlewares/multer.cdn';
import { Iroute } from '../../types';
import type { App } from '../../app';

const CDNRouter: Router = Router();

export default (client: App): Iroute => {
  return {
    route: 'cdn',
    version: 1,
    router() {
      CDNRouter.post('/image', auth, multerCdn, CDNCtrl.uploadImage);
      CDNRouter.post('/', (req, res) => CDNCtrl.uploadImage(client, req, res));
      return CDNRouter;
    },
  };
};
