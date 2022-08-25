"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const marked = require('marked');
const sharp = require('sharp');
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
sharp.cache(false);
class SubCategoriesClass {
    get(id) {
        return new Promise((resolve, reject) => {
            if (!id)
                return reject(new Error('[MISSING_ARGUMENT] Resource id must be provided'));
            db_1.default.query('SELECT * FROM articles WHERE id = ? LIMIT 1', [id], (err, result) => {
                if (err)
                    return reject(new Error(err.message));
                resolve(result[0]);
            });
        });
    }
    getAll(parent_category) {
        return new Promise((resolve, reject) => {
            db_1.default.query('SELECT * FROM sub_categories WHERE parent_category = ?', [parent_category], (err, result) => {
                if (err)
                    return reject(new Error(err.message));
                resolve(result);
            });
        });
    }
    add(name, category, description, content, author) {
        return new Promise((resolve, reject) => {
            if (!name)
                return reject(new Error('[MISSING_ARGUMENT] : name must be provided'));
            if (!category)
                return reject(new Error('[MISSING_ARGUMENT] : category must be provided'));
            if (!description)
                return reject(new Error('[MISSING_ARGUMENT] : description must be provided'));
            if (!content)
                return reject(new Error('[MISSING_ARGUMENT] : content must be provided'));
            if (!author)
                return reject(new Error('[MISSING_ARGUMENT] : author must be provided'));
            const time = Date.now();
            const contentHTML = marked(content);
            db_1.default.query('INSERT INTO articles (`id`, `category`, `name`, `description`, `content_html`, `content_markdown`, `created_timestamp`, `updated_timestamp`, `author_id`) VALUES(?,?,?,?,?,?, ?, ?, ?)', [idgen.generate(), category, name, description, contentHTML, content, time, time, author], err => {
                if (err)
                    return reject(new Error(err.message));
                else
                    resolve(true);
            });
        });
    }
    put(id, name, category, description, content, author) {
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
                    if (!category)
                        category = result[0].category;
                    if (!description)
                        description = result[0].description;
                    if (!content)
                        content = result[0].content;
                    if (!author)
                        content = result[0].author;
                    const contentHTML = marked(content);
                    db_1.default.query('UPDATE articles SET name=?, category=?, description=?, content=?, author=? WHERE id = ?', [name, category, description, contentHTML, author, id], (err, result) => {
                        if (err)
                            return reject(new Error(err.message));
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
exports.default = SubCategoriesClass;
