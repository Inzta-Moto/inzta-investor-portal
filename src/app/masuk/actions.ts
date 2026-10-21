"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { AttemptLimiter } from "@/lib/auth/attempt-limiter";
import { credentialsMatch, sessionKey } from "@/lib/auth/investor-credentials";
import { SESSION_COOKIE, credentialConfig, sessionCookieOptions } from "@/lib/auth/session";
import { signSession } from "@/lib/auth/session-token";

// The username travels back in the state so React's post-action form reset does not wipe it.
export type SignInState = { error: string | null; username: string };

const limiter = new AttemptLimiter();
// There is one investor account, so a ceiling across all clients caps guessing even when client keys are forged.
const ALL_CLIENTS = "all";
const GLOBAL_MAX_FAILURES = 50;

async function clientKey(): Promise<string> {
  const list = await headers();
  // The leftmost X-Forwarded-For entry is whatever the browser sent; the proxy's own entries are x-real-ip and the last one.
  const forwarded = list.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  return list.get("x-real-ip")?.trim() || forwarded || "unknown";
}

export async function signIn(_previous: SignInState, formData: FormData): Promise<SignInState> {
  const config = credentialConfig();
  const username = String(formData.get("username") ?? "");
  if (!config.ok) return { error: config.reason, username };

  const key = await clientKey();
  const now = Date.now();
  const wait = Math.max(limiter.retryAfter(key, now), limiter.retryAfter(ALL_CLIENTS, now, GLOBAL_MAX_FAILURES));
  if (wait > 0) {
    return { error: `Terlalu banyak percobaan masuk. Coba lagi dalam ${Math.ceil(wait / 60_000)} menit.`, username };
  }

  const password = String(formData.get("password") ?? "");
  // One message for every failure so the form does not reveal which field was wrong.
  if (!(await credentialsMatch(config, username, password))) {
    limiter.recordFailure(key, Date.now());
    limiter.recordFailure(ALL_CLIENTS, Date.now());
    return { error: "Username atau kata sandi salah.", username };
  }
  limiter.reset(key);
  (await cookies()).set(SESSION_COOKIE, signSession(sessionKey(config), Date.now()), sessionCookieOptions());
  redirect("/ringkasan");
}

export async function signOut(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/masuk");
}
