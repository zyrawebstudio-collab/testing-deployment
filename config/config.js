require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    dialectOptions:
      process.env.DB_SSL === "true"
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST || "postgres_test",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    dialectOptions:
      process.env.DB_SSL === "true"
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_PROD || "postgres_prod",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    dialectOptions:
      process.env.DB_SSL === "true"
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
  },
};
