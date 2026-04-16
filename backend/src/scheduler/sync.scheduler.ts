
import cron from "node-cron";
import connectors from "../connectors";
import { upsertJobsBulk } from "../db/job.repository";

cron.schedule("*/5 * * * *", async () => { // Every 5 minute
  console.log("==== Sync started ====");

  await Promise.all(
    connectors.map(async (c) => {
      try {
        const jobs = await c.fetchJobs();
        const normalized = jobs.map((j: unknown) => c.normalizeData(j as any));
        await upsertJobsBulk(normalized);
        console.log(c.name, "done");
      } catch (e:any) {
        console.error(c.name, e.message);
      }
    })
  );

  console.log("==== Sync done ====");
});
