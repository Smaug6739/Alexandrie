"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.infos = void 0;
const express_1 = require("express");
const CategoriesCtrl = __importStar(require("../../controllers/main_categories"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const ArticlesRouter = (0, express_1.Router)();
ArticlesRouter.get('/', CategoriesCtrl.getAll);
ArticlesRouter.get('/:articleId', CategoriesCtrl.getResource);
ArticlesRouter.post('/', auth_1.default, CategoriesCtrl.add);
ArticlesRouter.patch('/:articleId', auth_1.default, CategoriesCtrl.update);
ArticlesRouter.delete('/:articleId', auth_1.default, CategoriesCtrl.deleteResource);
exports.infos = {
    route: 'main_categories',
    version: 1,
    router: ArticlesRouter,
};
