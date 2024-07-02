import CategoriesManager from '../classes/Categories';
import { error, success } from '../utils/functions';
import type { Request, Response } from 'express';

export default class CategoriesController {
  app: App;
  manager: CategoriesManager;
  constructor(app: App) {
    this.app = app;
    this.manager = new CategoriesManager(app);
  }
  getAll(_: Request, res: Response) {
    this.manager
      .getAll()
      .then((result: any) => res.status(200).json(success(result)))
      .catch((err: Error) => res.status(500).json(error(err.message)));
  }

  add(req: Request, res: Response) {
    this.manager
      .add({ name: req.body.name, icon: req.body.icon, order: req.body.order, parent_id: req.body.parent_id })
      .then(r => res.status(201).json(success(r)))
      .catch(err => res.status(500).json(error(err.message)));
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
      .then(r => res.status(200).json(success(r)))
      .catch(err => res.status(500).json(error(err.message)));
  }

  delete(req: Request, res: Response) {
    this.manager
      .delete(req.params.id!)
      .then(r => res.status(200).json(success(r)))
      .catch(err => res.status(500).json(error(err.message)));
  }
}
