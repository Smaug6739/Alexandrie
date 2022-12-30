"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
};
//# sourceMappingURL=headers.js.map