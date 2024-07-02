import { Router } from 'express';
import AuthCtrl from '../../controllers/auth.controller';
const AuthRouter: Router = Router();

export default (client: App): Iroute => {
  return {
    route: 'auth',
    version: 1,
    router() {
      const controller = new AuthCtrl(client);
      AuthRouter.post('/', (req, res) => controller.authentification(client, req, res));
      AuthRouter.get('/refreshToken/:user_id', (req, res) => controller.refresh_access_token(req, res));
      AuthRouter.get('/disconnection', (req, res) => controller.disconnection(client, req, res));
      return AuthRouter;
    },
  };
};
