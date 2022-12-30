"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Articles_1 = tslib_1.__importDefault(require("../classes/Articles"));
const functions_1 = require("../utils/functions");
class ArticlesController {
    constructor(app) {
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "Articles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.app = app;
        this.Articles = new Articles_1.default();
    }
    getAllArticles(req, res) {
        if (req.query.category) {
            this.Articles.getAllByCategory(req.query.category.toString())
                .then((result) => res.status(200).json((0, functions_1.success)(result)))
                .catch((err) => res.status(500).json((0, functions_1.error)(err.message)));
        }
        else {
            this.Articles.getAll()
                .then((result) => res.status(200).json((0, functions_1.success)(result)))
                .catch((err) => res.status(500).json((0, functions_1.error)(err.message)));
        }
    }
    add(req, res) {
        this.Articles.add(req.body.name, req.body.path, req.body.main_category, req.body.sub_category, req.body.description, req.body.content_markdown, req.body.content_html, req.cookies.user_id)
            .then(a => res.status(201).json((0, functions_1.success)(a)))
            .catch(err => res.status(500).json((0, functions_1.error)(err.message)));
    }
    updateArticle(req, res) {
        this.Articles.put(req.params.id, req.body.name, req.body.description, req.body.path, req.body.main_category, req.body.sub_category, req.body.content_markdown, req.body.content_html)
            .then(() => res.status(201).json((0, functions_1.success)('success')))
            .catch(err => res.status(500).json((0, functions_1.error)(err.message)));
    }
    deleteArticle(req, res) {
        this.Articles.delete(req.params.id)
            .then(() => res.status(201).json((0, functions_1.success)('success')))
            .catch((err) => res.status(500).json((0, functions_1.error)(err.message)));
    }
}
exports.default = ArticlesController;
//# sourceMappingURL=articles.js.map