
import cron from "node-cron";
import { deleteOldJobs } from "../db/job.repository";

cron.schedule("0 1 * * * *", async () => { // Every day at 1:00 AM
  const count = await deleteOldJobs();
  console.log("Deleted", count);
});
