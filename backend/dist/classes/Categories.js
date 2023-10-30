"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Base_1 = tslib_1.__importDefault(require("./Base"));
class CategoriesDB extends Base_1.default {
    constructor(app) {
        super(app);
    }
    getAll() {
        return new Promise((resolve, reject) => {
            this.app.db.query('SELECT * FROM `categories` ORDER BY `order`', [], (err, themes) => {
                if (err)
                    return reject('Internal database error.');
                resolve(themes);
            });
        });
    }
    add(data) {
        return new Promise((resolve, reject) => {
            const id = this.app.snowflake.generate().toString();
            if (!data.name)
                return reject(new Error('[MISSING_KEY] : name must be provided'));
            this.app.db.query('INSERT INTO categories (`id`, `name`,`icon`, `order`, `parent_id`) VALUES (?, ?, ?, ?, ?)', [id, data.name, data.icon, data.order, data.parent_id], err => {
                if (err)
                    return reject('Internal database error.');
                else
                    resolve({ id, ...data });
            });
        });
    }
    update(data) {
        return new Promise((resolve, reject) => {
            if (!data.id)
                return reject(new Error('[MISSING_KEY] : id must be provided'));
            if (!data.name)
                return reject(new Error('[MISSING_KEY] : name must be provided'));
            this.app.db.query('UPDATE categories SET name = ?, icon = ?, `order` = ?, parent_id = ? WHERE id = ?', [data.name, data.icon, data.order, data.parent_id, data.id], err => {
                if (err)
                    return reject('Internal database error.');
                else
                    resolve(data);
            });
        });
    }
    delete(id) {
        return new Promise((resolve, reject) => {
            if (!id)
                return reject(new Error('[MISSING_KEY] : id must be provided'));
            this.app.db.query('DELETE FROM categories WHERE id = ?', [id], err => {
                if (err)
                    return reject('Internal database error.');
                else
                    resolve(true);
            });
        });
    }
}
exports.default = CategoriesDB;
//# sourceMappingURL=Categories.js.map