
import "dotenv/config";
import initDatabase from "./db/init";
import "./scheduler/sync.scheduler";
import "./scheduler/cleanup.scheduler";
import app from "./app";

async function start() {
  await initDatabase();
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
  });
}
start();
