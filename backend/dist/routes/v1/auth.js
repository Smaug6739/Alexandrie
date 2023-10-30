"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const auth_controller_1 = tslib_1.__importDefault(require("../../controllers/auth.controller"));
const AuthRouter = (0, express_1.Router)();
exports.default = (client) => {
    return {
        route: 'auth',
        version: 1,
        router() {
            const controller = new auth_controller_1.default(client);
            AuthRouter.post('/', (req, res) => controller.authentification(client, req, res));
            AuthRouter.get('/disconnection', (req, res) => controller.disconnection(client, req, res));
            return AuthRouter;
        },
    };
};
//# sourceMappingURL=auth.js.map