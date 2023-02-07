import { Router } from 'express';
import ArticlesCtrl from '../../controllers/articles.controller';
import authMid from '../../middlewares/auth';
import type { App } from '../../app';
import type { Iroute } from '../../types';

const ArticlesRouter: Router = Router();

export default (client: App): Iroute => {
  const controller = new ArticlesCtrl(client);
  return {
    route: 'articles',
    version: 1,
    router() {
      ArticlesRouter.get('/', (req, res) => controller.getAllArticles(req, res));
      ArticlesRouter.post('/', authMid, (req, res) => controller.add(req, res));
      ArticlesRouter.patch('/:id', authMid, (req, res) => controller.updateArticle(req, res));
      ArticlesRouter.delete('/:id', authMid, (req, res) => controller.deleteArticle(req, res));
      return ArticlesRouter;
    },
  };
};
