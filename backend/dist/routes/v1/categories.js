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
const CategoriesCtrl = __importStar(require("../../controllers/Categories"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const CategoriesRouter = (0, express_1.Router)();
// PUBLIC ROUTES
CategoriesRouter.get('/', CategoriesCtrl.getAll);
// PRIVATE ROUTES
CategoriesRouter.post('/main', auth_1.default, CategoriesCtrl.addMainCategory);
CategoriesRouter.post('/sub', auth_1.default, CategoriesCtrl.addSubCategory);
CategoriesRouter.patch('/main/:id', auth_1.default, CategoriesCtrl.updateMainCategory);
CategoriesRouter.patch('/sub/:id', auth_1.default, CategoriesCtrl.updateSubCategory);
CategoriesRouter.delete('/main/:id', auth_1.default, CategoriesCtrl.deleteMainCategory);
CategoriesRouter.delete('/sub/:id', auth_1.default, CategoriesCtrl.deleteSubCategory);
exports.infos = {
    route: 'categories',
    version: 1,
    router: CategoriesRouter,
};
