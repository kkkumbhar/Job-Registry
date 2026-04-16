
import cron from "node-cron";
import connectors from "../connectors";
import { upsertJobsBulk } from "../db/job.repository";

cron.schedule("*/* 5 * * *", async () => {
  console.log("Sync started");

  await Promise.all(
    connectors.map(async (c) => {
      try {
        const jobs = await c.fetchJobs();
        const normalized = jobs.map((j: unknown) => c.normalize(j as any));
        await upsertJobsBulk(normalized);
        console.log(c.name, "done");
      } catch (e:any) {
        console.error(c.name, e.message);
      }
    })
  );

  console.log("Sync done");
});
