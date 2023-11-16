import { Queue } from "bullmq";
import { worker } from "../worker/worker";
import dotenv from "dotenv";
dotenv.config();

worker.on("ready", () => console.log("worker ready"));

const zohoQueue = new Queue("zohoQueue", {
  connection: {
    host: process.env.REDIS_HOST || "redis",
    port: 6379,
  },
  defaultJobOptions: {
    attempts: 10,
    backoff: {
      type: "fixed",
      delay: 700,
    },
  },
});

const scheduleConfig =
  process.env.NODE_ENV === "production" ? 60 * 1000 * 60 : null;

const initQueue = () => {
  if (scheduleConfig !== null) {
    zohoQueue.add("start", null, {
      repeat: {
        every: scheduleConfig,
      },
    });
  } else {
    zohoQueue.add("start", null);
  }
};

export { zohoQueue, initQueue };
