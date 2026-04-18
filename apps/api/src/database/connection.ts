import { setTimeout as sleep } from "node:timers/promises";
import { Pool, type PoolClient, type PoolConfig, type QueryResult, type QueryResultRow } from "pg";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

const poolConfig: PoolConfig = {
  connectionString: env.DATABASE_URL,
  max: env.DB_POOL_MAX,
  idleTimeoutMillis: env.DB_IDLE_TIMEOUT_MS,
  ssl: env.DB_SSL ? { rejectUnauthorized: false } : undefined
};

export const dbPool = new Pool(poolConfig);

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: Array<unknown>
): Promise<QueryResult<T>> {
  return dbPool.query<T>(text, params);
}

export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await dbPool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function ensureDatabaseReady(): Promise<void> {
  for (let attempt = 1; attempt <= env.DB_CONNECTION_RETRIES; attempt += 1) {
    try {
      await query("SELECT 1");
      logger.info("Database connection established");
      return;
    } catch (error) {
      if (attempt === env.DB_CONNECTION_RETRIES) {
        logger.error("Database connection failed after all retries", error);
        throw error;
      }

      logger.warn(`Database not ready yet. Retry ${attempt}/${env.DB_CONNECTION_RETRIES}`);
      await sleep(env.DB_CONNECTION_RETRY_DELAY_MS);
    }
  }
}

export async function closeDatabasePool(): Promise<void> {
  await dbPool.end();
}
