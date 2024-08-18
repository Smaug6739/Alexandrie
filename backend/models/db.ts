import { createPool } from 'mysql2';

function getConnection(host?: string, user?: string, password?: string, db_name?: string, port?: number) {
  return createPool({
    host: host,
    user: user,
    password: password,
    database: db_name,
    port: port,
  });
}

export default getConnection;
