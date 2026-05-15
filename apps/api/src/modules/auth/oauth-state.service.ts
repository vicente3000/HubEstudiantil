import crypto from "node:crypto";
import { env } from "../../config/env.js";

type StatePayload = {
  n: string;
  exp: number;
};

function signBody(body: string): string {
  return crypto.createHmac("sha256", env.JWT_SECRET).update(body).digest("base64url");
}

export function createSignedOAuthState(): string {
  const payload: StatePayload = {
    n: crypto.randomBytes(16).toString("hex"),
    exp: Date.now() + 10 * 60 * 1000
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = signBody(body);
  return `${body}.${sig}`;
}

export function verifySignedOAuthState(state: string | undefined): boolean {
  if (!state || typeof state !== "string") {
    return false;
  }

  const dot = state.indexOf(".");
  if (dot === -1) {
    return false;
  }

  const body = state.slice(0, dot);
  const sig = state.slice(dot + 1);
  const expected = signBody(body);

  const sigBuf = Buffer.from(sig, "utf8");
  const expBuf = Buffer.from(expected, "utf8");

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return false;
  }

  try {
    const json = Buffer.from(body, "base64url").toString("utf8");
    const payload = JSON.parse(json) as StatePayload;

    if (typeof payload.exp !== "number" || Date.now() > payload.exp) {
      return false;
    }

    return typeof payload.n === "string" && payload.n.length > 0;
  } catch {
    return false;
  }
}
