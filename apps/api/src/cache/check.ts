import { closeCacheConnection, ensureCacheReady, valkeyClient } from "./connection.js";
import { logger } from "../config/logger.js";

async function main(): Promise<void> {
  await ensureCacheReady();
  const response = await valkeyClient.ping();
  logger.info(`Valkey check completed successfully: ${response}`);
}

main()
  .catch((error) => {
    logger.error("Valkey check failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeCacheConnection();
  });
