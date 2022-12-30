"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const app_1 = require("./app");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({
    path: (0, path_1.resolve)(__dirname, '../.env'),
});
const server = new app_1.App();
server.start();
//# sourceMappingURL=main.js.map