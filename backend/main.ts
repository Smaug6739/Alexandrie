import { resolve } from 'path';

import { App } from './app';
import { config } from 'dotenv';

config({
  path: resolve(__dirname, '../.env'),
});

console.log(process.env)

const server: App = new App();
server.start();
