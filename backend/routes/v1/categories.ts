import { Router } from 'express';
import CategoriesCtrl from '../../controllers/categories.controller';
import authMid from '../../middlewares/auth';
import type { App } from '../../app';
import type { Iroute } from '../../types';

const CategoriesRouter: Router = Router();

export default (client: App): Iroute => {
  const controller = new CategoriesCtrl(client);
  return {
    route: 'categories',
    version: 1,
    router() {
      CategoriesRouter.get('/', (req, res) => controller.getAll(req, res));
      CategoriesRouter.post('', authMid, (req, res) => controller.add(req, res));
      CategoriesRouter.patch('/:id', authMid, (req, res) => controller.update(req, res));
      CategoriesRouter.delete('/:id', authMid, (req, res) => controller.delete(req, res));
      return CategoriesRouter;
    },
  };
};
