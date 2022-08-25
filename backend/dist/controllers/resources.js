"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResource = exports.update = exports.add = exports.getResource = exports.getArticles = void 0;
const Articles_1 = __importDefault(require("../classes/Articles"));
const functions_1 = require("../utils/functions");
const Articles = new Articles_1.default();
function getArticles(req, res) {
    Articles.getAll(req.params.page)
        .then((result) => res.status(201).json((0, functions_1.success)(result)))
        .catch((err) => res.json((0, functions_1.error)(err.message)));
}
exports.getArticles = getArticles;
function getResource(req, res) {
    Articles.get(req.params.resourceId)
        .then((result) => res.status(201).json((0, functions_1.success)(result)))
        .catch((err) => res.json((0, functions_1.error)(err.message)));
}
exports.getResource = getResource;
function add(req, res) {
    Articles.add(req.body.name, req.body.category, req.body.description, req.body.content, req.body.author)
        .then(() => res.status(201).json((0, functions_1.success)("success")))
        .catch((err) => res.json((0, functions_1.error)(err.message)));
}
exports.add = add;
function update(req, res) {
    let miniature = "";
    let source_code = "";
    if (req.files && req.files.miniature)
        miniature = req.files.miniature[0].filename;
    if (req.files && req.files.source)
        source_code = req.files.source[0].filename;
    Articles.put(req.params.resourceId, req.body.name, req.body.category, req.body.description, req.body.content, req.body.author)
        .then(() => res.status(201).json((0, functions_1.success)("success")))
        .catch((err) => res.json((0, functions_1.error)(err.message)));
}
exports.update = update;
function deleteResource(req, res) {
    Articles.delete(req.params.resourceId)
        .then(() => res.status(201).json((0, functions_1.success)("success")))
        .catch((err) => res.json((0, functions_1.error)(err.message)));
}
exports.deleteResource = deleteResource;
