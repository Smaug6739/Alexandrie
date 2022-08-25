"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
//import * as express from 'express';
const express = require('express');
const functions_1 = require("./utils/functions");
class App {
    app;
    port;
    config;
    constructor(config) {
        this.app = express();
        this.port = config.port;
        this.config = config;
        console.log(`Starting in ${process.env.NODE_ENV} mode...`);
    }
    handleRoutes() {
        (0, fs_1.readdirSync)((0, path_1.join)(__dirname, 'routes')).forEach(dir => {
            const routes = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, `routes/${dir}`)).filter(file => file.endsWith('.js'));
            for (const file of routes) {
                const getFileName = require((0, path_1.join)(__dirname, `routes/${dir}/${file}`));
                this.app.use(`/api/v${getFileName.infos.version}/${getFileName.infos.route}`, getFileName.infos.router);
                console.log(`Route chargée : /api/v${getFileName.infos.version}/${getFileName.infos.route}`);
            }
        });
    }
    handleMiddlewares() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        const ALLOWED_DOMAINS = this.config.ALLOWED_DOMAINS;
        this.app.use(function (req, res, next) {
            const origin = req.headers.origin;
            if (ALLOWED_DOMAINS.includes(origin)) {
                res.setHeader('Access-Control-Allow-Origin', origin);
            }
            res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            next();
        });
        if (this.config.mode !== 'production') {
            const morgan = require('morgan')('dev');
            this.app.use(morgan);
        }
    }
    start() {
        this.handleMiddlewares();
        this.handleRoutes();
        this.app.use(async function (err, req, res, next) {
            if (err.message.match('File too large'))
                return res.json((0, functions_1.error)('[ERROR_FILE_SIZE] File is too large.'));
            else
                console.error(err);
        });
        const staticOptions = {
            dotfiles: 'ignore',
            etag: false,
            index: false,
            maxAge: '7d',
            redirect: false,
            setHeaders: function (res, path, stat) {
                res.set('x-timestamp', Date.now().toString());
            },
        };
        this.app.use('/static', express.static((0, path_1.join)(__dirname, '../public'), staticOptions));
        this.app.listen(this.port, () => {
            console.log(`Started on port ${this.port}`);
        });
        this.app.all('*', (req, res) => {
            res.status(404).json((0, functions_1.checkAndChange)(new Error('404 not found')));
        });
    }
}
exports.App = App;
