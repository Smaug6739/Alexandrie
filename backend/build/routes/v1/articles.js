"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const articles_1 = tslib_1.__importDefault(require("../../controllers/articles"));
const auth_1 = tslib_1.__importDefault(require("../../middlewares/auth"));
const ArticlesRouter = (0, express_1.Router)();
exports.default = (client) => {
    const controller = new articles_1.default(client);
    return {
        route: 'articles',
        version: 1,
        router() {
            ArticlesRouter.get('/', (req, res) => controller.getAllArticles(req, res));
            ArticlesRouter.post('/', auth_1.default, (req, res) => controller.add(req, res));
            ArticlesRouter.patch('/:id', auth_1.default, (req, res) => controller.updateArticle(req, res));
            ArticlesRouter.delete('/:id', auth_1.default, (req, res) => controller.deleteArticle(req, res));
            return ArticlesRouter;
        },
    };
};
//# sourceMappingURL=articles.js.map