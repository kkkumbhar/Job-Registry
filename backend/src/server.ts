
import "dotenv/config";
import initDatabase from "./db/init";
import "./scheduler/sync.scheduler";
import "./scheduler/cleanup.scheduler";
import { runSync } from "./scheduler/sync.scheduler";
import app from "./app";

async function start() {
  await initDatabase();

  // Run sync on application start
  await runSync();
  
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
  });
}
start();
