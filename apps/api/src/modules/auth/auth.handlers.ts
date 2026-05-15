import type { Request, Response } from "express";
import { env, isDevTokenAuthEnabled, isGoogleOAuthConfigured } from "../../config/env.js";
import { AppError } from "../../shared/errors/AppError.js";
import { createSignedOAuthState, verifySignedOAuthState } from "./oauth-state.service.js";
import { buildGoogleAuthorizationUrl, exchangeGoogleAuthCode, OAuthRedirectError } from "./google-oauth.service.js";
import { issueDevTokenForEmail, issueJwtForUser, issueTokenForPassword, resolveUserForGoogleProfile } from "./auth-session.service.js";

function redirectToLogin(response: Response, oauthError: string): void {
  const target = new URL("/login", env.WEB_APP_ORIGIN);
  target.searchParams.set("oauth_error", oauthError);
  response.redirect(302, target.toString());
}

function redirectToAppWithToken(response: Response, token: string): void {
  const fragment = new URLSearchParams({
    access_token: token,
    token_type: "Bearer"
  }).toString();
  const target = new URL("/auth/callback", env.WEB_APP_ORIGIN);
  response.redirect(302, `${target.toString()}#${fragment}`);
}

export function getOauthConfigHandler(_request: Request, response: Response): void {
  const configured = isGoogleOAuthConfigured();

  response.json({
    google: {
      enabled: configured,
      allowedDomains: env.ALLOWED_INSTITUTIONAL_EMAIL_DOMAINS,
      ...(!configured
        ? {
            missing: {
              clientId: env.GOOGLE_CLIENT_ID.length === 0,
              clientSecret: env.GOOGLE_CLIENT_SECRET.length === 0,
              redirectUri: env.GOOGLE_OAUTH_REDIRECT_URI.length === 0,
              webAppOrigin: env.WEB_APP_ORIGIN.length === 0
            }
          }
        : {})
    }
  });
}

export function getGoogleStartHandler(_request: Request, response: Response): void {
  if (!isGoogleOAuthConfigured()) {
    throw new AppError("OAuth con Google no está configurado en el servidor", 503, "GOOGLE_OAUTH_DISABLED");
  }

  const state = createSignedOAuthState();
  const url = buildGoogleAuthorizationUrl(state);
  response.redirect(302, url);
}

export async function getGoogleCallbackHandler(request: Request, response: Response): Promise<void> {
  if (!isGoogleOAuthConfigured()) {
    redirectToLogin(response, "google_login_failed");
    return;
  }

  const error = typeof request.query.error === "string" ? request.query.error : undefined;

  if (error === "access_denied") {
    redirectToLogin(response, "access_denied");
    return;
  }

  if (error) {
    redirectToLogin(response, "google_denied");
    return;
  }

  const state = typeof request.query.state === "string" ? request.query.state : undefined;
  const code = typeof request.query.code === "string" ? request.query.code : undefined;

  if (!verifySignedOAuthState(state)) {
    redirectToLogin(response, "invalid_state");
    return;
  }

  if (!code) {
    redirectToLogin(response, "missing_code");
    return;
  }

  try {
    const profile = await exchangeGoogleAuthCode(code);
    const user = await resolveUserForGoogleProfile(profile);
    const token = issueJwtForUser(user);
    redirectToAppWithToken(response, token);
  } catch (unknownError) {
    if (unknownError instanceof OAuthRedirectError) {
      redirectToLogin(response, unknownError.oauthCode);
      return;
    }

    if (unknownError instanceof AppError && unknownError.code === "GOOGLE_PROFILE_INCOMPLETE") {
      redirectToLogin(response, "missing_token");
      return;
    }

    redirectToLogin(response, "google_login_failed");
  }
}

export async function postDevTokenHandler(request: Request, response: Response): Promise<void> {
  if (!isDevTokenAuthEnabled()) {
    throw new AppError("Token de desarrollo deshabilitado", 403, "DEV_TOKEN_DISABLED");
  }

  const body = request.body as { institutionalEmail?: unknown };

  if (typeof body.institutionalEmail !== "string" || body.institutionalEmail.trim() === "") {
    throw new AppError("institutionalEmail es obligatorio", 400, "VALIDATION_ERROR");
  }

  const token = await issueDevTokenForEmail(body.institutionalEmail);
  response.json({ token });
}

export async function postPasswordLoginHandler(request: Request, response: Response): Promise<void> {
  const body = request.body as { institutionalEmail?: unknown; password?: unknown };

  if (typeof body.institutionalEmail !== "string" || body.institutionalEmail.trim() === "") {
    throw new AppError("institutionalEmail es obligatorio", 400, "VALIDATION_ERROR");
  }

  if (typeof body.password !== "string" || body.password.length === 0) {
    throw new AppError("password es obligatorio", 400, "VALIDATION_ERROR");
  }

  const token = await issueTokenForPassword(body.institutionalEmail, body.password);
  response.json({ token });
}
