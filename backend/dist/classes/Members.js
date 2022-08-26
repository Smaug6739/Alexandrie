"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberClass = void 0;
const db_1 = __importDefault(require("../models/db"));
const bcrypt_1 = require("bcrypt");
class MemberClass {
    auth(username, password) {
        return new Promise((resolve, reject) => {
            if (!username || (username && username.trim() === ''))
                return reject(new Error('Username must be provided.'));
            if (!password || (password && password.trim() === ''))
                return reject(new Error('Password must be provided.'));
            db_1.default.query('SELECT * FROM members WHERE username = ? LIMIT 1', [username], (err, result) => {
                if (err)
                    return reject(new Error(err.message));
                if (result[0]) {
                    (0, bcrypt_1.compare)(password, result[0].password).then((valid) => {
                        if (!valid)
                            return reject(new Error('Bad username/password.'));
                        else
                            return resolve(result[0]);
                    });
                }
                else
                    return reject(new Error('Bad username/password.'));
            });
        });
    }
}
exports.MemberClass = MemberClass;
