// Firebase web config is public by design (it identifies the project, it does not authorize anything);
// access control lives in Firestore Security Rules, see docs/architecture/security.md.
export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
};

export type FirebaseConfigResult =
  | { ok: true; config: FirebaseWebConfig }
  | { ok: false; missing: string[] };

const ENV_KEYS = {
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
} as const satisfies Record<keyof FirebaseWebConfig, string>;

export type FirebaseEnv = Partial<Record<(typeof ENV_KEYS)[keyof typeof ENV_KEYS], string | undefined>>;

// Next.js inlines NEXT_PUBLIC_* only when each name is written out literally, so the caller passes them explicitly.
export function readFirebaseConfig(env: FirebaseEnv): FirebaseConfigResult {
  const missing: string[] = [];
  const values = {} as FirebaseWebConfig;
  for (const [field, name] of Object.entries(ENV_KEYS) as [keyof FirebaseWebConfig, keyof FirebaseEnv][]) {
    const value = env[name]?.trim();
    if (value) values[field] = value;
    else missing.push(name);
  }
  return missing.length ? { ok: false, missing } : { ok: true, config: values };
}
