"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const multer = require('multer');
let name;
let extension;
let fullName;
const tailleMax = 20 * 1024 * 1024; // 20MB
const MIME_TYPES_IMAGE = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
};
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (MIME_TYPES_IMAGE[file.mimetype])
            callback(null, `${(0, path_1.join)(__dirname, `../../public/uploads/images`)}`);
        else
            callback(null, `${(0, path_1.join)(__dirname, `../../public/uploads/other`)}`);
    },
    filename: (req, file, callback) => {
        name = file.originalname.split(' ').join('_').replace('.', '_');
        extension = MIME_TYPES_IMAGE[file.mimetype];
        fullName = name + Date.now() + '.' + extension;
        if (!extension)
            callback(new Error('Only images allowed'));
        callback(null, fullName);
    },
});
exports.default = multer({
    storage: storage,
    limits: {
        fileSize: tailleMax,
    },
    fileFilter: (req, file, cb) => {
        if (MIME_TYPES_IMAGE[file.mimetype]) {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    },
}).fields([
    {
        name: 'file',
        maxCount: 1,
    },
]);
