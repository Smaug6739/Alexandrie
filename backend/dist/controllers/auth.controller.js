"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Users_1 = tslib_1.__importDefault(require("../classes/Users"));
const functions_1 = require("../utils/functions");
const jsonwebtoken_1 = require("jsonwebtoken");
const COOKIE_CONFIG = {
    maxAge: 3600000 * 3,
    httpOnly: true,
    domain: process.env.FRONT_DOMAIN,
    secure: process.env.NODE_ENV == 'production' ? true : false,
    sameSite: 'lax',
};
class Authentification {
    constructor(app) {
        Object.defineProperty(this, "Users", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.Users = new Users_1.default(app);
    }
    authentification(_, req, res) {
        this.Users.auth(req.body.username, req.body.password)
            .then(result => {
            const token = (0, jsonwebtoken_1.sign)({ expiresIn: '6h', userId: result.id }, process.env.JWT_SECRET || '');
            res.cookie('user_token', `${token}`, COOKIE_CONFIG); //process.env.NODE_ENV == 'production' ? 'None' : 'lax'
            res.cookie('user_id', `${result.id}`, COOKIE_CONFIG); //process.env.NODE_ENV == 'production' ? 'None' : 'lax'
            res.cookie('user_auth', `true`, { ...COOKIE_CONFIG, httpOnly: false }); //process.env.NODE_ENV == 'production' ? 'None' : 'lax'
            res.status(200).json((0, functions_1.success)({ auth: true }));
        })
            .catch(e => res.json((0, functions_1.error)(e)));
    }
    disconnection(_, __, res) {
        res.clearCookie('user_auth', { domain: process.env.FRONT_DOMAIN });
        res.clearCookie('user_id', { domain: process.env.FRONT_DOMAIN });
        res.clearCookie('user_token', { domain: process.env.FRONT_DOMAIN });
        res.status(200).json((0, functions_1.success)('success'));
    }
}
exports.default = Authentification;
//# sourceMappingURL=auth.controller.js.map