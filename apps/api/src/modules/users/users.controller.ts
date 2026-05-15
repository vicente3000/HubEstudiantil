import type { Request, Response } from "express";
import { findSessionUserById } from "../auth/auth-user.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
import { getUsersById, getUsersOverview } from "./users.service.js";
import { getRouteParamValue } from "../../shared/utils/index.js";

export async function getCurrentUserHandler(request: Request, response: Response): Promise<void> {
  const userId = request.authUserId;

  if (!userId) {
    throw new AppError("Sesión no disponible", 401, "AUTH_REQUIRED");
  }

  const user = await findSessionUserById(userId);

  if (!user) {
    throw new AppError("Usuario no encontrado", 404, "USER_NOT_FOUND");
  }

  if (!user.is_active) {
    throw new AppError("Cuenta desactivada", 403, "ACCOUNT_INACTIVE");
  }

  response.json({
    user: {
      id: user.id,
      email: user.institutional_email,
      displayName: user.display_name,
      roleCode: user.role_code,
      roleName: user.role_name,
      avatarUrl: user.avatar_url
    }
  });
}

export function getUsersOverviewHandler(_request: Request, response: Response): void {
  response.json(getUsersOverview());
}

export function getUsersByIdHandler(request: Request, response: Response): void {
  response.json(getUsersById(getRouteParamValue(request.params.id)));
}
