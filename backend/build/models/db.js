"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = require("mysql2");
const pool = (0, mysql2_1.createPool)({
    host: 'localhost',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: 'docs',
});
pool.on('connection', function (conn) {
    console.log('Connection %d acquired', conn.threadId);
    conn.on('error', (err) => {
        console.log(err);
    });
});
exports.default = pool;
//# sourceMappingURL=db.js.map