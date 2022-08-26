"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.updateArticle = exports.add = exports.getAllArticles = void 0;
const Articles_1 = __importDefault(require("../classes/Articles"));
const functions_1 = require("../utils/functions");
const Articles = new Articles_1.default();
function getAllArticles(req, res) {
    if (req.query.category) {
        Articles.getAllByCategory(req.query.category)
            .then((result) => res.status(200).json((0, functions_1.success)(result)))
            .catch((err) => res.json((0, functions_1.error)(err.message)));
    }
    else {
        Articles.getAll()
            .then((result) => res.status(200).json((0, functions_1.success)(result)))
            .catch((err) => res.json((0, functions_1.error)(err.message)));
    }
}
exports.getAllArticles = getAllArticles;
function add(req, res) {
    Articles.add(req.body.name, req.body.path, req.body.main_category, req.body.sub_category, req.body.description, req.body.content_markdown, req.body.content_html, req.body.author)
        .then(() => res.status(201).json((0, functions_1.success)('success')))
        .catch(err => res.json((0, functions_1.error)(err.message)));
}
exports.add = add;
function updateArticle(req, res) {
    Articles.put(req.params.id, req.body.name, req.body.main_category, req.body.sub_category, req.body.description, req.body.content_markdown, req.body.content_html)
        .then(() => res.status(201).json((0, functions_1.success)('success')))
        .catch(err => res.json((0, functions_1.error)(err.message)));
}
exports.updateArticle = updateArticle;
function deleteArticle(req, res) {
    Articles.delete(req.params.id)
        .then(() => res.status(201).json((0, functions_1.success)('success')))
        .catch((err) => res.json((0, functions_1.error)(err.message)));
}
exports.deleteArticle = deleteArticle;
