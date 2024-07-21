import BaseController from './BaseController';
import { CategoriesManager } from '../classes';
import type { Request, Response } from 'express';

export default class CategoriesController extends BaseController<CategoriesManager> {
  constructor(app: App) {
    super(new CategoriesManager(app));
  }
  getAll(req: Request, res: Response) {
    this.manager
      .getAll(req.user_id!)
      .then((result: any) => res.status(200).json(this.utils.success(result)))
      .catch((err: Error) => res.status(500).json(this.utils.error(err)));
  }

  add(req: Request, res: Response) {
    this.manager
      .add({
        id: this.app.snowflake.generate().toString(),
        name: req.body.name,
        icon: req.body.icon,
        order: req.body.order || 0,
        parent_id: req.body.parent_id || null,
        author_id: req.user_id!,
      })
      .then(r => res.status(201).json(this.utils.success(r)))
      .catch(err => res.status(500).json(this.utils.error(err)));
  }

  async update(req: Request, res: Response) {
    try {
      const db_cat = await this.manager.get(req.params.id!, req.user_id!);
      if (!db_cat) return res.status(404).json(this.utils.error('Category not found or unauthorized.'));
      const r = await this.manager.update({
        id: req.params.id!,
        name: req.body.name,
        icon: req.body.icon,
        order: req.body.order,
        parent_id: req.body.parent_id,
        author_id: req.user_id!,
      });
      return res.status(200).json(this.utils.success(r));
    } catch (e) {
      return res.status(500).json(this.utils.error(e));
    }
  }

  delete(req: Request, res: Response) {
    this.manager
      .delete(req.params.id!)
      .then(r => res.status(200).json(this.utils.success(r)))
      .catch(err => res.status(500).json(this.utils.error(err)));
  }
}
