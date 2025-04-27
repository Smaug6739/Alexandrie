module.exports = {
  apps: [
    {
      name: 'alexandrie-minio',
      cwd: '',
      script: 'minio server ./minio --address "localhost:9000"',
    },
    {
      name: 'alexandrie-backend',
      script: './al_backend',
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
