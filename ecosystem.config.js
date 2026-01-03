module.exports = {
  apps: [
    {
      name: 'alexandrie-backend',
      script: './backend_app',
      cwd: './backend',
      env: {
        PORT: 8201,
        FRONTEND_URL: 'https://alexandrie-hub.fr',
        COOKIE_DOMAIN: 'alexandrie-hub.fr',

        MINIO_ENDPOINT: 'cdn.alexandrie-hub.fr',
        MINIO_PUBLIC_URL: 'https://cdn.alexandrie-hub.fr',
        MINIO_BUCKET: 'alexandrie',
        MINIO_SECURE: 'true',

        DATABASE_HOST: 'localhost',
        DATABASE_PORT: 3306,
        DATABASE_NAME: 'alexandrie',

        CPWD: './backend/',
        CONFIG_CPWD: '',
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
