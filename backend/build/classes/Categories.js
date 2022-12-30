"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Snowflake_1 = require("../utils/Snowflake");
const db_1 = tslib_1.__importDefault(require("../models/db"));
const idgen = new Snowflake_1.Snowflake(1661327668261);
class CategoriesClass {
    getAll() {
        return new Promise((resolve, reject) => {
            db_1.default.query('SELECT * FROM main_categories ORDER BY `order`', [], (err, themes) => {
                if (err)
                    return reject('Internal database error.');
                db_1.default.query('SELECT * FROM sub_categories ORDER BY `order`', [], (err, categories) => {
                    if (err)
                        return reject('Internal database error.');
                    for (const theme of themes) {
                        theme.categories = categories.filter((c) => c.parent_category === theme.path);
                    }
                    resolve(themes);
                });
            });
        });
    }
    addMainCategory(name, description, order, path, icon) {
        return new Promise((resolve, reject) => {
            const id = idgen.generate().toString();
            if (!name)
                return reject(new Error('[MISSING_ARGUMENT] : name must be provided'));
            if (!description)
                return reject(new Error('[MISSING_ARGUMENT] : description must be provided'));
            if (!path)
                return reject(new Error('[MISSING_ARGUMENT] : path must be provided'));
            db_1.default.query('INSERT INTO main_categories (id, name, description, `order`, path, icon) VALUES (?, ?, ?, ?, ?, ?)', [id, name, description, order, path, icon], err => {
                if (err)
                    return reject('Internal database error.');
                else
                    resolve({
                        id,
                        name,
                        description,
                        order,
                        path,
                        icon,
                    });
            });
        });
    }
    addSubCategory(name, description, order, path, icon, parent_category) {
        return new Promise((resolve, reject) => {
            if (!name)
                return reject(new Error('[MISSING_ARGUMENT] : name must be provided'));
            if (!description)
                return reject(new Error('[MISSING_ARGUMENT] : description must be provided'));
            if (!path)
                return reject(new Error('[MISSING_ARGUMENT] : path must be provided'));
            if (!parent_category)
                return reject(new Error('[MISSING_ARGUMENT] : parent_category must be provided'));
            const id = idgen.generate();
            db_1.default.query('INSERT INTO sub_categories (id, name, description, `order`, path, icon, parent_category) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, name, description, order, path, icon, parent_category], err => {
                if (err)
                    return reject('Internal database error.');
                else
                    resolve({
                        id,
                        name,
                        description,
                        order,
                        path,
                        icon,
                        parent_category,
                    });
            });
        });
    }
    updateMainCategory(id, name, description, order, path, icon) {
        return new Promise((resolve, reject) => {
            if (!id)
                return reject(new Error('[MISSING_ARGUMENT] : id must be provided'));
            db_1.default.query('SELECT * FROM main_categories WHERE id = ? LIMIT 1', [id], (err, result) => {
                if (err)
                    return reject('Internal database error.');
                if (!result || !result[0])
                    return reject(new Error('[ERROR] : Invalid id'));
                else {
                    if (!name)
                        name = result[0].name;
                    if (!description)
                        description = result[0].description;
                    if (!order)
                        order = result[0].order;
                    if (!path)
                        path = result[0].path;
                    if (!icon)
                        icon = result[0].icon;
                    db_1.default.query('UPDATE main_categories SET name = ?, description = ?, `order` = ?, path = ?, icon = ? WHERE id = ?', [name, description, order, path, icon, id], err => {
                        if (err)
                            return reject('Internal database error.');
                        else
                            resolve(true);
                    });
                }
            });
        });
    }
    updateSubCategory(id, name, description, order, path, icon, parent_category) {
        return new Promise((resolve, reject) => {
            if (!id)
                return reject(new Error('[MISSING_ARGUMENT] : id must be provided'));
            db_1.default.query('SELECT * FROM sub_categories WHERE id = ? LIMIT 1', [id], (err, result) => {
                if (err)
                    return reject('Internal database error.');
                if (!result || !result[0])
                    return reject(new Error('[ERROR] : Invalid id'));
                else {
                    if (!name)
                        name = result[0].name;
                    if (!description)
                        description = result[0].description;
                    if (!order)
                        order = result[0].order;
                    if (!path)
                        path = result[0].path;
                    if (!icon)
                        icon = result[0].icon;
                    if (!parent_category)
                        parent_category = result[0].parent_category;
                    db_1.default.query('UPDATE sub_categories SET name = ?, description = ?, `order` = ?, path = ?, icon = ?, parent_category = ? WHERE id = ?', [name, description, order, path, icon, parent_category, id], err => {
                        if (err)
                            return reject('Internal database error.');
                        else
                            resolve(true);
                    });
                }
            });
        });
    }
    deleteMainCategory(id) {
        return new Promise((resolve, reject) => {
            if (!id)
                return reject(new Error('[MISSING_ARGUMENT] : id must be provided'));
            db_1.default.query('DELETE FROM main_categories WHERE id = ?', [id], err => {
                if (err)
                    return reject('Internal database error.');
                else
                    resolve(true);
            });
        });
    }
    deleteSubCategory(id) {
        return new Promise((resolve, reject) => {
            if (!id)
                return reject(new Error('[MISSING_ARGUMENT] : id must be provided'));
            db_1.default.query('DELETE FROM sub_categories WHERE id = ?', [id], err => {
                if (err)
                    return reject('Internal database error.');
                else
                    resolve(true);
            });
        });
    }
}
exports.default = CategoriesClass;
//# sourceMappingURL=Categories.js.map