import express from "express";
import cors from "cors";
import contactRouter from "./routes/contact.routes";
import { errorHandler } from "./middlewares/error-handler.middleware";

export const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "Healthy" }).end();
});

app.use("/api", contactRouter);

app.use((_, res) => {
  res.status(404).json({ error: "Route not found" }).end();
});

app.use(errorHandler);
