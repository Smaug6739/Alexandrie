module.exports = {
  apps: [
    {
      name: "alexandrie-backend",
      cwd: "./backend/dist",
      script: "--interpreter ~/.bun/bin/bun main.js",
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
      script: "--interpreter ~/.bun/bin/bun .output/server/index.mjs",
      env: {
        NODE_ENV: "production",
        PORT: 8200,
      },
    },
    {
      name: "alexandrie-dashboard",
      cwd: "./dashboard",
      script: "--interpreter ~/.bun/bin/bun .output/server/index.mjs",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
