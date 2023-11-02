module.exports = {
  apps: [
    {
      name: 'alexandrie-backend',
      cwd: './backend/dist',
      script: 'node main.js',
      env: {
        NODE_ENV: 'production',
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
        DATABASE_USER: process.env.DATABASE_USERNAME,
        JWT_SECRET: process.env.JWT_SECRET,
        DOCS_SERVER_PORT: 8101,
        DOMAIN_CLIENT: 'https://alexandrie-hub.fr',
        DOMAIN_DASHBOARD: 'https://dashboard.alexandrie-hub.fr',
        FRONT_DOMAIN: 'alexandrie-hub.fr',
      },
    },
    {
      name: 'alexandrie-frontend',
      cwd: './frontend',
      script: 'PORT=8100 node .output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'alexandrie-dashboard',
      cwd: './dashboard',
      script: 'PORT=8102 node .output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
