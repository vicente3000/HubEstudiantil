import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env.js";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
};

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    algorithm: "HS256"
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] });

  if (typeof decoded === "string" || decoded === null) {
    throw new Error("Invalid token payload");
  }

  const record = decoded as Record<string, unknown>;
  const sub = record.sub;
  const email = record.email;
  const role = record.role;

  if (typeof sub !== "string" || typeof email !== "string" || typeof role !== "string") {
    throw new Error("Invalid token claims");
  }

  return { sub, email, role };
}
