import { Router } from 'express';
import AuthCtrl from '../../controllers/auth.controller';
import type { Iroute } from '../../types';
import type { App } from '../../app';
const AuthRouter: Router = Router();

export default (client: App): Iroute => {
  return {
    route: 'auth',
    version: 1,
    router() {
      const controller = new AuthCtrl(client);
      AuthRouter.post('/', (req, res) => controller.auth(client, req, res));
      AuthRouter.get('/disconnection', (req, res) => controller.disconnection(client, req, res));
      return AuthRouter;
    },
  };
};
