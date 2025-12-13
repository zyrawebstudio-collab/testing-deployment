import { app } from "./app";
import { connectDB } from "./config/db.config";
import { sequelize } from "./config/db.config";
import { env } from "./config/env.config";

const PORT = env.port;

(async () => {
  await connectDB();
  await sequelize.sync();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();
