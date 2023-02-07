import { readdirSync } from 'fs';
import { join } from 'path';
import express from 'express';
import { Pool } from 'mysql2';
import type { Request, Response } from 'express';

import type { Iroute } from '@types';

import db from './models/db';
import { checkAndChange, error } from './utils/functions';
import { Snowflake } from 'utils/Snowflake';

export class App {
  private app;
  public port: string;
  public snowflake: Snowflake;
  public db: Pool;
  constructor() {
    console.log(`Starting in ${process.env.NODE_ENV} mode...`);
    this.app = express();
    this.port = process.env.DOCS_SERVER_PORT || '3000';
    this.snowflake = new Snowflake(1661327668261);
    this.db = db;
  }
  private async handleRoutes() {
    const directories = readdirSync(join(__dirname, 'routes'));
    for (const dir of directories) {
      const routes = readdirSync(join(__dirname, `routes/${dir}`)).filter(file => file.endsWith('.js'));
      for (const file of routes) {
        const getFile = (await import(join(__dirname, `routes/${dir}/${file}`))).default;
        const fileInfos = getFile(this) as Iroute;
        this.app.use(`/api/v${fileInfos.version}/${fileInfos.route}`, fileInfos.router());
        console.log(`Loaded route : /api/v${fileInfos.version}/${fileInfos.route}`);
      }
    }
  }
  private handleMiddlewares(): void {
    this.app.use(express.urlencoded({ extended: true, limit: '5mb' }));
    this.app.use(express.json({ limit: '5mb' }));
    this.app.use(function (req: Request, res: Response, next: Function) {
      const origin = req.headers.origin;
      if (!origin) return next();
      if (process.env.DOMAIN_CLIENT === origin || process.env.DOMAIN_DASHBOARD === origin)
        res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
      );
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      next();
    });
    if (process.env.NODE_ENV !== 'producRFtion') {
      const morgan = require('morgan')('dev');
      this.app.use(morgan);
    }
  }
  public async start() {
    this.handleMiddlewares();
    await this.handleRoutes();
    this.app.use(async function (err: Error, _: Request, res: Response, __: Function) {
      if (err.message.match('File too large')) res.status(500).json(error('[ERROR_FILE_SIZE] File is too large.'));
      else console.error(err);
    });

    const staticOptions = {
      dotfiles: 'ignore',
      etag: false,
      index: false,
      maxAge: '7d',
      redirect: false,
      setHeaders: function (res: Response) {
        res.set('x-timestamp', Date.now().toString());
      },
    };
    this.app.use('/static', express.static(join(__dirname, '../public'), staticOptions));

    this.app.listen(this.port, () => {
      console.log(`Started on port ${this.port}`);
    });
    this.app.all('*', (req: Request, res: Response) => {
      console.log(req.path);

      res.status(404).json(checkAndChange(new Error('404 not found')));
    });
  }
}
