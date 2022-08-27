"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubCategory = exports.deleteMainCategory = exports.updateSubCategory = exports.updateMainCategory = exports.addSubCategory = exports.addMainCategory = exports.getAll = void 0;
const Categories_1 = __importDefault(require("../classes/Categories"));
const functions_1 = require("../utils/functions");
const Categories = new Categories_1.default();
function getAll(req, res) {
    Categories.getAll()
        .then((result) => res.status(200).json((0, functions_1.success)(result)))
        .catch((err) => res.json((0, functions_1.error)(err.message)));
}
exports.getAll = getAll;
function addMainCategory(req, res) {
    Categories.addMainCategory(req.body.name, req.body.path, req.body.description, req.body.icon)
        .then(() => res.status(201).json((0, functions_1.success)('success')))
        .catch(err => res.json((0, functions_1.error)(err.message)));
}
exports.addMainCategory = addMainCategory;
function addSubCategory(req, res) {
    Categories.addSubCategory(req.body.name, req.body.path, req.body.description, req.body.icon, req.body.parent_category)
        .then(() => res.status(201).json((0, functions_1.success)('success')))
        .catch(err => res.json((0, functions_1.error)(err.message)));
}
exports.addSubCategory = addSubCategory;
function updateMainCategory(req, res) {
    Categories.updateMainCategory(req.params.id, req.body.name, req.body.path, req.body.description, req.body.icon)
        .then(() => res.status(200).json((0, functions_1.success)('success')))
        .catch(err => res.json((0, functions_1.error)(err.message)));
}
exports.updateMainCategory = updateMainCategory;
function updateSubCategory(req, res) {
    Categories.updateSubCategory(req.params.id, req.body.name, req.body.path, req.body.description, req.body.icon, req.body.parent_category)
        .then(() => res.status(200).json((0, functions_1.success)('success')))
        .catch(err => res.json((0, functions_1.error)(err.message)));
}
exports.updateSubCategory = updateSubCategory;
function deleteMainCategory(req, res) {
    Categories.deleteMainCategory(req.params.id)
        .then(() => res.status(200).json((0, functions_1.success)('success')))
        .catch((err) => res.json((0, functions_1.error)(err.message)));
}
exports.deleteMainCategory = deleteMainCategory;
function deleteSubCategory(req, res) {
    Categories.deleteSubCategory(req.params.id)
        .then(() => res.status(200).json((0, functions_1.success)('success')))
        .catch((err) => res.json((0, functions_1.error)(err.message)));
}
exports.deleteSubCategory = deleteSubCategory;
