import { OAuth2Client } from "google-auth-library";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/AppError.js";

export type GoogleProfile = {
  sub: string;
  email: string;
  emailVerified: boolean;
  givenName: string;
  familyName: string;
  displayName: string;
  picture: string | null;
};

export class OAuthRedirectError extends Error {
  constructor(public readonly oauthCode: string) {
    super(oauthCode);
    this.name = "OAuthRedirectError";
  }
}

function buildOAuthClient(): OAuth2Client {
  return new OAuth2Client(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, env.GOOGLE_OAUTH_REDIRECT_URI);
}

export function buildGoogleAuthorizationUrl(state: string): string {
  const client = buildOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "select_account",
    scope: ["openid", "email", "profile"],
    state
  });
}

export async function exchangeGoogleAuthCode(code: string): Promise<GoogleProfile> {
  const client = buildOAuthClient();
  const { tokens } = await client.getToken(code);

  if (tokens.id_token) {
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email) {
      throw new AppError("Perfil de Google incompleto", 502, "GOOGLE_PROFILE_INCOMPLETE");
    }

    return {
      sub: payload.sub,
      email: payload.email,
      emailVerified: Boolean(payload.email_verified),
      givenName: typeof payload.given_name === "string" ? payload.given_name : "",
      familyName: typeof payload.family_name === "string" ? payload.family_name : "",
      displayName: typeof payload.name === "string" ? payload.name : payload.email.split("@")[0] ?? "Usuario",
      picture: typeof payload.picture === "string" ? payload.picture : null
    };
  }

  if (!tokens.access_token) {
    throw new AppError("Google no devolvió credenciales utilizables", 502, "GOOGLE_MISSING_TOKENS");
  }

  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  });

  if (!response.ok) {
    throw new AppError("No fue posible leer el perfil de Google", 502, "GOOGLE_USERINFO_FAILED");
  }

  const body = (await response.json()) as Record<string, unknown>;
  const sub = typeof body.sub === "string" ? body.sub : "";
  const email = typeof body.email === "string" ? body.email : "";
  const emailVerified = Boolean(body.email_verified);

  if (!sub || !email) {
    throw new AppError("Perfil de Google incompleto", 502, "GOOGLE_PROFILE_INCOMPLETE");
  }

  return {
    sub,
    email,
    emailVerified,
    givenName: typeof body.given_name === "string" ? body.given_name : "",
    familyName: typeof body.family_name === "string" ? body.family_name : "",
    displayName: typeof body.name === "string" ? body.name : email.split("@")[0] ?? "Usuario",
    picture: typeof body.picture === "string" ? body.picture : null
  };
}
