import CategoriesManager from '../classes/Categories';
import { error, success } from '../utils/functions';
import type { Request, Response } from 'express';
import type { App } from '../app';

export default class CategoriesController {
  app: App;
  db_c: CategoriesManager;
  constructor(app: App) {
    this.app = app;
    this.db_c = new CategoriesManager(app);
  }
  getAll(_: Request, res: Response) {
    this.db_c
      .getAll()
      .then((result: any) => res.status(200).json(success(result)))
      .catch((err: Error) => res.status(500).json(error(err.message)));
  }

  add(req: Request, res: Response) {
    this.db_c
      .add({ name: req.body.name, icon: req.body.icon, order: req.body.order, parent_id: req.body.parent_id })
      .then(r => res.status(201).json(success(r)))
      .catch(err => res.status(500).json(error(err.message)));
  }

  update(req: Request, res: Response) {
    this.db_c
      .update({
        id: req.params.id!,
        name: req.body.name,
        icon: req.body.icon,
        order: req.body.order,
        parent_id: req.body.parent_id,
      })
      .then(r => res.status(200).json(success(r)))
      .catch(err => res.status(500).json(error(err.message)));
  }

  delete(req: Request, res: Response) {
    this.db_c
      .delete(req.params.id!)
      .then(r => res.status(200).json(success(r)))
      .catch(err => res.status(500).json(error(err.message)));
  }
}
