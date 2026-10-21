import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const VERSION = "v1";

function signature(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/** Token `v1.<expiresMs>.<hmac>`: the cookie proves who issued it and when it expires, nothing else (ADR-0004). */
export function signSession(secret: string, nowMs: number): string {
  const payload = `${VERSION}.${nowMs + SESSION_TTL_MS}`;
  return `${payload}.${signature(payload, secret)}`;
}

export function verifySession(token: string | undefined, secret: string, nowMs: number): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== VERSION) return false;
  const expires = Number(parts[1]);
  if (!Number.isSafeInteger(expires) || expires <= nowMs) return false;
  const expected = Buffer.from(signature(`${parts[0]}.${parts[1]}`, secret), "hex");
  const given = Buffer.from(parts[2], "hex");
  // Length is checked first because timingSafeEqual throws on unequal lengths; the length itself is not secret.
  return given.length === expected.length && timingSafeEqual(given, expected);
}
