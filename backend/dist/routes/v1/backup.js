"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const backups_controller_1 = tslib_1.__importDefault(require("../../controllers/backups.controller"));
const auth_1 = tslib_1.__importDefault(require("../../middlewares/auth"));
const BackupsRouter = (0, express_1.Router)();
exports.default = (client) => {
    const controller = new backups_controller_1.default(client);
    return {
        route: 'backups',
        version: 1,
        router() {
            BackupsRouter.post('', auth_1.default, (req, res) => controller.add(req, res));
            return BackupsRouter;
        },
    };
};
//# sourceMappingURL=backup.js.map