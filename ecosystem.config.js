module.exports = {
  apps: [
    {
      name: "alexandrie-backend",
      cwd: "./backend/dist",
      script: "main.js",
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
      script: ".output/server/index.mjs",
      env: {
        NODE_ENV: "production",
        PORT: 8200,
      },
    },
    {
      name: "alexandrie-dashboard",
      cwd: "./dashboard",
      interpreter: "~/.bun/bin/bun",
      script: ".output/server/index.mjs",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
