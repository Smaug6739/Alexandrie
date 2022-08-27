"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const sharp_1 = __importDefault(require("sharp"));
const functions_1 = require("../utils/functions");
function uploadImage(req, res) {
    const file = req.files.file[0].filename;
    const path = (0, path_1.join)(__dirname, `../../public/uploads/images/${file}`);
    if ((0, fs_1.existsSync)(path)) {
        (0, sharp_1.default)(path)
            .toFile((0, path_1.join)(__dirname, `../../public/uploads/images/webp/${file}.webp`))
            .then(() => {
            res.status(200).json({
                success: true,
                message: 'Image uploaded',
            });
        })
            .catch(err => {
            (0, functions_1.error)(err);
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
