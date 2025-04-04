import express from "express";
import taskRouter from "./routes/task.routes";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.use(express.json());
app.use("/api/tasks", taskRouter);
app.use(errorHandler);

export default app;
