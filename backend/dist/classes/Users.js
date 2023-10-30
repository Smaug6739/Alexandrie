"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Base_1 = tslib_1.__importDefault(require("./Base"));
const bcrypt_1 = require("bcrypt");
class MemberClass extends Base_1.default {
    constructor(app) {
        super(app);
    }
    auth(username, password) {
        return new Promise((resolve, reject) => {
            if (!username || (username && username.trim() === ''))
                return reject('Username must be provided.');
            if (!password || (password && password.trim() === ''))
                return reject('Password must be provided.');
            this.app.db.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username], async (err, results) => {
                if (err)
                    return reject('Internal database error.');
                if (!results[0])
                    return reject('Bad username/password.');
                const valid = await (0, bcrypt_1.compare)(password, results[0].password);
                if (!valid)
                    return reject('Bad username/password.');
                resolve(results[0]);
            });
        });
    }
}
exports.default = MemberClass;
//# sourceMappingURL=Users.js.map