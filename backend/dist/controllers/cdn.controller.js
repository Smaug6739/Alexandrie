"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertImagetoWebp = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const fs_1 = require("fs");
const sharp_1 = tslib_1.__importDefault(require("sharp"));
const functions_1 = require("../utils/functions");
function convertImagetoWebp(_, req, res) {
    if (typeof req.files != 'object' || !('file' in req.files) || !req.files.file[0]) {
        res.status(400).json((0, functions_1.error)('No file provided.'));
        return;
    }
    const filename = req.files['file'][0].filename;
    if (!filename) {
        res.status(400).json((0, functions_1.error)('No file provided.'));
        return;
    }
    const path = (0, path_1.join)(__dirname, `../../uploads/images/${filename}`);
    if ((0, fs_1.existsSync)(path)) {
        (0, sharp_1.default)(path)
            .toFile((0, path_1.join)(__dirname, `../../uploads/webp/${filename.split('.')[0]}.webp`))
            .then(() => res.status(200).json((0, functions_1.success)(`/webp/${filename.split('.')[0]}.webp`)))
            .catch(_ => res.status(500).json((0, functions_1.error)('Error while converting image to webp.')));
    }
    else
        res.status(404).json((0, functions_1.error)('File not found.'));
}
exports.convertImagetoWebp = convertImagetoWebp;
//# sourceMappingURL=cdn.controller.js.map