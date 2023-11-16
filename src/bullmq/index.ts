import { Worker } from "bullmq";

const connection = {
  host: process.env.REDIS_HOST || "redis",
  port: 6379,
};

export const myWorker = new Worker("myqueue", async (job) => {}, {
  connection,
});
