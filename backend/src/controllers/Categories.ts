import Categorie from '../classes/Categories';
import { error, success } from '../utils/functions';
import type { Request, Response } from 'express';
import type { App } from '../app';

const Categories = new Categorie();

export function getAll(client: App, req: Request, res: Response): void {
  Categories.getAll()
    .then((result: any) => res.status(200).json(success(result)))
    .catch((err: Error) => res.status(500).json(error(err.message)));
}

export function addMainCategory(client: App, req: Request, res: Response): void {
  Categories.addMainCategory(req.body.name, req.body.description, req.body.order, req.body.path, req.body.icon)
    .then(c => res.status(201).json(success(c)))
    .catch(err => res.status(500).json(error(err.message)));
}

export function addSubCategory(client: App, req: Request, res: Response): void {
  Categories.addSubCategory(
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

export function updateMainCategory(client: App, req: Request, res: Response) {
  Categories.updateMainCategory(req.params.id, req.body.name, req.body.description, req.body.order, req.body.path, req.body.icon)
    .then(() => res.status(200).json(success('success')))
    .catch(err => res.status(500).json(error(err.message)));
}

export function updateSubCategory(client: App, req: Request, res: Response) {
  Categories.updateSubCategory(
    req.params.id,
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

export function deleteMainCategory(client: App, req: Request, res: Response) {
  Categories.deleteMainCategory(req.params.id)
    .then(() => res.status(200).json(success('success')))
    .catch((err: Error) => res.status(500).json(error(err.message)));
}

export function deleteSubCategory(client: App, req: Request, res: Response) {
  Categories.deleteSubCategory(req.params.id)
    .then(() => res.status(200).json(success('success')))
    .catch((err: Error) => res.status(500).json(error(err.message)));
}
