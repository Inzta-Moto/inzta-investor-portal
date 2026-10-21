import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { readDemoAuthConfig, type DemoAuthConfig } from "./demo-config.ts";
import { SESSION_TTL_MS, verifySession } from "./session-token.ts";

export const SESSION_COOKIE = "inzta_investor_session";

export function demoAuthConfig(): DemoAuthConfig {
  return readDemoAuthConfig(process.env, process.env.NODE_ENV);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

export async function hasValidSession(): Promise<boolean> {
  // Cookies are read before the config check so every caller is rendered per request; otherwise a build without
  // env vars would prerender /masuk with the "not configured" message baked in.
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const config = demoAuthConfig();
  if (!config.ok) return false;
  return verifySession(token, config.secret, Date.now());
}

/** Server-side gate for every portal page; hiding links is not access control. */
export async function requireSession(): Promise<void> {
  if (!(await hasValidSession())) redirect("/masuk");
}
