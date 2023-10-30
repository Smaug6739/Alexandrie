"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const documents_controller_1 = tslib_1.__importDefault(require("../../controllers/documents.controller"));
const auth_1 = tslib_1.__importDefault(require("../../middlewares/auth"));
const DocumentsRouter = (0, express_1.Router)();
exports.default = (client) => {
    const controller = new documents_controller_1.default(client);
    return {
        route: 'documents',
        version: 1,
        router() {
            DocumentsRouter.get('/', (req, res) => controller.getAllDocuments(req, res));
            DocumentsRouter.get('/:id', (req, res) => controller.getDocument(req, res));
            DocumentsRouter.post('/', auth_1.default, (req, res) => controller.add(req, res));
            DocumentsRouter.patch('/:id', auth_1.default, (req, res) => controller.updateDocument(req, res));
            DocumentsRouter.delete('/:id', auth_1.default, (req, res) => controller.deleteDocument(req, res));
            return DocumentsRouter;
        },
    };
};
//# sourceMappingURL=documents.js.map