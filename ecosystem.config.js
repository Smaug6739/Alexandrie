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
      script: 'PORT=8100 node .output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'docs-wbs-dashboard',
      cwd: './dashboard',
      script: 'PORT=8102 node .output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
