import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../modules/auth/jwt.service.js";
import { AppError } from "../shared/errors/AppError.js";

export function requireAuth(request: Request, _response: Response, next: NextFunction): void {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    next(new AppError("Authentication required", 401, "AUTH_REQUIRED"));
    return;
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();

  if (!token) {
    next(new AppError("Authentication required", 401, "AUTH_REQUIRED"));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    request.authUserId = payload.sub;
    request.authUserRole = payload.role;
    request.authUserEmail = payload.email;
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401, "AUTH_INVALID"));
  }
}

export function requireRole(allowedRoles: string[] | string): (request: Request, _response: Response, next: NextFunction) => void {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return function (request: Request, _response: Response, next: NextFunction): void {
    if (!request.authUserRole) {
      next(new AppError("Authentication required", 401, "AUTH_REQUIRED"));
      return;
    }

    if (!roles.includes(request.authUserRole)) {
      next(new AppError("Permission denied", 403, "FORBIDDEN"));
      return;
    }

    next();
  };
}

export function optionalAuth(_request: Request, _response: Response, next: NextFunction): void {
  next();
}
