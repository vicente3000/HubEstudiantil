import { closeDatabasePool, ensureDatabaseReady } from "./connection.js";
import { logger } from "../config/logger.js";

async function main(): Promise<void> {
  await ensureDatabaseReady();
  logger.info("Database check completed successfully");
}

main()
  .catch((error) => {
    logger.error("Database check failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDatabasePool();
  });
