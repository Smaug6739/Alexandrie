import Categorie from '../classes/Categories';
import { error, success } from '../utils/functions';
import type { Request, Response } from 'express';
import type { App } from '@app';

export default class CategoriesController {
  app: App;
  Categories: Categorie;
  constructor(app: App) {
    this.app = app;
    this.Categories = new Categorie(app);
  }
  getAll(_: Request, res: Response): void {
    this.Categories.getAll()
      .then((result: any) => res.status(200).json(success(result)))
      .catch((err: Error) => res.status(500).json(error(err.message)));
  }
  addMainCategory(req: Request, res: Response): void {
    this.Categories.addMainCategory(req.body.name, req.body.description, req.body.order, req.body.path, req.body.icon)
      .then(c => res.status(201).json(success(c)))
      .catch(err => res.status(500).json(error(err.message)));
  }
  addSubCategory(req: Request, res: Response): void {
    this.Categories.addSubCategory(
      req.body.name,
      req.body.description,
      req.body.order,
      req.body.path,
      req.body.icon,
      req.body.parent_category,
    )
      .then(c => res.status(201).json(success(c)))
      .catch(err => res.status(500).json(error(err.message)));
  }
  updateMainCategory(req: Request, res: Response) {
    this.Categories.updateMainCategory(
      req.params.id as string,
      req.body.name,
      req.body.description,
      req.body.order,
      req.body.path,
      req.body.icon,
    )
      .then(() => res.status(200).json(success('success')))
      .catch(err => res.status(500).json(error(err.message)));
  }
  updateSubCategory(req: Request, res: Response) {
    this.Categories.updateSubCategory(
      req.params.id as string,
      req.body.name,
      req.body.description,
      req.body.order,
      req.body.path,
      req.body.icon,
      req.body.parent_category,
    )
      .then(() => res.status(200).json(success('success')))
      .catch(err => res.status(500).json(error(err.message)));
  }
  deleteMainCategory(req: Request, res: Response) {
    this.Categories.deleteMainCategory(req.params.id as string)
      .then(() => res.status(200).json(success('success')))
      .catch(err => res.status(500).json(error(err.message)));
  }
  deleteSubCategory(req: Request, res: Response) {
    this.Categories.deleteSubCategory(req.params.id as string)
      .then(() => res.status(200).json(success('success')))
      .catch(err => res.status(500).json(error(err.message)));
  }
}
