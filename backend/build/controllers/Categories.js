"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Categories_1 = tslib_1.__importDefault(require("../classes/Categories"));
const functions_1 = require("../utils/functions");
const Categories = new Categories_1.default();
class CategoriesController {
    constructor(app) {
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.app = app;
    }
    getAll(_, res) {
        Categories.getAll()
            .then((result) => res.status(200).json((0, functions_1.success)(result)))
            .catch((err) => res.status(500).json((0, functions_1.error)(err.message)));
    }
    addMainCategory(req, res) {
        Categories.addMainCategory(req.body.name, req.body.description, req.body.order, req.body.path, req.body.icon)
            .then(c => res.status(201).json((0, functions_1.success)(c)))
            .catch(err => res.status(500).json((0, functions_1.error)(err.message)));
    }
    addSubCategory(req, res) {
        Categories.addSubCategory(req.body.name, req.body.description, req.body.order, req.body.path, req.body.icon, req.body.parent_category)
            .then(c => res.status(201).json((0, functions_1.success)(c)))
            .catch(err => res.status(500).json((0, functions_1.error)(err.message)));
    }
    updateMainCategory(req, res) {
        Categories.updateMainCategory(req.params.id, req.body.name, req.body.description, req.body.order, req.body.path, req.body.icon)
            .then(() => res.status(200).json((0, functions_1.success)('success')))
            .catch(err => res.status(500).json((0, functions_1.error)(err.message)));
    }
    updateSubCategory(req, res) {
        Categories.updateSubCategory(req.params.id, req.body.name, req.body.description, req.body.order, req.body.path, req.body.icon, req.body.parent_category)
            .then(() => res.status(200).json((0, functions_1.success)('success')))
            .catch(err => res.status(500).json((0, functions_1.error)(err.message)));
    }
    deleteMainCategory(req, res) {
        Categories.deleteMainCategory(req.params.id)
            .then(() => res.status(200).json((0, functions_1.success)('success')))
            .catch(err => res.status(500).json((0, functions_1.error)(err.message)));
    }
    deleteSubCategory(req, res) {
        Categories.deleteSubCategory(req.params.id)
            .then(() => res.status(200).json((0, functions_1.success)('success')))
            .catch(err => res.status(500).json((0, functions_1.error)(err.message)));
    }
}
exports.default = CategoriesController;
//# sourceMappingURL=Categories.js.map