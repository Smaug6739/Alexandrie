// Production env
module.exports = {
  apps: [
    {
      name: 'docs-wbs-backend',
      cwd: './backend/dist',
      script: 'node main.js',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'docs-wbs-frontend',
      cwd: './frontend',
      script: 'PORT=3100 node .output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'docs-wbs-dashboard',
      cwd: './dashboard',
      script: 'PORT=3101 node .output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
