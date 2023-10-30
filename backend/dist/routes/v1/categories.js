"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const categories_controller_1 = tslib_1.__importDefault(require("../../controllers/categories.controller"));
const auth_1 = tslib_1.__importDefault(require("../../middlewares/auth"));
const CategoriesRouter = (0, express_1.Router)();
exports.default = (client) => {
    const controller = new categories_controller_1.default(client);
    return {
        route: 'categories',
        version: 1,
        router() {
            CategoriesRouter.get('/', (req, res) => controller.getAll(req, res));
            CategoriesRouter.post('', auth_1.default, (req, res) => controller.add(req, res));
            CategoriesRouter.patch('/:id', auth_1.default, (req, res) => controller.update(req, res));
            CategoriesRouter.delete('/:id', auth_1.default, (req, res) => controller.delete(req, res));
            return CategoriesRouter;
        },
    };
};
//# sourceMappingURL=categories.js.map