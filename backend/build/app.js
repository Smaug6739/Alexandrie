"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path_1 = require("path");
const express_1 = tslib_1.__importDefault(require("express"));
const functions_1 = require("./utils/functions");
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
        this.app = (0, express_1.default)();
        this.port = process.env.DOCS_SERVER_PORT;
        console.log(`Starting in ${process.env.NODE_ENV} mode...`);
    }
    async handleRoutes() {
        var _a;
        const directories = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, 'routes'));
        for (const dir of directories) {
            const routes = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, `routes/${dir}`)).filter(file => file.endsWith('.js'));
            for (const file of routes) {
                const getFile = (await (_a = (0, path_1.join)(__dirname, `routes/${dir}/${file}`), Promise.resolve().then(() => tslib_1.__importStar(require(_a))))).default;
                const fileInfos = getFile(this);
                this.app.use(`/api/v${fileInfos.version}/${fileInfos.route}`, fileInfos.router());
                console.log(`Loaded route : /api/v${fileInfos.version}/${fileInfos.route}`);
            }
        }
    }
    handleMiddlewares() {
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '5mb' }));
        this.app.use(express_1.default.json({ limit: '5mb' }));
        this.app.use(function (req, res, next) {
            const origin = req.headers.origin;
            if (!origin)
                return next();
            if (process.env.DOMAIN_CLIENT === origin || process.env.DOMAIN_DASHBOARD === origin)
                res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            next();
        });
        if (process.env.NODE_ENV !== 'producRFtion') {
            const morgan = require('morgan')('dev');
            this.app.use(morgan);
        }
    }
    async start() {
        this.handleMiddlewares();
        await this.handleRoutes();
        this.app.use(async function (err, _, res, __) {
            if (err.message.match('File too large'))
                res.status(500).json((0, functions_1.error)('[ERROR_FILE_SIZE] File is too large.'));
            else
                console.error(err);
        });
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
        this.app.use('/static', express_1.default.static((0, path_1.join)(__dirname, '../public'), staticOptions));
        this.app.listen(this.port, () => {
            console.log(`Started on port ${this.port}`);
        });
        this.app.all('*', (req, res) => {
            console.log(req.path);
            res.status(404).json((0, functions_1.checkAndChange)(new Error('404 not found')));
        });
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map