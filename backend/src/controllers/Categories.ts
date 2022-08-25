import Categorie from '../classes/Categories';
import { IObject } from '../types';
import { error, success } from '../utils/functions';
const Categories = new Categorie();

export function getAll(req: IObject, res: IObject): void {
  Categories.getAll()
    .then((result: any) => res.status(201).json(success(result)))
    .catch((err: Error) => res.json(error(err.message)));
}

export function addMainCategory(req: IObject, res: IObject): void {
  Categories.addMainCategory(req.body.name, req.body.path, req.body.description, req.body.icon)
    .then(() => res.status(201).json(success('success')))
    .catch(err => res.json(error(err.message)));
}

export function addSubCategory(req: IObject, res: IObject): void {
  Categories.addSubCategory(req.body.name, req.body.path, req.body.description, req.body.icon, req.body.parent_category)
    .then(() => res.status(201).json(success('success')))
    .catch(err => res.json(error(err.message)));
}

export function updateMainCategory(req: IObject, res: IObject) {
  console.log(req.body);

  Categories.updateMainCategory(req.params.id, req.body.name, req.body.path, req.body.description, req.body.icon)
    .then(() => res.status(200).json(success('success')))
    .catch(err => res.json(error(err.message)));
}

export function updateSubCategory(req: IObject, res: IObject) {
  Categories.updateSubCategory(
    req.params.id,
    req.body.name,
    req.body.path,
    req.body.description,
    req.body.icon,
    req.body.parent_category,
  )
    .then(() => res.status(200).json(success('success')))
    .catch(err => res.json(error(err.message)));
}

export function deleteMainCategory(req: IObject, res: IObject) {
  Categories.deleteMainCategory(req.params.id)
    .then(() => res.status(200).json(success('success')))
    .catch((err: Error) => res.json(error(err.message)));
}

export function deleteSubCategory(req: IObject, res: IObject) {
  Categories.deleteSubCategory(req.params.id)
    .then(() => res.status(200).json(success('success')))
    .catch((err: Error) => res.json(error(err.message)));
}
