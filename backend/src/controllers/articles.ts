import Article from '../classes/Articles';
import { error, success } from '../utils/functions';
import type { Response, Request } from 'express';
import type { App } from '../app';

export default class ArticlesController {
  app: App;
  Articles: Article;
  constructor(app: App) {
    this.app = app;
    this.Articles = new Article(app.redisClient);
  }
  getAllArticles(req: Request, res: Response) {
    if (req.query.category) {
      this.Articles.getAllByCategory(req.query.category.toString())
        .then((result: any) => res.status(200).json(success(result)))
        .catch((err: Error) => res.status(500).json(error(err.message)));
    } else {
      this.Articles.getAll()
        .then((result: any) => res.status(200).json(success(result)))
        .catch((err: Error) => res.status(500).json(error(err.message)));
    }
  }
  add(req: Request, res: Response): void {
    this.Articles.add(
      req.body.name,
      req.body.path,
      req.body.main_category,
      req.body.sub_category,
      req.body.description,
      req.body.content_markdown,
      req.body.content_html,
      req.cookies.user_id,
    )
      .then(a => res.status(201).json(success(a)))
      .catch(err => res.status(500).json(error(err.message)));
  }
  updateArticle(req: Request, res: Response) {
    this.Articles.put(
      req.params.id,
      req.body.name,
      req.body.description,
      req.body.path,
      req.body.main_category,
      req.body.sub_category,
      req.body.content_markdown,
      req.body.content_html,
    )
      .then(() => res.status(201).json(success('success')))
      .catch(err => res.status(500).json(error(err.message)));
  }
  deleteArticle(req: Request, res: Response) {
    this.Articles.delete(req.params.id)
      .then(() => res.status(201).json(success('success')))
      .catch((err: Error) => res.status(500).json(error(err.message)));
  }
}
