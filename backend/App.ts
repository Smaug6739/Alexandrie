import { readdirSync } from 'fs';
import { join } from 'path';
import express from 'express';
import { Pool } from 'mysql2';
import type { Request, Response } from 'express';

import db from './models/db';
import Logger from './utils/Logger';
import { checkAndChange } from './utils/functions';
import { Snowflake } from './utils/Snowflake';
import type { config } from './config';

export class App {
  private app;
  public port: string;
  public snowflake: Snowflake;
  public db: Pool;
  public config: typeof config;
  public logger: typeof Logger;

  constructor(c: typeof config) {
    Logger.debug(`Starting in ${process.env.NODE_ENV} mode...`);
    this.logger = Logger;
    this.config = c;
    this.app = express();
    this.port = process.env.PORT || '3000';
    this.snowflake = new Snowflake(1661327668261);
    this.db = db(
      process.env.DB_HOST,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      process.env.DB_NAME || 'alexandrie',
      parseInt(process.env.DB_PORT || '3306'),
    );
  }
  private async handleRoutes() {
    const directories = readdirSync(join(__dirname, 'routes'));
    for (const dir of directories) {
      const routes = readdirSync(join(__dirname, `routes/${dir}`)).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
      for (const file of routes) {
        const getFile = (await import(join(__dirname, `routes/${dir}/${file}`))).default;
        const fileInfos = getFile(this) as Iroute;
        this.app.use(`/api/v${fileInfos.version}/${fileInfos.route}`, fileInfos.router());
        Logger.info(`Loaded route:`, `/api/v${fileInfos.version}/${fileInfos.route}`);
      }
    }
  }
  private handleMiddlewares(): void {
    this.app.use(express.urlencoded({ extended: true, limit: `20mb` }));
    this.app.use(express.json({ limit: `20mb` }));
    this.app.set('trust proxy', true);
    this.app.use(function (req: Request, res: Response, next: Function) {
      const origin = req.headers.origin;
      if (!origin || ![process.env.DOMAIN_CLIENT, process.env.DOMAIN_DASHBOARD].includes(origin)) return next();
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
      );
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      next();
    });
    if (process.env.NODE_ENV !== 'production') {
      Logger.warn('Morgan is enabled in development mode.');
      const morgan = require('morgan')('dev');
      this.app.use(morgan);
    }
  }
  public async start() {
    this.handleMiddlewares();
    await this.handleRoutes();
    this.app.listen(this.port, () => {
      Logger.success(`Started on port ${this.port}`);
    });
    this.app.all('*', (_: Request, res: Response) => {
      res.status(404).json(checkAndChange(new Error('404 not found')));
    });
  }
}
