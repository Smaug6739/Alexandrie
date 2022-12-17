import { readdirSync } from 'fs';
import { join } from 'path';
import express from 'express';
import type { Request, Response } from 'express';

import { checkAndChange, error } from './utils/functions';
export class App {
  private app;
  public port: string;
  constructor() {
    this.app = express();
    this.port = process.env.DOCS_SERVER_PORT!;
    console.log(`Starting in ${process.env.NODE_ENV} mode...`);
  }
  private handleRoutes(): void {
    readdirSync(join(__dirname, 'routes')).forEach(dir => {
      const routes = readdirSync(join(__dirname, `routes/${dir}`)).filter(file => file.endsWith('.js'));
      for (const file of routes) {
        const getFileName = require(join(__dirname, `routes/${dir}/${file}`));
        this.app.use(`/api/v${getFileName.infos.version}/${getFileName.infos.route}`, getFileName.infos.router);
        console.log(`Loaded route : /api/v${getFileName.infos.version}/${getFileName.infos.route}`);
      }
    });
  }
  private handleMiddlewares(): void {
    this.app.use(express.urlencoded({ extended: true, limit: '5mb' }));
    this.app.use(express.json({ limit: '5mb' }));
    this.app.use(function (req: Request, res: Response, next: Function) {
      const origin = req.headers.origin;
      if (origin && process.env.CLIENT?.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
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
  public start(): void {
    this.handleMiddlewares();
    this.handleRoutes();
    this.app.use(async function (err: Error, _: Request, res: Response, __: Function) {
      console.log(err);

      if (err.message.match('File too large')) return res.status(500).json(error('[ERROR_FILE_SIZE] File is too large.'));
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
      res.status(404).json(checkAndChange(new Error('404 not found')));
    });
  }
}
