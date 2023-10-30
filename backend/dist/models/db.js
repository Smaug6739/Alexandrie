"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = require("mysql2");
function getConnection(host, user, password, db_name) {
    return (0, mysql2_1.createPool)({
        host: host,
        user: user,
        password: password,
        database: db_name,
    });
}
exports.default = getConnection;
//# sourceMappingURL=db.js.map