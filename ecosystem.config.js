module.exports = {
  apps: [
    {
      name: 'alexandrie-backend',
      script: './al_backend',
      env: {
        PORT: 8201,
        DOMAIN_CLIENT: 'https://alexandrie-hub.fr',
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
    {
      name: 'alexandrie-minio',
      cwd: '',
      script: 'minio server ./minio --console-address :9001 --address "localhost:9000"',
    },
  ],
};
