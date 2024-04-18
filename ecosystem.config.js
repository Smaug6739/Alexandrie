module.exports = {
  apps: [
    {
      name: "alexandrie-backend",
      cwd: "./backend/dist",
      script: "bun main.js",
      env: {
        NODE_ENV: "production",
        PORT: 8201,
        DOMAIN_CLIENT: "https://alexandrie-hub.fr",
        //DOMAIN_DASHBOARD: "https://dashboard.alexandrie-hub.fr",
        FRONT_DOMAIN: "alexandrie-hub.fr",
      },
    },
    {
      name: "alexandrie-frontend",
      cwd: "./frontend",
      script: "bun .output/server/index.mjs",
      env: {
        NODE_ENV: "production",
        PORT: 8200,
      },
    },
    /*{
      name: "alexandrie-dashboard",
      cwd: "./dashboard",
      script: "bun .output/server/index.mjs",
      env: {
        NODE_ENV: "production",
        PORT: 8202,
      },
    },*/
  ],
};
