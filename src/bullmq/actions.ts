import { refreshZohoToken } from "../utils/axios";
import { zohoQueue } from "./queue";
import { jobs } from "./jobs";
import { worker } from "./worker/worker";

// worker.on("ready", () => console.log("worker ready"));

class ZohoQueueActions {
  start = async () => {
    console.log("start");
    await refreshZohoToken();
    await zohoQueue.addBulk(
      Object.keys(jobs).map((name) => ({
        name,
        data: null,
        opts: undefined,
      }))
    );
    console.log("start end");
    return true;
  };
  update_file = async () => {};
}

export default new ZohoQueueActions();
