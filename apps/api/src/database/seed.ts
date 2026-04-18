import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { closeDatabasePool, dbPool, ensureDatabaseReady } from "./connection.js";
import { logger } from "../config/logger.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const seedsDirectory = path.join(currentDirectory, "seeds");

async function getSeedFiles(): Promise<string[]> {
  const files = await readdir(seedsDirectory);

  return files
    .filter((file) => file.endsWith(".sql"))
    .sort((left, right) => left.localeCompare(right));
}

async function runSeedFile(filename: string): Promise<void> {
  const filePath = path.join(seedsDirectory, filename);
  const sql = await readFile(filePath, "utf8");
  const client = await dbPool.connect();

  try {
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");
    logger.info(`Seed executed: ${filename}`);
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error(`Seed failed: ${filename}`, error);
    throw error;
  } finally {
    client.release();
  }
}

async function main(): Promise<void> {
  await ensureDatabaseReady();

  const seedFiles = await getSeedFiles();

  for (const file of seedFiles) {
    await runSeedFile(file);
  }

  logger.info("Database seeds completed");
}

main()
  .catch((error) => {
    logger.error("Database seed process failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDatabasePool();
  });
