import { createPool } from 'mysql2';

const pool = createPool({
  host: 'localhost',
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: 'docs',
});

pool.on('connection', function (conn) {
  console.log('Connection %d acquired', conn.threadId);
  conn.on('error', (err: any) => {
    console.log(err);
  });
});

export default pool;
