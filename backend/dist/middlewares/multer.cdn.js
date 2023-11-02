"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
const multer_1 = tslib_1.__importDefault(require("multer"));
const tailleMax = 20 * 1024 * 1024; // 20MB
var MIME_TYPES_IMAGE;
(function (MIME_TYPES_IMAGE) {
    MIME_TYPES_IMAGE["image/jpg"] = "jpg";
    MIME_TYPES_IMAGE["image/jpeg"] = "jpg";
    MIME_TYPES_IMAGE["image/png"] = "png";
    MIME_TYPES_IMAGE["image/gif"] = "gif";
    MIME_TYPES_IMAGE["image/webp"] = "webp";
    MIME_TYPES_IMAGE["image/svg+xml"] = "svg";
})(MIME_TYPES_IMAGE || (MIME_TYPES_IMAGE = {}));
const storage = multer_1.default.diskStorage({
    destination: (_, __, callback) => {
        callback(null, `${(0, path_1.join)(__dirname, `../../../uploads/images`)}`);
    },
    filename: (_, file, callback) => {
        const mimetype = file.mimetype;
        const extension = MIME_TYPES_IMAGE[mimetype];
        const fullName = Date.now().toString() + '.' + extension;
        callback(null, fullName);
    },
});
exports.default = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: tailleMax,
    },
    fileFilter: (_, file, cb) => {
        const mimetype = file.mimetype;
        if (MIME_TYPES_IMAGE[mimetype])
            cb(null, true);
        else
            cb(new Error('[BAD_MIMETYPE]'));
    },
}).fields([
    {
        name: 'file',
        maxCount: 1,
    },
]);
//# sourceMappingURL=multer.cdn.js.map