"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Snowflake_1 = require("../utils/Snowflake");
const db_1 = tslib_1.__importDefault(require("../models/db"));
const idgen = new Snowflake_1.Snowflake(1661327668261);
class Articles {
    getAll() {
        return new Promise(async (resolve, reject) => {
            db_1.default.query('SELECT * FROM articles ORDER BY `name`', (err, result) => {
                if (err)
                    return reject('Internal database error.');
                resolve(result);
            });
        });
    }
    getAllByCategory(category) {
        return new Promise((resolve, reject) => {
            if (!category)
                return reject(new Error('[MISSING_ARGUMENT] : category must be provided'));
            db_1.default.query('SELECT * FROM articles WHERE main_category = ? ORDER BY `name`', [category], (err, result) => {
                if (err)
                    return reject('Internal database error.');
                resolve(result);
            });
        });
    }
    add(name, path, main_category, sub_category, description, content_markdown, content_html, author) {
        return new Promise((resolve, reject) => {
            if (!name)
                return reject(new Error('[MISSING_ARGUMENT] : name must be provided'));
            if (!main_category)
                return reject(new Error('[MISSING_ARGUMENT] : main_category must be provided'));
            if (!sub_category)
                return reject(new Error('[MISSING_ARGUMENT] : sub_category must be provided'));
            if (!description)
                return reject(new Error('[MISSING_ARGUMENT] : description must be provided'));
            if (!content_markdown)
                return reject(new Error('[MISSING_ARGUMENT] : content_markdown must be provided'));
            if (!content_html)
                return reject(new Error('[MISSING_ARGUMENT] : content_html must be provided'));
            if (!author)
                return reject(new Error('[MISSING_ARGUMENT] : author must be provided'));
            const time = Date.now();
            const id = idgen.generate().toString();
            db_1.default.query('INSERT INTO articles (`id`, `name`, `description`, `path`, `main_category`, `sub_category`, `content_html`, `content_markdown`, `created_timestamp`, `updated_timestamp`, `author_id`) VALUES(?,?,?,?,?,?,?,?,?,?,?)', [id, name, description, path, main_category, sub_category, content_html, content_markdown, time, time, author], err => {
                if (err)
                    return reject('Internal database error.');
                resolve({
                    id,
                    path,
                    name,
                    main_category,
                    sub_category,
                    description,
                    content_html,
                    content_markdown,
                    created_timestamp: time.toString(),
                    updated_timestamp: time.toString(),
                    author_id: author,
                });
            });
        });
    }
    put(id, name, description, path, main_category, sub_category, content_markdown, content_html) {
        return new Promise((resolve, reject) => {
            if (!id)
                return reject(new Error('[MISSING_ARGUMENT] : id must be provided'));
            db_1.default.query('SELECT * FROM articles WHERE id = ? LIMIT 1', [id], (err, result) => {
                if (err)
                    return reject('Internal database error.');
                if (!result || !result[0])
                    return reject(new Error('[ERROR] : Invalid id'));
                else {
                    if (!name)
                        name = result[0].name;
                    if (!description)
                        description = result[0].description;
                    if (!path)
                        path = result[0].path;
                    if (!main_category)
                        main_category = result[0].main_category;
                    if (!sub_category)
                        sub_category = result[0].sub_category;
                    if (!content_markdown)
                        content_markdown = result[0].content_markdown;
                    if (!content_html)
                        content_html = result[0].content_html;
                    db_1.default.query('UPDATE articles SET `name` = ?, `description` = ?, `path` = ?, `main_category` = ?, `sub_category` = ?, `content_html` = ?, `content_markdown` = ?, `updated_timestamp` = ? WHERE `id` = ?', [name, description, path, main_category, sub_category, content_html, content_markdown, Date.now(), id], err => {
                        if (err)
                            return reject('Internal database error.');
                        resolve(true);
                    });
                }
            });
        });
    }
    delete(id) {
        return new Promise((resolve, reject) => {
            if (!id)
                return reject(new Error('[MISSING_ARGUMENT] : id must be provided'));
            db_1.default.query('DELETE FROM articles WHERE id = ?', [id], err => {
                if (err)
                    return reject('Internal database error.');
                resolve(true);
            });
        });
    }
}
exports.default = Articles;
//# sourceMappingURL=Articles.js.map