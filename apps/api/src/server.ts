import { createServer } from "node:http";
import { app } from "./app/app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { ensureDatabaseReady, closeDatabasePool } from "./database/connection.js";
import { ensureCacheReady, closeCacheConnection } from "./cache/connection.js";

const server = createServer(app);

function bootstrapDependencies(): void {
  void Promise.allSettled([ensureDatabaseReady(), ensureCacheReady()]).then((results) => {
    results.forEach((result, index) => {
      const dependencyName = index === 0 ? "database" : "cache";

      if (result.status === "fulfilled") {
        logger.info(`${dependencyName} bootstrap completed`);
        return;
      }

      logger.warn(`${dependencyName} bootstrap failed, the API will continue in degraded mode`, result.reason);
    });
  });
}

async function shutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}. Shutting down gracefully...`);

  server.close(async () => {
    await closeCacheConnection();
    await closeDatabasePool();
    logger.info("Server shutdown completed");
    process.exit(0);
  });
}

function main(): void {
  server.listen(env.PORT, "0.0.0.0", () => {
    logger.info(`Hub Estudiantil API listening on http://0.0.0.0:${env.PORT}`);
  });

  bootstrapDependencies();
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("unhandledRejection", (error) => {
  logger.error("Unhandled promise rejection", error);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", error);
});

main();
