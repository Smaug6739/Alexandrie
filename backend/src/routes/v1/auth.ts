import { Router } from 'express';
import * as AuthCtrl from '../../controllers/auth.controller';
import type { Iroute } from '../../types';
import type { App } from '../../app';
const AuthRouter: Router = Router();

export default (client: App): Iroute => {
  return {
    route: 'auth',
    version: 1,
    router() {
      AuthRouter.post('/', (req, res) => AuthCtrl.auth(client, req, res));
      AuthRouter.get('/disconnection', (req, res) => AuthCtrl.disconnection(client, req, res));
      return AuthRouter;
    },
  };
};
