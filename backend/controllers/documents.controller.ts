import BaseController from './BaseController';
import { DocumentsManager } from '../classes';
import type { Response, Request } from 'express';
import type { Document } from '../types';

export default class DocumentsController extends BaseController<DocumentsManager, Document> {
  constructor(app: App) {
    super(new DocumentsManager(app));
  }

  getAllDocuments(req: Request, res: Response) {
    this.manager
      .getAll(req.query.all?.toString())
      .then((result: Partial<Document>[]) => res.status(200).json(this.utils.success(result)))
      .catch(e => res.status(500).json(this.utils.error(e)));
  }
  getDocument(req: Request, res: Response) {
    this.manager
      .get(req.params.id as string)
      .then(r => res.status(200).json(this.utils.success(r)))
      .catch(e => res.status(500).json(this.utils.error(e)));
  }
  add(req: Request, res: Response) {
    const document: Document = {
      id: this.app.snowflake.generate().toString(),
      name: req.body.name,
      description: req.body.description,
      tags: req.body.tags,
      category: req.body.category,
      parent_id: req.body.parent_id,
      accessibility: req.body.accessibility,
      content_markdown: req.body.content_markdown,
      content_html: req.body.content_html,
      author_id: req.user_id!,
      created_timestamp: Date.now().toString(),
      updated_timestamp: Date.now().toString(),
    };
    const err = this.manager.validate(document);
    if (err) return res.status(400).json(this.utils.error(err));
    return this.manager
      .add(document)
      .then(r => res.status(201).json(this.utils.success(r)))
      .catch(err => res.status(500).json(this.utils.error(err.message)));
  }
  updateDocument(req: Request, res: Response) {
    return this.manager
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
        updated_timestamp: Date.now().toString(),
      })
      .then(r => res.status(201).json(this.utils.success(r)))
      .catch(err => res.status(500).json(this.utils.error(err.message)));
  }
  deleteDocument(req: Request, res: Response) {
    this.manager
      .delete(req.params.id as string)
      .then(r => res.status(201).json(this.utils.success(r)))
      .catch((err: Error) => res.status(500).json(this.utils.error(err.message)));
  }
}
