import DocumentsManager from '../classes/DocumentsManager';
import { error, success } from '../utils/functions';
import type { Response, Request } from 'express';
import type { App } from '../app';
import type { Document } from '../types';

export default class DocumentsController {
  app: App;
  db_a: DocumentsManager;
  constructor(app: App) {
    this.app = app;
    this.db_a = new DocumentsManager(app);
  }

  getAllDocuments(req: Request, res: Response) {
    if (req.query.category) {
      this.db_a
        .getAllByCategory(req.query.category.toString())
        .then((value: any) => res.status(200).json(success(value)))
        .catch((err: Error) => res.status(500).json(error(err.message)));
    } else {
      this.db_a
        .getAll(req.query.all?.toString())
        .then((result: Partial<Document>[]) => {
          // Select fields
          if (req.query.fields) {
            const Qfields: string[] = req.query.fields.toString().split(',');

            if (Qfields.length) {
              result = result.map((item: Partial<Document>) => {
                const filtered = {} as any;
                Qfields.forEach(field => {
                  if (item[field as keyof Document]) filtered[field as keyof Document] = item[field as keyof Document];
                });
                return filtered;
              });
            }
          }
          res.status(200).json(success(result));
        })
        .catch(e => res.status(500).json(error(e)));
    }
  }
  getDocument(req: Request, res: Response) {
    this.db_a
      .get(req.params.id as string)
      .then(r => res.status(200).json(success(r)))
      .catch(e => res.status(500).json(error(e)));
  }
  add(req: Request, res: Response): void {
    this.db_a
      .add({
        name: req.body.name,
        description: req.body.description,
        tags: req.body.tags,
        category: req.body.category,
        parent_id: req.body.parent_id,
        accessibility: req.body.accessibility,
        content_markdown: req.body.content_markdown,
        content_html: req.body.content_html,
        author_id: req.cookies.user_id,
      })
      .then(r => res.status(201).json(success(r)))
      .catch(err => res.status(500).json(error(err.message)));
  }
  updateDocument(req: Request, res: Response) {
    this.db_a
      .put(req.params.id as string, {
        name: req.body.name,
        description: req.body.description,
        tags: req.body.tags,
        category: req.body.category,
        parent_id: req.body.parent_id,
        accessibility: req.body.accessibility,
        content_markdown: req.body.content_markdown,
        content_html: req.body.content_html,
        author_id: req.cookies.user_id,
      })
      .then(r => res.status(201).json(success(r)))
      .catch(err => res.status(500).json(error(err.message)));
  }
  deleteDocument(req: Request, res: Response) {
    this.db_a
      .delete(req.params.id as string)
      .then(r => res.status(201).json(success(r)))
      .catch((err: Error) => res.status(500).json(error(err.message)));
  }
}
