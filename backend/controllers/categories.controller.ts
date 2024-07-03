import BaseController from './BaseController';
import { CategoriesManager } from '../classes';
import type { Request, Response } from 'express';
import { Category } from '../types';

export default class CategoriesController extends BaseController<CategoriesManager, Category> {
  constructor(app: App) {
    super(new CategoriesManager(app));
  }
  getAll(_: Request, res: Response) {
    this.manager
      .getAll()
      .then((result: any) => res.status(200).json(this.utils.success(result)))
      .catch((err: Error) => res.status(500).json(this.utils.error(err.message)));
  }

  add(req: Request, res: Response) {
    this.manager
      .add({
        id: this.app.snowflake.generate().toString(),
        name: req.body.name,
        icon: req.body.icon,
        order: req.body.order,
        parent_id: req.body.parent_id,
      })
      .then(r => res.status(201).json(this.utils.success(r)))
      .catch(err => res.status(500).json(this.utils.error(err.message)));
  }

  update(req: Request, res: Response) {
    this.manager
      .update({
        id: req.params.id!,
        name: req.body.name,
        icon: req.body.icon,
        order: req.body.order,
        parent_id: req.body.parent_id,
      })
      .then(r => res.status(200).json(this.utils.success(r)))
      .catch(err => res.status(500).json(this.utils.error(err.message)));
  }

  delete(req: Request, res: Response) {
    this.manager
      .delete(req.params.id!)
      .then(r => res.status(200).json(this.utils.success(r)))
      .catch(err => res.status(500).json(this.utils.error(err.message)));
  }
}
