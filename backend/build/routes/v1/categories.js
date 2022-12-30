"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const Categories_1 = tslib_1.__importDefault(require("../../controllers/Categories"));
const auth_1 = tslib_1.__importDefault(require("../../middlewares/auth"));
const CategoriesRouter = (0, express_1.Router)();
exports.default = (client) => {
    const controller = new Categories_1.default(client);
    return {
        route: 'categories',
        version: 1,
        router() {
            CategoriesRouter.get('/', (req, res) => controller.getAll(req, res));
            CategoriesRouter.post('/main', auth_1.default, (req, res) => controller.addMainCategory(req, res));
            CategoriesRouter.post('/sub', auth_1.default, (req, res) => controller.addSubCategory(req, res));
            CategoriesRouter.patch('/main/:id', auth_1.default, (req, res) => controller.updateMainCategory(req, res));
            CategoriesRouter.patch('/sub/:id', auth_1.default, (req, res) => controller.updateSubCategory(req, res));
            CategoriesRouter.delete('/main/:id', auth_1.default, (req, res) => controller.deleteMainCategory(req, res));
            CategoriesRouter.delete('/sub/:id', auth_1.default, (req, res) => controller.deleteSubCategory(req, res));
            return CategoriesRouter;
        },
    };
};
//# sourceMappingURL=categories.js.map