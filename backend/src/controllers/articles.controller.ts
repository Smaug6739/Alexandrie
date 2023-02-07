import Article from '../classes/Articles';
import { error, success } from '../utils/functions';
import type { Response, Request } from 'express';
import type { App } from '@app';
import type { Article as ArticleStructure } from '@types';

export default class ArticlesController {
  app: App;
  Articles: Article;
  constructor(app: App) {
    this.app = app;
    this.Articles = new Article(app);
  }
  getAllArticles(req: Request, res: Response) {
    if (req.query.category) {
      this.Articles.getAllByCategory(req.query.category.toString())
        .then((value: any) => res.status(200).json(success(value)))
        .catch((err: Error) => res.status(500).json(error(err.message)));
    } else {
      this.Articles.getAll()
        .then((result: any) => {
          // Select fields
          if (req.query.fields) {
            const Qfields: (keyof ArticleStructure)[] = (req.query.fields as string).split(',');
            if (Qfields.length) {
              result = result.map((item: any) => {
                const filtered = {} as Pick<ArticleStructure, keyof ArticleStructure>;
                Qfields.forEach(field => (filtered[field] = item[field]));
                return filtered;
              });
            }
            res.status(200).json(success(result));
          }
        })
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
      req.params.id as string,
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
    this.Articles.delete(req.params.id as string)
      .then(() => res.status(201).json(success('success')))
      .catch((err: Error) => res.status(500).json(error(err.message)));
  }
}
