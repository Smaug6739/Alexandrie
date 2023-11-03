import { Router } from 'express';
import BackupsCtrl from '../../controllers/backups.controller';
import authMid from '../../middlewares/auth';
import type { App } from '../../app';
import type { Iroute } from '../../types';

const BackupsRouter: Router = Router();

export default (client: App): Iroute => {
  const controller = new BackupsCtrl(client);
  return {
    route: 'backups',
    version: 1,
    router() {
      BackupsRouter.post('', authMid, (req, res) => controller.add(req, res));
      return BackupsRouter;
    },
  };
};
