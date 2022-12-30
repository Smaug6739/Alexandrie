"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberClass = void 0;
const tslib_1 = require("tslib");
const db_1 = tslib_1.__importDefault(require("../models/db"));
const bcrypt_1 = require("bcrypt");
class MemberClass {
    auth(username, password) {
        return new Promise((resolve, reject) => {
            if (!username || (username && username.trim() === ''))
                return reject(new Error('Username must be provided.'));
            if (!password || (password && password.trim() === ''))
                return reject(new Error('Password must be provided.'));
            db_1.default.query('SELECT * FROM members WHERE username = ? LIMIT 1', [username], async (err, results) => {
                if (err)
                    return reject('Internal database error.');
                if (!results[0])
                    return reject(new Error('Bad username/password.'));
                const valid = await (0, bcrypt_1.compare)(password, results[0].password);
                if (!valid)
                    return reject(new Error('Bad username/password.'));
                resolve(results[0]);
            });
        });
    }
}
exports.MemberClass = MemberClass;
//# sourceMappingURL=Members.js.map