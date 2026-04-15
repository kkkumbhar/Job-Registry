
import cron from "node-cron";
import { deleteOldJobs } from "../db/job.repository";

cron.schedule("0 8 * * *", async () => {
  const count = await deleteOldJobs();
  console.log("Deleted", count);
});
