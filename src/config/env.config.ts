import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT ?? 4000,
  environment: process.env.NODE_ENV ?? "development",
  database: {
    host: process.env.DB_HOST ?? "localhost",
    port: process.env.DB_PORT ?? 5432,
    username: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD ?? "postgres",
    dbName: process.env.DB_NAME ?? "testing-deployment",
    timezone: process.env.DB_TIMEZONE ?? "UTC",
    dbSSl: process.env.DB_SSL ?? false,
  },
};
