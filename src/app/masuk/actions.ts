"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { AttemptLimiter } from "@/lib/auth/attempt-limiter";
import { credentialsMatch } from "@/lib/auth/demo-config";
import { SESSION_COOKIE, demoAuthConfig, sessionCookieOptions } from "@/lib/auth/session";
import { signSession } from "@/lib/auth/session-token";

// The username travels back in the state so React's post-action form reset does not wipe it.
export type SignInState = { error: string | null; username: string };

const limiter = new AttemptLimiter();

async function clientKey(): Promise<string> {
  const list = await headers();
  return list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "unknown";
}

export async function signIn(_previous: SignInState, formData: FormData): Promise<SignInState> {
  const config = demoAuthConfig();
  const username = String(formData.get("username") ?? "");
  if (!config.ok) return { error: config.reason, username };

  const key = await clientKey();
  const wait = limiter.retryAfter(key, Date.now());
  if (wait > 0) {
    return { error: `Terlalu banyak percobaan masuk. Coba lagi dalam ${Math.ceil(wait / 60_000)} menit.`, username };
  }

  const password = String(formData.get("password") ?? "");
  // One message for every failure so the form does not reveal which field was wrong.
  if (!credentialsMatch(config, username, password)) {
    limiter.recordFailure(key, Date.now());
    return { error: "Username atau kata sandi salah.", username };
  }
  limiter.reset(key);
  (await cookies()).set(SESSION_COOKIE, signSession(config.secret, Date.now()), sessionCookieOptions());
  redirect("/ringkasan");
}

export async function signOut(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/masuk");
}
