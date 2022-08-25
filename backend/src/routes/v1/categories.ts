import { Router } from 'express';
import * as CategoriesCtrl from '../../controllers/Categories';
import { Iroute } from '../../types';
import authMid from '../../middlewares/auth';
const CategoriesRouter: Router = Router();

// PUBLIC ROUTES
CategoriesRouter.get('/', CategoriesCtrl.getAll);

// PRIVATE ROUTES
CategoriesRouter.post('/main', authMid, CategoriesCtrl.addMainCategory);
CategoriesRouter.post('/sub', authMid, CategoriesCtrl.addSubCategory);

CategoriesRouter.patch('/main/:id', authMid, CategoriesCtrl.updateMainCategory);
CategoriesRouter.patch('/sub/:id', authMid, CategoriesCtrl.updateSubCategory);

CategoriesRouter.delete('/main/:id', authMid, CategoriesCtrl.deleteMainCategory);
CategoriesRouter.delete('/sub/:id', authMid, CategoriesCtrl.deleteSubCategory);

export const infos: Iroute = {
  route: 'categories',
  version: 1,
  router: CategoriesRouter,
};
