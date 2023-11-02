"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Base_1 = tslib_1.__importDefault(require("./Base"));
class DocumentsManager extends Base_1.default {
    constructor(app) {
        super(app);
    }
    getAll(all) {
        // If all is true, return all documents, else return only public documents (accessibility = 1)
        return new Promise((resolve, reject) => {
            this.app.db.query(`SELECT * FROM documents ${all == 'true' ? '' : 'WHERE `accessibility` = 1'} ORDER BY \`name\``, (err, result) => {
                if (err)
                    return reject('Internal database error.');
                resolve(result);
            });
        });
    }
    getAllByCategory(category) {
        return new Promise((resolve, reject) => {
            if (!category)
                return reject(new Error('[MISSING_KEY] : category must be provided'));
            this.app.db.query('SELECT * FROM documents WHERE category = ? AND `accessibility` = 1 ORDER BY `name`', [category], (err, result) => {
                if (err)
                    return reject('Internal database error.');
                resolve(result);
            });
        });
    }
    get(id) {
        return new Promise((resolve, reject) => {
            if (!id)
                return reject(new Error('[MISSING_KEY] : id must be provided'));
            this.app.db.query('SELECT * FROM documents WHERE id = ?', [id], (err, result) => {
                if (err)
                    return reject('Internal database error.');
                if (!result[0])
                    return reject('Document not found.');
                resolve(result[0]);
            });
        });
    }
    add(data) {
        return new Promise((resolve, reject) => {
            const time = Date.now().toString();
            const id = this.app.snowflake.generate().toString();
            if (!data.name)
                return reject(new Error('[MISSING_KEY] : name must be provided'));
            if (!data.accessibility && data.accessibility != 0)
                return reject(new Error('[MISSING_KEY] : accessibility must be provided'));
            if (!data.author_id)
                return reject(new Error('[MISSING_KEY] : author_id must be provided'));
            this.app.db.query('INSERT INTO documents (`id`, `name`, `description`, `tags`, `category`, `accessibility`, `content_markdown`, `content_html`, `author_id`, `created_timestamp`, `updated_timestamp`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                id,
                data.name,
                data.description,
                data.tags,
                data.category,
                data.accessibility,
                data.content_markdown,
                data.content_html,
                data.author_id,
                time,
                time,
            ], err => {
                if (err)
                    return reject('Internal database error.');
                resolve({ id, ...data, created_timestamp: time, updated_timestamp: time });
            });
        });
    }
    put(id, data) {
        return new Promise((resolve, reject) => {
            if (!id)
                return reject(new Error('[MISSING_KEY] : id must be provided'));
            if (!data.name)
                return reject(new Error('[MISSING_KEY] : name must be provided'));
            if (!data.accessibility && data.accessibility != 0)
                return reject(new Error('[MISSING_KEY] : accessibility must be provided'));
            if (!data.author_id)
                return reject(new Error('[MISSING_KEY] : author_id must be provided'));
            const time = Date.now().toString();
            this.app.db.query('UPDATE documents SET name = ?, description = ?, tags = ?, category = ?, accessibility = ?, content_markdown = ?, content_html = ?, updated_timestamp = ? WHERE id = ?', [
                data.name,
                data.description,
                data.tags,
                data.category,
                data.accessibility,
                data.content_markdown,
                data.content_html,
                time,
                id,
            ], err => {
                if (err)
                    return reject('Internal database error.');
                resolve({ id, ...data, updated_timestamp: time });
            });
        });
    }
    delete(id) {
        return new Promise((resolve, reject) => {
            if (!id)
                return reject(new Error('[MISSING_KEY] : id must be provided'));
            this.app.db.query('DELETE FROM documents WHERE id = ?', [id], err => {
                if (err)
                    return reject('Internal database error.');
                resolve(true);
            });
        });
    }
}
exports.default = DocumentsManager;
//# sourceMappingURL=DocumentsManager.js.map