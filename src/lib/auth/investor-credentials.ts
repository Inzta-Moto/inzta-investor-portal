import { createHash, randomBytes, scrypt, scryptSync, timingSafeEqual } from "node:crypto";

// The investor signs in with a username and password owned by the portal (VN Raja, ADR-0006). The investor has no
// Firebase Auth account, so the account cannot reach the internal dashboard or Firestore directly.

const KEY_LENGTH = 32;
const COST = 16_384;
const BLOCK = 8;
const PARALLEL = 1;
const MAX_MEMORY = 64 * 1024 * 1024;

/** Produces `scrypt$N$r$p$salt$hash` (base64) for INVESTOR_PASSWORD_HASH; see `npm run auth:hash-password`. */
export function hashPassword(password: string, salt: Buffer = randomBytes(16)): string {
  const hash = scryptSync(password, salt, KEY_LENGTH, { N: COST, r: BLOCK, p: PARALLEL });
  return ["scrypt", COST, BLOCK, PARALLEL, salt.toString("base64"), hash.toString("base64")].join("$");
}

type ScryptHash = { N: number; r: number; p: number; salt: Buffer; expected: Buffer };

/** Null for anything scrypt would reject at login time, so a mistyped env value is caught as a config error. */
export function parseScryptHash(stored: string): ScryptHash | null {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return null;
  const [N, r, p] = parts.slice(1, 4).map(Number);
  if (![N, r, p].every((value) => Number.isSafeInteger(value) && value > 0)) return null;
  // scrypt needs N to be a power of two above 1 and about 128 * N * r bytes of memory.
  if (N < 2 || (N & (N - 1)) !== 0 || 128 * N * r > MAX_MEMORY / 2 || p > 16) return null;
  const salt = Buffer.from(parts[4], "base64");
  const expected = Buffer.from(parts[5], "base64");
  if (expected.length !== KEY_LENGTH || salt.length === 0) return null;
  return { N, r, p, salt, expected };
}

/** Async so a login attempt does not block other requests on the server while scrypt runs. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parsed = parseScryptHash(stored);
  if (!parsed) return false;
  const actual = await new Promise<Buffer>((resolve, reject) =>
    scrypt(password, parsed.salt, KEY_LENGTH, { N: parsed.N, r: parsed.r, p: parsed.p, maxmem: MAX_MEMORY }, (error, key) => (error ? reject(error) : resolve(key))),
  );
  return timingSafeEqual(actual, parsed.expected);
}

// Development-only account so `npm run dev` works without an env file; documented in README, never valid in builds.
export const DEV_CREDENTIALS = {
  username: "investor",
  password: "inzta-demo-2026",
  secret: "dev-only-session-secret-do-not-use-in-production",
} as const;

export type CredentialConfig =
  | { ok: true; username: string; passwordHash: string; secret: string; usingDevDefaults: boolean }
  | { ok: false; reason: string };

type Env = Record<string, string | undefined>;

let devHash: string | null = null;

export function readCredentialConfig(env: Env, nodeEnv: string | undefined): CredentialConfig {
  const username = env.INVESTOR_USERNAME?.trim() ?? "";
  const passwordHash = env.INVESTOR_PASSWORD_HASH?.trim() ?? "";
  const secret = env.SESSION_SECRET ?? "";

  if (username && passwordHash && secret) {
    if (secret.length < 32) return { ok: false, reason: "SESSION_SECRET minimal 32 karakter." };
    if (!parseScryptHash(passwordHash)) return { ok: false, reason: "INVESTOR_PASSWORD_HASH harus dibuat dengan npm run auth:hash-password." };
    return { ok: true, username, passwordHash, secret, usingDevDefaults: false };
  }
  // A half-filled env is a mistake, so it is reported instead of silently falling back to the development account.
  if (!username && !passwordHash && !secret && nodeEnv === "development") {
    devHash ??= hashPassword(DEV_CREDENTIALS.password);
    return { ok: true, username: DEV_CREDENTIALS.username, passwordHash: devHash, secret: DEV_CREDENTIALS.secret, usingDevDefaults: true };
  }
  return { ok: false, reason: "Login investor belum dikonfigurasi: isi INVESTOR_USERNAME, INVESTOR_PASSWORD_HASH, dan SESSION_SECRET." };
}

/** Username is compared through fixed-length digests; the password check runs even when the username is wrong. */
export async function credentialsMatch(config: { username: string; passwordHash: string }, username: string, password: string): Promise<boolean> {
  const digest = (value: string) => createHash("sha256").update(value, "utf8").digest();
  const userOk = timingSafeEqual(digest(username.trim()), digest(config.username));
  const passOk = await verifyPassword(password, config.passwordHash);
  return userOk && passOk;
}

/**
 * Signing key for session cookies. It includes the username and password hash, so replacing the password in the env
 * signs out every device that logged in with the old one.
 */
export function sessionKey(config: { username: string; passwordHash: string; secret: string }): string {
  return createHash("sha256").update(JSON.stringify([config.secret, config.username, config.passwordHash]), "utf8").digest("hex");
}
