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
        CPWD: './backend/',
        COOKIE_DOMAIN: 'alexandrie-hub.fr',
        GIN_MODE: 'release',
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
