import { Router } from 'express';
import UsersCtrl from '../../controllers/users.controller';
import authMid from '../../middlewares/auth';

const UsersRouter: Router = Router();

export default (client: App): Iroute => {
  const controller = new UsersCtrl(client);
  return {
    route: 'users',
    version: 1,
    router() {
      UsersRouter.get('/@me', authMid, (req, res) => controller.getMe(req, res));
      UsersRouter.patch('/:id/password', authMid, (req, res) => controller.updatePassword(req, res));
      UsersRouter.patch('/:id', authMid, (req, res) => controller.update(req, res));

      //UsersRouter.get('/:id', authMid, (req, res) => controller.getDocument(req, res));
      //UsersRouter.post('/', (req, res) => controller.add(req, res));
      //UsersRouter.patch('/:id', authMid, (req, res) => controller.updateDocument(req, res));
      //UsersRouter.delete('/:id', authMid, (req, res) => controller.deleteDocument(req, res));
      return UsersRouter;
    },
  };
};
