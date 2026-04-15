
import { Client } from "pg";

export default async function initDatabase() {
  const dbName = process.env.DB_NAME || "job_registry";

  const baseConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
  };

  const admin = new Client({ ...baseConfig, database: "postgres" });
  await admin.connect();

  const exists = await admin.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [dbName]
  );

  if (!exists.rowCount) {
    console.log("Creating DB...");
    await admin.query(`CREATE DATABASE ${dbName}`);
  }

  await admin.end();

  const app = new Client({ ...baseConfig, database: dbName });
  await app.connect();

  await app.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  await app.query(`
    CREATE TABLE IF NOT EXISTS jobs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      external_id TEXT NOT NULL,
      source TEXT NOT NULL,
      name TEXT,
      status TEXT,
      metadata JSONB,
      started_at TIMESTAMP,
      finished_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (external_id, source)
    )
  `);

  await app.query(`
    CREATE INDEX IF NOT EXISTS idx_jobs_started_at ON jobs(started_at)
  `);

  await app.end();

  console.log("DB ready");
}
