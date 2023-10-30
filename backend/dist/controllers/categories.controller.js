"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Categories_1 = tslib_1.__importDefault(require("../classes/Categories"));
const functions_1 = require("../utils/functions");
class CategoriesController {
    constructor(app) {
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "db_c", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.app = app;
        this.db_c = new Categories_1.default(app);
    }
    getAll(_, res) {
        this.db_c
            .getAll()
            .then((result) => res.status(200).json((0, functions_1.success)(result)))
            .catch((err) => res.status(500).json((0, functions_1.error)(err.message)));
    }
    add(req, res) {
        this.db_c
            .add({ name: req.body.name, icon: req.body.icon, order: req.body.order, parent_id: req.body.parent_id })
            .then(r => res.status(201).json((0, functions_1.success)(r)))
            .catch(err => res.status(500).json((0, functions_1.error)(err.message)));
    }
    update(req, res) {
        this.db_c
            .update({
            id: req.params.id,
            name: req.body.name,
            icon: req.body.icon,
            order: req.body.order,
            parent_id: req.body.parent_id,
        })
            .then(r => res.status(200).json((0, functions_1.success)(r)))
            .catch(err => res.status(500).json((0, functions_1.error)(err.message)));
    }
    delete(req, res) {
        this.db_c
            .delete(req.params.id)
            .then(r => res.status(200).json((0, functions_1.success)(r)))
            .catch(err => res.status(500).json((0, functions_1.error)(err.message)));
    }
}
exports.default = CategoriesController;
//# sourceMappingURL=categories.controller.js.map