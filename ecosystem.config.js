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
      script: 'serve -s dist -l 3100',
    },
  ],
};
