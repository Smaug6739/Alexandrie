"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
console.log((0, bcrypt_1.hashSync)('Password', 1));
