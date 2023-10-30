"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path_1 = require("path");
const express_1 = tslib_1.__importDefault(require("express"));
const db_1 = tslib_1.__importDefault(require("./models/db"));
const Logger_1 = tslib_1.__importDefault(require("./utils/Logger"));
const functions_1 = require("./utils/functions");
const Snowflake_1 = require("./utils/Snowflake");
class App {
    constructor() {
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "port", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "snowflake", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Logger_1.default.debug(`Starting in ${process.env.NODE_ENV} mode...`);
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3000';
        this.snowflake = new Snowflake_1.Snowflake(1661327668261);
        this.db = (0, db_1.default)('localhost', process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, 'alexandrie');
    }
    async handleRoutes() {
        const directories = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, 'routes'));
        for (const dir of directories) {
            const routes = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, `routes/${dir}`)).filter(file => file.endsWith('.js'));
            for (const file of routes) {
                const getFile = (await Promise.resolve(`${(0, path_1.join)(__dirname, `routes/${dir}/${file}`)}`).then(s => tslib_1.__importStar(require(s)))).default;
                const fileInfos = getFile(this);
                this.app.use(`/api/v${fileInfos.version}/${fileInfos.route}`, fileInfos.router());
                Logger_1.default.info(`Loaded route:`, `/api/v${fileInfos.version}/${fileInfos.route}`);
            }
        }
    }
    handleMiddlewares() {
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '5mb' }));
        this.app.use(express_1.default.json({ limit: '5mb' }));
        this.app.use(function (req, res, next) {
            const origin = req.headers.origin;
            if (!origin || process.env.DOMAIN_CLIENT !== origin)
                return next();
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            next();
        });
        if (process.env.NODE_ENV !== 'production') {
            Logger_1.default.warn('Morgan is enabled in development mode.');
            const morgan = require('morgan')('dev');
            this.app.use(morgan);
        }
    }
    async start() {
        this.handleMiddlewares();
        await this.handleRoutes();
        const staticOptions = {
            dotfiles: 'ignore',
            etag: false,
            index: false,
            maxAge: '7d',
            redirect: false,
            setHeaders: function (res) {
                res.set('x-timestamp', Date.now().toString());
            },
        };
        this.app.use('/static', express_1.default.static((0, path_1.join)(__dirname, '../uploads'), staticOptions));
        this.app.listen(this.port, () => {
            Logger_1.default.success(`Started on port ${this.port}`);
        });
        this.app.all('*', (_, res) => {
            res.status(404).json((0, functions_1.checkAndChange)(new Error('404 not found')));
        });
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map