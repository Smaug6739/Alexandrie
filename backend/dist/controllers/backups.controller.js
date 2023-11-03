"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const functions_1 = require("../utils/functions");
class CategoriesController {
    constructor(app) {
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.app = app;
    }
    async add(_, res) {
        // Clean the uploads directory
        const files = (0, fs_1.readdirSync)(this.app.uploads_dir + '/backups');
        for (const file of files) {
            if (file.endsWith('.sql'))
                (0, fs_1.unlinkSync)(`${this.app.uploads_dir}/backups/${file}`);
        }
        const name = `backup-${new Date().toISOString().split('T')[0]}-${Date.now()}`;
        const mysqldump = (0, child_process_1.spawn)('mysqldump', [
            '-u',
            `${process.env.DATABASE_USER}`,
            `-p${process.env.DATABASE_PASSWORD}`,
            'alexandrie',
        ]);
        const wstream = (0, fs_1.createWriteStream)(`${this.app.uploads_dir}/backups/${name}.sql`);
        const backupPromise = new Promise((resolve, reject) => {
            mysqldump.stdout
                .pipe(wstream)
                .on('finish', function () {
                resolve();
            })
                .on('error', function (err) {
                reject(err.message);
            });
        });
        backupPromise
            .then(() => res.json((0, functions_1.success)({ url: `/backups/${name}.sql` })))
            .catch((err) => res.json((0, functions_1.error)(err.message)));
    }
}
exports.default = CategoriesController;
//# sourceMappingURL=backups.controller.js.map