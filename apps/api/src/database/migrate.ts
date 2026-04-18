import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { closeDatabasePool, dbPool, ensureDatabaseReady } from "./connection.js";
import { logger } from "../config/logger.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = path.join(currentDirectory, "migrations");

async function ensureMigrationTable(): Promise<void> {
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGSERIAL PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function getMigrationFiles(): Promise<string[]> {
  const files = await readdir(migrationsDirectory);

  return files
    .filter((file) => file.endsWith(".sql"))
    .sort((left, right) => left.localeCompare(right));
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const result = await dbPool.query<{ filename: string }>("SELECT filename FROM schema_migrations");
  return new Set(result.rows.map((row) => row.filename));
}

async function applyMigration(filename: string): Promise<void> {
  const filePath = path.join(migrationsDirectory, filename);
  const sql = await readFile(filePath, "utf8");
  const client = await dbPool.connect();

  try {
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [filename]);
    await client.query("COMMIT");
    logger.info(`Migration applied: ${filename}`);
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error(`Migration failed: ${filename}`, error);
    throw error;
  } finally {
    client.release();
  }
}

async function main(): Promise<void> {
  await ensureDatabaseReady();
  await ensureMigrationTable();

  const files = await getMigrationFiles();
  const appliedMigrations = await getAppliedMigrations();

  for (const file of files) {
    if (appliedMigrations.has(file)) {
      logger.info(`Migration skipped: ${file}`);
      continue;
    }

    await applyMigration(file);
  }

  logger.info("Database migrations completed");
}

main()
  .catch((error) => {
    logger.error("Database migration process failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDatabasePool();
  });
