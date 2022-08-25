import { Iconfig } from "./types";

export const config: Iconfig = {
  port: 8082,
  production: false,
  database: {
    host: "localhost",
    user: "root",
    password: "",
    database: "<db_name>",
  },
  domain: "localhost",
  mode: "development",
  ALLOWED_DOMAINS: ["http://localhost:3000"],
  secret: "<random values>",
};
