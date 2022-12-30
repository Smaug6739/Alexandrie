import { Router } from 'express';
import CategoriesCtrl from '../../controllers/Categories';
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
      CategoriesRouter.post('/main', authMid, (req, res) => controller.addMainCategory(req, res));
      CategoriesRouter.post('/sub', authMid, (req, res) => controller.addSubCategory(req, res));
      CategoriesRouter.patch('/main/:id', authMid, (req, res) => controller.updateMainCategory(req, res));
      CategoriesRouter.patch('/sub/:id', authMid, (req, res) => controller.updateSubCategory(req, res));
      CategoriesRouter.delete('/main/:id', authMid, (req, res) => controller.deleteMainCategory(req, res));
      CategoriesRouter.delete('/sub/:id', authMid, (req, res) => controller.deleteSubCategory(req, res));
      return CategoriesRouter;
    },
  };
};
