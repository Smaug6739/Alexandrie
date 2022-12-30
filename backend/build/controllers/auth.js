"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnection = exports.auth = void 0;
const Members_1 = require("../classes/Members");
const functions_1 = require("../utils/functions");
const jsonwebtoken_1 = require("jsonwebtoken");
const Members = new Members_1.MemberClass();
function auth(_, req, res) {
    Members.auth(req.body.username, req.body.password)
        .then(result => {
        const token = (0, jsonwebtoken_1.sign)({
            exp: Math.floor(Math.floor(Date.now() / 1000) + 6 * 60 * 60),
            expiresIn: 20000,
            userId: result.id,
            userPermissions: result.permissions,
        }, process.env.JWT_SECRET || '');
        res.cookie('user_token', `${token}`, {
            maxAge: 3600000 * 3,
            httpOnly: true,
            domain: process.env.FRONT_DOMAIN,
            secure: process.env.NODE_ENV == 'production' ? true : false,
            sameSite: 'lax',
        }); //process.env.NODE_ENV == 'production' ? 'None' : 'lax'
        res.cookie('user_id', `${result.id}`, {
            maxAge: 3600000 * 3,
            httpOnly: true,
            domain: process.env.FRONT_DOMAIN,
            secure: process.env.NODE_ENV == 'production' ? true : false,
            sameSite: 'lax',
        }); //process.env.NODE_ENV == 'production' ? 'None' : 'lax'
        res.cookie('user_auth', `true`, {
            maxAge: 3600000 * 3,
            httpOnly: false,
            domain: process.env.FRONT_DOMAIN,
            secure: process.env.NODE_ENV == 'production' ? true : false,
            sameSite: 'lax',
        }); //process.env.NODE_ENV == 'production' ? 'None' : 'lax'
        res.status(200).json((0, functions_1.checkAndChange)({
            auth: {
                auth: true,
            },
        }));
    })
        .catch(error => res.json((0, functions_1.checkAndChange)(error)));
}
exports.auth = auth;
function disconnection(_, __, res) {
    res.clearCookie('user_auth', { domain: process.env.FRONT_DOMAIN });
    res.clearCookie('user_id', { domain: process.env.FRONT_DOMAIN });
    res.clearCookie('user_token', { domain: process.env.FRONT_DOMAIN });
    res.status(200).json((0, functions_1.checkAndChange)('success'));
}
exports.disconnection = disconnection;
//# sourceMappingURL=auth.js.map