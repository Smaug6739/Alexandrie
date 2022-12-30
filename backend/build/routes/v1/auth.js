"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const AuthCtrl = tslib_1.__importStar(require("../../controllers/auth"));
const AuthRouter = (0, express_1.Router)();
exports.default = (client) => {
    return {
        route: 'auth',
        version: 1,
        router() {
            AuthRouter.post('/', (req, res) => AuthCtrl.auth(client, req, res));
            AuthRouter.get('/disconnection', (req, res) => AuthCtrl.disconnection(client, req, res));
            return AuthRouter;
        },
    };
};
//# sourceMappingURL=auth.js.map