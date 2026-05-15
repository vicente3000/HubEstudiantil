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

function readOptionalString(name: string, fallback = ""): string {
  const rawValue = process.env[name];

  if (rawValue === undefined || rawValue.trim() === "") {
    return fallback;
  }

  return rawValue.trim();
}

function readStringArray(name: string, fallback: string[]): string[] {
  const rawValue = process.env[name];

  if (rawValue === undefined || rawValue.trim() === "") {
    return fallback;
  }

  return rawValue
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function resolveAllowedInstitutionalEmailDomains(): string[] {
  if (process.env.ALLOWED_INSTITUTIONAL_EMAIL_DOMAINS?.trim()) {
    return readStringArray("ALLOWED_INSTITUTIONAL_EMAIL_DOMAINS", []);
  }

  if (process.env.AUTH_ALLOWED_EMAIL_DOMAIN?.trim()) {
    return [process.env.AUTH_ALLOWED_EMAIL_DOMAIN.trim().toLowerCase()];
  }

  const legacySuffix = readOptionalString("ALLOWED_INSTITUTIONAL_EMAIL_SUFFIX", "@ucn.cl").trim();

  if (legacySuffix.startsWith("@")) {
    return [legacySuffix.slice(1).toLowerCase()];
  }

  return [legacySuffix.toLowerCase()];
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
  JWT_EXPIRES_IN: readOptionalString("JWT_EXPIRES_IN", "7d"),
  /** Origen del frontend (sin barra final). Redirecciones post-OAuth. */
  WEB_APP_ORIGIN: readOptionalString("WEB_APP_ORIGIN", "http://localhost:5173").replace(/\/$/, ""),
  /** URI exacta registrada en Google Cloud (callback del API). */
  GOOGLE_OAUTH_REDIRECT_URI: readOptionalString(
    "GOOGLE_OAUTH_REDIRECT_URI",
    "http://localhost:3000/api/auth/google/callback"
  ),
  GOOGLE_CLIENT_ID: readOptionalString("895204162462-uno1pa4hccnct60h99kg7s98clchdgvh.apps.googleusercontent.com"),
  GOOGLE_CLIENT_SECRET: readOptionalString("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"),
  /** Dominios institucionales permitidos para crear un usuario nuevo con Google. */
  ALLOWED_INSTITUTIONAL_EMAIL_DOMAINS: resolveAllowedInstitutionalEmailDomains(),
  /** En producción queda desactivado salvo `ENABLE_DEV_TOKEN_AUTH=true`. */
  ENABLE_DEV_TOKEN_AUTH: readBoolean(
    "ENABLE_DEV_TOKEN_AUTH",
    (process.env.NODE_ENV ?? "development") !== "production"
  )
});

export function isGoogleOAuthConfigured(): boolean {
  return (
    env.GOOGLE_CLIENT_ID.length > 0 &&
    env.GOOGLE_CLIENT_SECRET.length > 0 &&
    env.GOOGLE_OAUTH_REDIRECT_URI.length > 0 &&
    env.WEB_APP_ORIGIN.length > 0
  );
}

export function isDevTokenAuthEnabled(): boolean {
  if (env.NODE_ENV !== "production") {
    return true;
  }

  return env.ENABLE_DEV_TOKEN_AUTH;
}

export type AppEnv = typeof env;
