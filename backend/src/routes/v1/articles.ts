import { Router } from 'express';
import * as ArticlesCtrl from '../../controllers/articles';
import { Iroute } from '../../types';
import authMid from '../../middlewares/auth';
const ArticlesRouter: Router = Router();

ArticlesRouter.get('/', ArticlesCtrl.getAllArticles);

ArticlesRouter.post('/', authMid, ArticlesCtrl.add);
ArticlesRouter.patch('/:id', authMid, ArticlesCtrl.updateArticle);
ArticlesRouter.delete('/:id', authMid, ArticlesCtrl.deleteArticle);

export const infos: Iroute = {
  route: 'articles',
  version: 1,
  router: ArticlesRouter,
};
