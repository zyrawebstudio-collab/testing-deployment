import { Dialect, Sequelize } from "sequelize";
import { env } from "./env.config";

export const sequelize = new Sequelize({
  logging: false,
  dialect: "postgres" as Dialect,
  host: env.database.host,
  port: Number(env.database.port),
  username: env.database.username,
  password: env.database.password,
  database: env.database.dbName,
  dialectOptions: {
    ssl:
      env.database.dbSSl === "true"
        ? { require: true, rejectUnauthorized: false }
        : false,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
};
