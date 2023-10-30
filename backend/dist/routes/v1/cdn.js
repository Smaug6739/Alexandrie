"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const CDNCtrl = tslib_1.__importStar(require("../../controllers/cdn.controller"));
const auth_1 = tslib_1.__importDefault(require("../../middlewares/auth"));
const multer_cdn_1 = tslib_1.__importDefault(require("../../middlewares/multer.cdn"));
const multer_1 = tslib_1.__importDefault(require("multer"));
const functions_1 = require("../../utils/functions");
const CDNRouter = (0, express_1.Router)();
exports.default = (app) => {
    return {
        route: 'cdn',
        version: 1,
        router() {
            CDNRouter.post('/image', auth_1.default, multer_cdn_1.default, (req, res) => CDNCtrl.convertImagetoWebp(app, req, res), multerErrors);
            return CDNRouter;
        },
    };
};
function multerErrors(err, _, res, next) {
    console.log(err);
    console.log(err.message === '[BAD_MIMETYPE]');
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE')
            return res.status(400).json((0, functions_1.error)('File size is too large.'));
        else
            res.status(400).json((0, functions_1.error)(err.message));
    }
    if (err) {
        if (err.message === '[BAD_MIMETYPE]')
            return res.status(400).json((0, functions_1.error)('Only images and vectors are alowed.'));
        return res.status(400).json((0, functions_1.error)(err.message));
    }
    return next();
}
//# sourceMappingURL=cdn.js.map