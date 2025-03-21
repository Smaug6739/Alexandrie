import { Router } from 'express';
import UsersCtrl from '../../controllers/users.controller';
import authMid from '../../middlewares/auth';
import isAdmin from '../../middlewares/is_admin';

const UsersRouter: Router = Router();

export default (client: App): Iroute => {
  const controller = new UsersCtrl(client);
  return {
    route: 'users',
    version: 1,
    router() {
      UsersRouter.get('/@me', authMid, (req, res) => controller.getMe(req, res));
      UsersRouter.patch('/:id/password', authMid, (req, res) => controller.updatePassword(req, res));
      UsersRouter.post('/', (req, res) => controller.post(req, res));
      UsersRouter.patch('/:id', authMid, (req, res) => controller.update(req, res));

      // Protected routes
      UsersRouter.get('/:id', authMid, isAdmin, (req, res) => controller.getById(req, res));
      UsersRouter.get('/', authMid, isAdmin, (req, res) => controller.getAll(req, res));
      //UsersRouter.get('/:id', authMid, (req, res) => controller.getDocument(req, res));
      //UsersRouter.post('/', (req, res) => controller.add(req, res));
      //UsersRouter.patch('/:id', authMid, (req, res) => controller.updateDocument(req, res));
      //UsersRouter.delete('/:id', authMid, (req, res) => controller.deleteDocument(req, res));
      return UsersRouter;
    },
  };
};
