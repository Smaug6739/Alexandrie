import { Router } from 'express';
import * as CategoriesCtrl from '../../controllers/Categories';
import { Iroute } from '../../types';
import authMid from '../../middlewares/auth';
import type { App } from '../../app';

const CategoriesRouter: Router = Router();

export default (client: App): Iroute => {
  return {
    route: 'categories',
    version: 1,
    router() {
      CategoriesRouter.get('/', (req, res) => CategoriesCtrl.getAll(client, req, res));
      CategoriesRouter.post('/main', authMid, (req, res) => CategoriesCtrl.addMainCategory(client, req, res));
      CategoriesRouter.post('/sub', authMid, (req, res) => CategoriesCtrl.addSubCategory(client, req, res));
      CategoriesRouter.patch('/main/:id', authMid, (req, res) => CategoriesCtrl.updateMainCategory(client, req, res));
      CategoriesRouter.patch('/sub/:id', authMid, (req, res) => CategoriesCtrl.updateSubCategory(client, req, res));
      CategoriesRouter.delete('/main/:id', authMid, (req, res) => CategoriesCtrl.deleteMainCategory(client, req, res));
      CategoriesRouter.delete('/sub/:id', authMid, (req, res) => CategoriesCtrl.deleteSubCategory(client, req, res));
      return CategoriesRouter;
    },
  };
};
