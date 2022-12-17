import Article from '../classes/Articles';
import { error, success } from '../utils/functions';
import type { Response, Request } from 'express';
const Articles = new Article();

export function getAllArticles(req: Request, res: Response): void {
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
export function add(req: Request, res: Response): void {
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

export function updateArticle(req: Request, res: Response) {
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

export function deleteArticle(req: Request, res: Response) {
  Articles.delete(req.params.id)
    .then(() => res.status(201).json(success('success')))
    .catch((err: Error) => res.status(500).json(error(err.message)));
}
