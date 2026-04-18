type LogLevel = "debug" | "info" | "warn" | "error";

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

function resolveLogLevel(rawValue?: string): LogLevel {
  if (rawValue === "debug" || rawValue === "info" || rawValue === "warn" || rawValue === "error") {
    return rawValue;
  }

  return "info";
}

const activeLevel = resolveLogLevel(process.env.LOG_LEVEL);

function shouldLog(level: LogLevel): boolean {
  return levelPriority[level] >= levelPriority[activeLevel];
}

function formatMetadata(metadata?: unknown): string {
  if (metadata === undefined) return "";

  if (metadata instanceof Error) {
    return ` ${metadata.stack ?? metadata.message}`;
  }

  try {
    return ` ${JSON.stringify(metadata)}`;
  } catch {
    return ` ${String(metadata)}`;
  }
}

function write(level: LogLevel, message: string, metadata?: unknown): void {
  if (!shouldLog(level)) return;

  const formattedLine = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}${formatMetadata(metadata)}`;

  if (level === "error") {
    console.error(formattedLine);
    return;
  }

  if (level === "warn") {
    console.warn(formattedLine);
    return;
  }

  console.log(formattedLine);
}

export const logger = {
  debug: (message: string, metadata?: unknown) => write("debug", message, metadata),
  info: (message: string, metadata?: unknown) => write("info", message, metadata),
  warn: (message: string, metadata?: unknown) => write("warn", message, metadata),
  error: (message: string, metadata?: unknown) => write("error", message, metadata)
};
