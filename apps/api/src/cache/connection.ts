import { setTimeout as sleep } from "node:timers/promises";
import { createClient, type RedisClientType } from "redis";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

export type ValkeyClient = RedisClientType;

export const valkeyClient: ValkeyClient = createClient({
  url: env.VALKEY_URL,
  socket: {
    reconnectStrategy(retries) {
      if (retries >= env.VALKEY_CONNECTION_RETRIES) {
        return new Error("Valkey reconnect retries exhausted");
      }

      return env.VALKEY_CONNECTION_RETRY_DELAY_MS;
    }
  }
});

let listenersRegistered = false;

function registerEventListeners(): void {
  if (listenersRegistered) return;

  valkeyClient.on("connect", () => {
    logger.info("Valkey socket connected");
  });

  valkeyClient.on("ready", () => {
    logger.info("Valkey client ready");
  });

  valkeyClient.on("reconnecting", () => {
    logger.warn("Valkey client reconnecting");
  });

  valkeyClient.on("error", (error) => {
    logger.error("Valkey client error", error);
  });

  listenersRegistered = true;
}

export async function ensureCacheReady(): Promise<void> {
  registerEventListeners();

  if (valkeyClient.isReady) {
    return;
  }

  if (!valkeyClient.isOpen) {
    await valkeyClient.connect();
  }

  for (let attempt = 1; attempt <= env.VALKEY_CONNECTION_RETRIES; attempt += 1) {
    if (valkeyClient.isReady) {
      logger.info("Valkey connection established");
      return;
    }

    if (attempt === env.VALKEY_CONNECTION_RETRIES) {
      throw new Error("Valkey connection failed after all retries");
    }

    logger.warn(`Valkey not ready yet. Retry ${attempt}/${env.VALKEY_CONNECTION_RETRIES}`);
    await sleep(env.VALKEY_CONNECTION_RETRY_DELAY_MS);
  }
}

export async function closeCacheConnection(): Promise<void> {
  if (valkeyClient.isOpen) {
    await valkeyClient.quit();
  }
}
