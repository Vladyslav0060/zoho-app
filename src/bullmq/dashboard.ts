const { createBullBoard } = require("bull-board");
const { BullMQAdapter } = require("bull-board/bullMQAdapter");
import { zohoQueue } from "./queue";

const { router } = createBullBoard([new BullMQAdapter(zohoQueue)]);

export { router };
