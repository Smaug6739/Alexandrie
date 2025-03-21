import { Router } from 'express';
import AuthCtrl from '../../controllers/auth.controller';
import authMid from '../../middlewares/auth';

const AuthRouter: Router = Router();

export default (client: App): Iroute => {
  return {
    route: 'auth',
    version: 1,
    router() {
      const controller = new AuthCtrl(client);
      AuthRouter.post('/', (req, res) => controller.login(req, res));
      AuthRouter.get('/refreshToken', (req, res) => controller.refresh_session(req, res));
      AuthRouter.post('/logout/all', authMid, (req, res) => controller.logout_all(req, res));
      AuthRouter.post('/logout', authMid, (req, res) => controller.logout(req, res));
      return AuthRouter;
    },
  };
};
