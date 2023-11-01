module.exports = {
  apps: [
    {
      name: 'alexandrie-backend',
      cwd: './backend/dist',
      script: 'node main.js',
      env: {
        NODE_ENV: 'production',
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
