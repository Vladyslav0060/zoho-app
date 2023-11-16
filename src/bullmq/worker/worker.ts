import { Worker } from "bullmq";
import { zohoQueue } from "../queue";
import { refreshZohoToken } from "../../utils/axios";
import { jobs } from "../jobs";

const worker = new Worker(
  "zohoQueue",
  async (job) => {
    switch (job.name) {
      case "start": {
        await refreshZohoToken();
        await zohoQueue.addBulk(
          Object.keys(jobs).map((name) => ({
            name,
            data: null,
            opts: undefined,
          }))
        );
        break;
      }
      default: {
        await jobs[job.name]();
        break;
      }
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "redis",
      port: 6379,
    },
  }
);

export { worker };
