module.exports = {
  apps: [
    {
      name: "alexandrie-backend",
      cwd: "./backend/dist",
      script: "node main.js",
      interpreter: "~/.bun/bin/bun",
      env: {
        NODE_ENV: "production",
        PORT: 8201,
        DOMAIN_CLIENT: "https://alexandrie-hub.fr",
        DOMAIN_DASHBOARD: "https://dashboard.alexandrie-hub.fr",
        FRONT_DOMAIN: "alexandrie-hub.fr",
      },
    },
    {
      name: "alexandrie-frontend",
      cwd: "./frontend",
      interpreter: "~/.bun/bin/bun",
      script: "PORT=8200 node .output/server/index.mjs",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "alexandrie-dashboard",
      cwd: "./dashboard",
      interpreter: "~/.bun/bin/bun",
      script: "PORT=8202 node .output/server/index.mjs",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
