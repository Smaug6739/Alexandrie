"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const marked = require('marked');
const Snowflake_1 = require("../utils/Snowflake");
const db_1 = __importDefault(require("../models/db"));
const idgen = new Snowflake_1.Snowflake(1661327668261);
marked.setOptions({
    renderer: new marked.Renderer(),
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
});
class Articles {
    getAll() {
        return new Promise((resolve, reject) => {
            db_1.default.query('SELECT * FROM articles', (err, result) => {
                if (err)
                    return reject(new Error(err.message));
                resolve(result);
            });
        });
    }
    getAllByCategory(category) {
        return new Promise((resolve, reject) => {
            if (!category)
                return reject(new Error('[MISSING_ARGUMENT] : category must be provided'));
            db_1.default.query('SELECT * FROM articles WHERE main_category = ?', [category], (err, result) => {
                if (err)
                    return reject(new Error(err.message));
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
            db_1.default.query('INSERT INTO articles (`id`, `main_category`, `sub_category`, `path`, `name`, `description`, `content_html`, `content_markdown`, `created_timestamp`, `updated_timestamp`, `author_id`) VALUES(?,?,?,?,?,?,?,?,?,?,?)', [id, main_category, sub_category, path, name, description, content_html, content_markdown, time, time, author], err => {
                if (err)
                    return reject(new Error(err.message));
                else
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
                        author_id: author.toString(),
                    });
            });
        });
    }
    put(id, name, main_category, sub_category, description, content_markdown, content_html) {
        return new Promise((resolve, reject) => {
            if (!id)
                return reject(new Error('[MISSING_ARGUMENT] : id must be provided'));
            db_1.default.query('SELECT * FROM articles WHERE id = ? LIMIT 1', [id], (err, result) => {
                if (err)
                    return reject(new Error(err.message));
                if (!result || !result.length)
                    return reject(new Error('[ERROR] : Invalid id'));
                else {
                    if (!name)
                        name = result[0].name;
                    if (!main_category)
                        main_category = result[0].main_category;
                    if (!sub_category)
                        sub_category = result[0].sub_category;
                    if (!description)
                        description = result[0].description;
                    if (!content_markdown)
                        content_markdown = result[0].content_markdown;
                    if (!content_html)
                        content_html = result[0].content_html;
                    db_1.default.query('UPDATE articles SET `name` = ?, `main_category` = ?, `sub_category` = ?, `description` = ?, `content_html` = ?, `content_markdown` = ?, `updated_timestamp` = ? WHERE `id` = ?', [name, main_category, sub_category, description, content_html, content_markdown, Date.now(), id], err => {
                        if (err)
                            return reject(new Error(err.message));
                        else
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
            db_1.default.query('DELETE FROM articles WHERE id = ?', [id], (err, r) => {
                if (err)
                    return reject(new Error(err.message));
                else
                    resolve(true);
            });
        });
    }
}
exports.default = Articles;
