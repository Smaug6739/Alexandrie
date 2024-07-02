import DocumentsManager from '../classes/DocumentsManager';
import { error, success } from '../utils/functions';
import type { Response, Request } from 'express';
import type { Document } from '../types';

export default class DocumentsController {
  app: App;
  manager: DocumentsManager;
  constructor(app: App) {
    this.app = app;
    this.manager = new DocumentsManager(app);
  }

  getAllDocuments(req: Request, res: Response) {
    this.manager
      .getAll(req.query.all?.toString())
      .then((result: Partial<Document>[]) => res.status(200).json(success(result)))
      .catch(e => res.status(500).json(error(e)));
  }
  getDocument(req: Request, res: Response) {
    this.manager
      .get(req.params.id as string)
      .then(r => res.status(200).json(success(r)))
      .catch(e => res.status(500).json(error(e)));
  }
  add(req: Request, res: Response): void {
    this.manager
      .add({
        name: req.body.name,
        description: req.body.description,
        tags: req.body.tags,
        category: req.body.category,
        parent_id: req.body.parent_id,
        accessibility: req.body.accessibility,
        content_markdown: req.body.content_markdown,
        content_html: req.body.content_html,
        author_id: req.user_id!,
      })
      .then(r => res.status(201).json(success(r)))
      .catch(err => res.status(500).json(error(err.message)));
  }
  updateDocument(req: Request, res: Response) {
    this.manager
      .put(req.params.id as string, {
        name: req.body.name,
        description: req.body.description,
        tags: req.body.tags,
        category: req.body.category,
        parent_id: req.body.parent_id,
        accessibility: req.body.accessibility,
        content_markdown: req.body.content_markdown,
        content_html: req.body.content_html,
        author_id: req.user_id!,
      })
      .then(r => res.status(201).json(success(r)))
      .catch(err => res.status(500).json(error(err.message)));
  }
  deleteDocument(req: Request, res: Response) {
    this.manager
      .delete(req.params.id as string)
      .then(r => res.status(201).json(success(r)))
      .catch((err: Error) => res.status(500).json(error(err.message)));
  }
}
