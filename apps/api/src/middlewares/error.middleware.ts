import type { NextFunction, Request, Response } from "express";
import { AppError } from "../shared/errors/AppError.js";
import { logger } from "../config/logger.js";

export function errorMiddleware(error: unknown, _request: Request, response: Response, _next: NextFunction): void {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      ok: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details ?? null
      }
    });
    return;
  }

  logger.error("Unhandled application error", error);

  response.status(500).json({
    ok: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred"
    }
  });
}
