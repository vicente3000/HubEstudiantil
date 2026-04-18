import { config } from "dotenv";

config();

function readRequiredString(name: string, fallback?: string): string {
  const rawValue = process.env[name];
  const value = rawValue === undefined || rawValue.trim() === "" ? fallback : rawValue;

  if (value === undefined || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readInteger(name: string, fallback: number): number {
  const rawValue = process.env[name];

  if (rawValue === undefined || rawValue.trim() === "") {
    return fallback;
  }

  const parsedValue = Number.parseInt(rawValue, 10);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`Environment variable ${name} must be a valid integer`);
  }

  return parsedValue;
}

function readBoolean(name: string, fallback: boolean): boolean {
  const rawValue = process.env[name];

  if (rawValue === undefined || rawValue.trim() === "") {
    return fallback;
  }

  if (rawValue === "true") return true;
  if (rawValue === "false") return false;

  throw new Error(`Environment variable ${name} must be "true" or "false"`);
}

export const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: readInteger("PORT", 3000),
  DATABASE_URL: readRequiredString(
    "DATABASE_URL",
    "postgresql://hub_user:hub_password@localhost:5432/hub_estudiantil"
  ),
  DB_SSL: readBoolean("DB_SSL", false),
  DB_POOL_MAX: readInteger("DB_POOL_MAX", 10),
  DB_IDLE_TIMEOUT_MS: readInteger("DB_IDLE_TIMEOUT_MS", 30_000),
  DB_CONNECTION_RETRIES: readInteger("DB_CONNECTION_RETRIES", 20),
  DB_CONNECTION_RETRY_DELAY_MS: readInteger("DB_CONNECTION_RETRY_DELAY_MS", 2_000),
  VALKEY_URL: readRequiredString("VALKEY_URL", "redis://localhost:6379"),
  VALKEY_KEY_PREFIX: process.env.VALKEY_KEY_PREFIX ?? "hub-estudiantil",
  VALKEY_DEFAULT_TTL_SECONDS: readInteger("VALKEY_DEFAULT_TTL_SECONDS", 300),
  VALKEY_CONNECTION_RETRIES: readInteger("VALKEY_CONNECTION_RETRIES", 20),
  VALKEY_CONNECTION_RETRY_DELAY_MS: readInteger("VALKEY_CONNECTION_RETRY_DELAY_MS", 2_000),
  JWT_SECRET: readRequiredString("JWT_SECRET", "change_this_secret"),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? ""
});

export type AppEnv = typeof env;
