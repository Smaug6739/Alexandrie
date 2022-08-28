import { Iconfig } from './types';

export const config: Iconfig = {
  port: 8082,
  database: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: '<db_name>',
  },
  domain: 'localhost',
  ALLOWED_DOMAINS: ['http://localhost:3000'],
  secret: '<random values>',
};
