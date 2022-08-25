"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnection = exports.auth = void 0;
const Members_1 = require("../classes/Members");
const functions_1 = require("../utils/functions");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
const Members = new Members_1.MemberClass();
function auth(req, res) {
    Members.auth(req.body.username, req.body.password)
        .then(result => {
        const token = (0, jsonwebtoken_1.sign)({
            exp: Math.floor(Math.floor(Date.now() / 1000) + 6 * 60 * 60),
            expiresIn: 20000,
            userId: result.id,
            userPermissions: result.permissions,
        }, config_1.config.secret);
        res.cookie('user_token', `${token}`, {
            maxAge: 3600000,
            httpOnly: true,
            domain: config_1.config.domain,
            secure: process.env.NODE_ENV == 'production' ? true : false,
            sameSite: 'Lax',
        }); //process.env.NODE_ENV == 'production' ? 'None' : 'Lax'
        res.cookie('user_id', `${result.id}`, {
            maxAge: 3600000,
            httpOnly: true,
            domain: config_1.config.domain,
            secure: process.env.NODE_ENV == 'production' ? true : false,
            sameSite: 'Lax',
        }); //process.env.NODE_ENV == 'production' ? 'None' : 'Lax'
        res.cookie('user_auth', `true`, {
            maxAge: 3600000,
            httpOnly: false,
            domain: config_1.config.domain,
            secure: process.env.NODE_ENV == 'production' ? true : false,
            sameSite: 'Lax',
        }); //process.env.NODE_ENV == 'production' ? 'None' : 'Lax'
        res.status(200).json((0, functions_1.checkAndChange)({
            auth: {
                auth: true,
            },
        }));
    })
        .catch(error => res.json((0, functions_1.checkAndChange)(error)));
}
exports.auth = auth;
function disconnection(req, res) {
    res.clearCookie('user_auth');
    res.clearCookie('user_id');
    res.clearCookie('user_token');
    res.status(200).json((0, functions_1.checkAndChange)('success'));
}
exports.disconnection = disconnection;
