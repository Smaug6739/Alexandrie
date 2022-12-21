import Article from '../classes/Articles';
import { error, success } from '../utils/functions';
import type { Response, Request } from 'express';
import type { App } from '../app';

const Articles = new Article();

export function getAllArticles(client: App, req: Request, res: Response): void {
  if (req.query.category) {
    Articles.getAllByCategory(req.query.category.toString())
      .then((result: any) => res.status(200).json(success(result)))
      .catch((err: Error) => res.status(500).json(error(err.message)));
  } else {
    Articles.getAll()
      .then((result: any) => res.status(200).json(success(result)))
      .catch((err: Error) => res.status(500).json(error(err.message)));
  }
}
export function add(client: App, req: Request, res: Response): void {
  Articles.add(
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

export function updateArticle(client: App, req: Request, res: Response) {
  Articles.put(
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

export function deleteArticle(client: App, req: Request, res: Response) {
  Articles.delete(req.params.id)
    .then(() => res.status(201).json(success('success')))
    .catch((err: Error) => res.status(500).json(error(err.message)));
}
