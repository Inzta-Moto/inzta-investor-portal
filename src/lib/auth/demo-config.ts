import { createHash, timingSafeEqual } from "node:crypto";

// Development-only fallback so `npm run dev` works without an env file. Documented in README; not a secret.
export const DEV_DEMO_CREDENTIALS = {
  username: "investor",
  password: "inzta-demo-2026",
  secret: "dev-only-session-secret-do-not-use-in-production",
} as const;

export type DemoAuthConfig =
  | { ok: true; username: string; password: string; secret: string; usingDevDefaults: boolean }
  | { ok: false; reason: string };

type Env = Record<string, string | undefined>;

export function readDemoAuthConfig(env: Env, nodeEnv: string | undefined): DemoAuthConfig {
  const username = env.DEMO_INVESTOR_USERNAME?.trim() ?? "";
  const password = env.DEMO_INVESTOR_PASSWORD ?? "";
  const secret = env.SESSION_SECRET ?? "";
  const anySet = Boolean(username || password || secret);

  if (username && password && secret) {
    if (secret.length < 32) return { ok: false, reason: "SESSION_SECRET minimal 32 karakter." };
    return { ok: true, username, password, secret, usingDevDefaults: false };
  }
  // A half-filled env is a mistake, so it is reported instead of silently falling back to the demo account.
  if (!anySet && nodeEnv === "development") return { ok: true, ...DEV_DEMO_CREDENTIALS, usingDevDefaults: true };
  return {
    ok: false,
    reason: "Mode demo belum dikonfigurasi: isi DEMO_INVESTOR_USERNAME, DEMO_INVESTOR_PASSWORD, dan SESSION_SECRET.",
  };
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

/** Compares fixed-length digests so neither the length nor the content of the input leaks through timing. */
export function credentialsMatch(config: { username: string; password: string }, username: string, password: string): boolean {
  const userOk = timingSafeEqual(digest(username.trim()), digest(config.username));
  const passOk = timingSafeEqual(digest(password), digest(config.password));
  return userOk && passOk;
}
