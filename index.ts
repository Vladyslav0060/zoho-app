import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { router } from "./src/bullmq/dashboard";
import { initQueue } from "./src/bullmq/queue";

dotenv.config();

export const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send(`Server works on port:${port}`);
});

app.use(express.static("src/files"));

initQueue();

app.use("/admin/queues", router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
