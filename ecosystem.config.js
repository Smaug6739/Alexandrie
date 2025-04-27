module.exports = {
  apps: [
    {
      name: 'alexandrie-backend',
      script: './backend_app',
      cwd: './backend',
      env: {
        PORT: 8201,
        DOMAIN_CLIENT: 'https://alexandrie-hub.fr',
        MINIO_ENDPOINT: 'localhost:9000',
        MINIO_BUCKET: 'alexandrie',
      },
    },
    {
      name: 'alexandrie-frontend',
      cwd: './frontend',
      script: 'bun .output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
        PORT: 8200,
      },
    },
  ],
};
