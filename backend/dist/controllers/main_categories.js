'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.deleteResource = exports.update = exports.add = exports.getResource = exports.getAll = void 0;
const MainCategories_1 = __importDefault(require('../classes/MainCategories'));
const functions_1 = require('../utils/functions');
const Categories = new MainCategories_1.default();
function getAll(req, res) {
  Categories.getAll()
    .then(result => res.status(201).json((0, functions_1.success)(result)))
    .catch(err => res.json((0, functions_1.error)(err.message)));
}
exports.getAll = getAll;
function getResource(req, res) {
  Categories.get(req.params.resourceId)
    .then(result => res.status(201).json((0, functions_1.success)(result)))
    .catch(err => res.json((0, functions_1.error)(err.message)));
}
exports.getResource = getResource;
function add(req, res) {
  Categories.add(req.body.name, req.body.category, req.body.description, req.body.content, req.cookies.user_id)
    .then(() => res.status(201).json((0, functions_1.success)('success')))
    .catch(err => res.json((0, functions_1.error)(err.message)));
}
exports.add = add;
function update(req, res) {
  let miniature = '';
  let source_code = '';
  if (req.files && req.files.miniature) miniature = req.files.miniature[0].filename;
  if (req.files && req.files.source) source_code = req.files.source[0].filename;
  Categories.put(
    req.params.resourceId,
    req.body.name,
    req.body.category,
    req.body.description,
    req.body.content,
    req.cookies.user_id,
  )
    .then(() => res.status(201).json((0, functions_1.success)('success')))
    .catch(err => res.json((0, functions_1.error)(err.message)));
}
exports.update = update;
function deleteResource(req, res) {
  Categories.delete(req.params.resourceId)
    .then(() => res.status(201).json((0, functions_1.success)('success')))
    .catch(err => res.json((0, functions_1.error)(err.message)));
}
exports.deleteResource = deleteResource;
