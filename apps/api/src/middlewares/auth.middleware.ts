import type { NextFunction, Request, Response } from "express";
import { AppError } from "../shared/errors/AppError.js";

export function requireAuth(request: Request, _response: Response, next: NextFunction): void {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    next(new AppError("Authentication required", 401, "AUTH_REQUIRED"));
    return;
  }

  next();
}

export function optionalAuth(_request: Request, _response: Response, next: NextFunction): void {
  next();
}
