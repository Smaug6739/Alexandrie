"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const CDNCtrl = tslib_1.__importStar(require("../../controllers/cdn"));
const auth_1 = tslib_1.__importDefault(require("../../middlewares/auth"));
const multer_cdn_1 = tslib_1.__importDefault(require("../../middlewares/multer.cdn"));
const CDNRouter = (0, express_1.Router)();
exports.default = (client) => {
    return {
        route: 'cdn',
        version: 1,
        router() {
            CDNRouter.post('/image', auth_1.default, multer_cdn_1.default, (req, res) => CDNCtrl.uploadImage(client, req, res));
            CDNRouter.post('/', (req, res) => CDNCtrl.uploadImage(client, req, res));
            return CDNRouter;
        },
    };
};
//# sourceMappingURL=cdn.js.map