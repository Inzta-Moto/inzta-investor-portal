// Server-only configuration for the Firebase Admin SDK (ADR-0006). The service account key is created by the owner in
// the Firebase Console and lives only in the server environment; it never reaches the browser.

export type AdminConfig =
  | { ok: true; mode: "emulator"; projectId: string }
  | { ok: true; mode: "service-account"; projectId: string; clientEmail: string; privateKey: string }
  | { ok: false; missing: string[] };

type Env = Record<string, string | undefined>;

export function readAdminConfig(env: Env): AdminConfig {
  const projectId = env.FIREBASE_PROJECT_ID?.trim() ?? "";
  // Always the test project: .env.local holds the production id, and the seed and tests write to "demo-inzta" only.
  if (env.FIRESTORE_EMULATOR_HOST?.trim()) return { ok: true, mode: "emulator", projectId: "demo-inzta" };
  const clientEmail = env.FIREBASE_CLIENT_EMAIL?.trim() ?? "";
  // Hosting dashboards store the PEM on one line with literal "\n"; restore the line breaks the key parser expects.
  const privateKey = (env.FIREBASE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n").trim();
  const missing = [
    !projectId && "FIREBASE_PROJECT_ID",
    !clientEmail && "FIREBASE_CLIENT_EMAIL",
    !privateKey && "FIREBASE_PRIVATE_KEY",
  ].filter((name): name is string => Boolean(name));
  if (missing.length) return { ok: false, missing };
  return { ok: true, mode: "service-account", projectId, clientEmail, privateKey };
}
