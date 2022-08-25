import { join } from 'path';

import { App } from './app';
import { config } from './config';
import * as dotenv from 'dotenv';

dotenv.config({
	path: join(__dirname, '../.env')
});

const server: App = new App(config)
server.start();
