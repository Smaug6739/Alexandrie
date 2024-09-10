import BaseController from './BaseController';
import { DocumentsManager } from '../classes';
import type { Response, Request } from 'express';
import type { Document } from '../types';

export default class DocumentsController extends BaseController<DocumentsManager> {
  constructor(app: App) {
    super(new DocumentsManager(app));
  }

  getAllDocuments(req: Request, res: Response) {
    this.manager
      .getAll(req.user_id!)
      .then((result: Partial<Document>[]) => res.status(200).json(this.utils.success(result)))
      .catch(e => res.status(500).json(this.utils.error(e)));
  }
  async getDocument(req: Request, res: Response) {
    try {
      const db_doc = await this.manager.get(req.params.id as string, req.user_id!);
      if (!db_doc) return res.status(404).json(this.utils.error('Document not found or unauthorized.'));
      return res.status(200).json(this.utils.success(db_doc));
    } catch (e) {
      return res.status(500).json(this.utils.error(e));
    }
  }
  async add(req: Request, res: Response) {
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
    try {
      const r = await this.manager.add(document);
      return res.status(201).json(this.utils.success(r));
    } catch (e) {
      return res.status(500).json(this.utils.error(e));
    }
  }
  async updateDocument(req: Request, res: Response) {
    try {
      const db_doc = await this.manager.get(req.params.id as string, req.user_id!);
      if (!db_doc) return res.status(404).json(this.utils.error('Document not found or unauthorized.'));
      const result = await this.manager.put(req.params.id as string, {
        name: req.body.name,
        description: req.body.description,
        tags: req.body.tags,
        category: req.body.category,
        parent_id: req.body.parent_id,
        accessibility: req.body.accessibility,
        content_markdown: req.body.content_markdown,
        content_html: req.body.content_html,
        author_id: db_doc.author_id,
        updated_timestamp: Date.now().toString(),
      });
      return res.status(200).json(this.utils.success(result));
    } catch (e) {
      return res.status(500).json(this.utils.error(e));
    }
  }
  async deleteDocument(req: Request, res: Response) {
    try {
      const db_doc = await this.manager.get(req.params.id as string, req.user_id!);
      if (!db_doc) return res.status(404).json(this.utils.error('Document not found or unauthorized.'));
      return this.manager
        .delete(req.params.id as string)
        .then(r => res.status(200).json(this.utils.success(r)))
        .catch(e => res.status(500).json(this.utils.error(e)));
    } catch (e) {
      return res.status(500).json(this.utils.error(e));
    }
  }
}
