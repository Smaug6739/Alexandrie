import { Iconfig } from './types';

export const config: Iconfig = {
  port: 8082,
  database: {
    host: 'localhost',
    database: 'docs',
  },
  domain: '192.168.0.25',
  ALLOWED_DOMAINS: ['http://localhost:5173', 'http://192.168.0.25:5173', 'http://192.168.0.25:3000'],
};
