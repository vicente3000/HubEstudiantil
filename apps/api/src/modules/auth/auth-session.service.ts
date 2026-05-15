import { query } from "../../database/connection.js";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/AppError.js";
import {
  createUserFromGoogle,
  findSessionUserById,
  findSessionUserByPassword,
  findUserByGoogleSub,
  findUserByInstitutionalEmail,
  linkGoogleAccount,
  touchLastLogin,
  type SessionUserRow
} from "./auth-user.repository.js";
import { signAccessToken } from "./jwt.service.js";
import type { GoogleProfile } from "./google-oauth.service.js";
import { OAuthRedirectError } from "./google-oauth.service.js";

export function issueJwtForUser(user: SessionUserRow): string {
  return signAccessToken({
    sub: user.id,
    email: user.institutional_email,
    role: user.role_code
  });
}

export async function issueDevTokenForEmail(institutionalEmail: string): Promise<string> {
  const user = await findUserByInstitutionalEmail(institutionalEmail.trim());

  if (!user) {
    throw new AppError("Usuario no encontrado para el correo indicado", 404, "USER_NOT_FOUND");
  }

  if (!user.is_active) {
    throw new AppError("Cuenta desactivada", 403, "ACCOUNT_INACTIVE");
  }

  await touchLastLogin(user.id);
  return issueJwtForUser(user);
}

export async function issueTokenForPassword(institutionalEmail: string, password: string): Promise<string> {
  const user = await findSessionUserByPassword(institutionalEmail.trim(), password);

  if (!user) {
    throw new AppError("Correo o contraseña incorrectos", 401, "INVALID_CREDENTIALS");
  }

  await touchLastLogin(user.id);
  return issueJwtForUser(user);
}

async function isGoogleSubTakenByOther(googleSub: string, userId: string): Promise<boolean> {
  const result = await query(`SELECT 1 FROM users WHERE google_sub = $1 AND id <> $2::uuid LIMIT 1`, [
    googleSub,
    userId
  ]);

  return result.rows.length > 0;
}

export async function resolveUserForGoogleProfile(profile: GoogleProfile): Promise<SessionUserRow> {
  if (!profile.emailVerified) {
    throw new OAuthRedirectError("email_not_verified");
  }

  const email = profile.email.trim().toLowerCase();
  const emailDomain = email.split("@")[1] ?? "";
  const allowedDomains = env.ALLOWED_INSTITUTIONAL_EMAIL_DOMAINS;

  const bySub = await findUserByGoogleSub(profile.sub);

  if (bySub) {
    if (!bySub.is_active) {
      throw new OAuthRedirectError("account_inactive");
    }

    await touchLastLogin(bySub.id);
    return bySub;
  }

  const byEmail = await findUserByInstitutionalEmail(email);

  if (byEmail) {
    if (!byEmail.is_active) {
      throw new OAuthRedirectError("account_inactive");
    }

    const subRow = await query(`SELECT google_sub FROM users WHERE id = $1::uuid LIMIT 1`, [byEmail.id]);
    const existingSub = subRow.rows[0]?.google_sub;

    if (typeof existingSub === "string" && existingSub.length > 0 && existingSub !== profile.sub) {
      throw new OAuthRedirectError("email_already_registered");
    }

    if (await isGoogleSubTakenByOther(profile.sub, byEmail.id)) {
      throw new OAuthRedirectError("email_already_registered");
    }

    await linkGoogleAccount({
      userId: byEmail.id,
      googleSub: profile.sub,
      avatarUrl: profile.picture
    });

    const refreshed = await findSessionUserById(byEmail.id);

    if (!refreshed) {
      throw new AppError("No fue posible actualizar la sesión del usuario", 500, "USER_REFRESH_FAILED");
    }

    return refreshed;
  }

  if (!allowedDomains.includes(emailDomain)) {
    throw new OAuthRedirectError("email_domain_not_allowed");
  }

  const firstName = profile.givenName.trim() || profile.displayName.split(" ")[0] || "Usuario";
  const lastName = profile.familyName.trim() || profile.displayName.split(" ").slice(1).join(" ") || "UCN";

  try {
    return await createUserFromGoogle({
      googleSub: profile.sub,
      institutionalEmail: email,
      firstName,
      lastName,
      displayName: profile.displayName.trim() || email,
      avatarUrl: profile.picture
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("unique") || message.includes("duplicate")) {
      throw new OAuthRedirectError("email_already_registered");
    }

    throw error;
  }
}
