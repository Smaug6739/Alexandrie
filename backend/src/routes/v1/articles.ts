import { Router } from 'express';
import * as ArticlesCtrl from '../../controllers/articles';
import { Iroute } from '../../types';
import authMid from '../../middlewares/auth';
import type { App } from '../../app';
const ArticlesRouter: Router = Router();

export default (client: App): Iroute => {
  return {
    route: 'articles',
    version: 1,
    router() {
      ArticlesRouter.get('/', (req, res) => ArticlesCtrl.getAllArticles(client, req, res));
      ArticlesRouter.post('/', authMid, (req, res) => ArticlesCtrl.add(client, req, res));
      ArticlesRouter.patch('/:id', authMid, (req, res) => ArticlesCtrl.updateArticle(client, req, res));
      ArticlesRouter.delete('/:id', authMid, (req, res) => ArticlesCtrl.deleteArticle(client, req, res));
      return ArticlesRouter;
    },
  };
};
