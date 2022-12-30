"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const fs_1 = require("fs");
const sharp_1 = tslib_1.__importDefault(require("sharp"));
const functions_1 = require("../utils/functions");
function uploadImage(_, req, res) {
    // TEST IF req.files and req.files.file and req.files.file[0] exist
    if (!req.files || !('file' in req.files) || !req.files.file?.length || !req.files.file[0]) {
        res.status(400).json((0, functions_1.error)('No file provided.'));
        return;
    }
    const file = req.files.file[0].filename;
    if (!file) {
        res.status(400).json((0, functions_1.error)('No file provided.'));
        return;
    }
    const path = (0, path_1.join)(__dirname, `../../public/uploads/images/${file}`);
    if ((0, fs_1.existsSync)(path)) {
        (0, sharp_1.default)(path)
            .toFile((0, path_1.join)(__dirname, `../../public/uploads/webp/${file}.webp`))
            .then(() => {
            res.status(200).json((0, functions_1.success)(`/uploads/webp/${file}.webp`));
        })
            .catch(_ => {
            res.status(500).json({
                success: false,
                message: 'Error uploading image',
            });
        });
    }
    else
        res.status(404).json((0, functions_1.error)('File not found.'));
}
exports.uploadImage = uploadImage;
//# sourceMappingURL=cdn.js.map