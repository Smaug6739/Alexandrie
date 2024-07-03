import { resolve } from 'path';
import { config as constants } from './config';
import { App } from './app';
import { config } from 'dotenv';

config({
  path: resolve(__dirname, '../.env'),
});

const server: App = new App(constants);
server.start();

export default server;
