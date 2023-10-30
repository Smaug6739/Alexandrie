"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const DocumentsManager_1 = tslib_1.__importDefault(require("../classes/DocumentsManager"));
const functions_1 = require("../utils/functions");
class DocumentsController {
    constructor(app) {
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "db_a", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.app = app;
        this.db_a = new DocumentsManager_1.default(app);
    }
    getAllDocuments(req, res) {
        if (req.query.category) {
            this.db_a
                .getAllByCategory(req.query.category.toString())
                .then((value) => res.status(200).json((0, functions_1.success)(value)))
                .catch((err) => res.status(500).json((0, functions_1.error)(err.message)));
        }
        else {
            this.db_a
                .getAll()
                .then((result) => {
                // Select fields
                if (req.query.fields) {
                    const Qfields = req.query.fields.toString().split(',');
                    if (Qfields.length) {
                        result = result.map((item) => {
                            const filtered = {};
                            Qfields.forEach(field => {
                                if (item[field])
                                    filtered[field] = item[field];
                            });
                            return filtered;
                        });
                    }
                }
                res.status(200).json((0, functions_1.success)(result));
            })
                .catch(e => res.status(500).json((0, functions_1.error)(e)));
        }
    }
    getDocument(req, res) {
        this.db_a
            .get(req.params.id)
            .then(r => res.status(200).json((0, functions_1.success)(r)))
            .catch(e => res.status(500).json((0, functions_1.error)(e)));
    }
    add(req, res) {
        this.db_a
            .add({
            name: req.body.name,
            description: req.body.description,
            tags: req.body.tags,
            category: req.body.category,
            accessibility: req.body.accessibility,
            content_markdown: req.body.content_markdown,
            content_html: req.body.content_html,
            author_id: req.cookies.user_id,
        })
            .then(r => res.status(201).json((0, functions_1.success)(r)))
            .catch(err => res.status(500).json((0, functions_1.error)(err.message)));
    }
    updateDocument(req, res) {
        this.db_a
            .put(req.params.id, {
            name: req.body.name,
            description: req.body.description,
            tags: req.body.tags,
            category: req.body.category,
            accessibility: req.body.accessibility,
            content_markdown: req.body.content_markdown,
            content_html: req.body.content_html,
            author_id: req.cookies.user_id,
        })
            .then(r => res.status(201).json((0, functions_1.success)(r)))
            .catch(err => res.status(500).json((0, functions_1.error)(err.message)));
    }
    deleteDocument(req, res) {
        this.db_a
            .delete(req.params.id)
            .then(r => res.status(201).json((0, functions_1.success)(r)))
            .catch((err) => res.status(500).json((0, functions_1.error)(err.message)));
    }
}
exports.default = DocumentsController;
//# sourceMappingURL=documents.controller.js.map