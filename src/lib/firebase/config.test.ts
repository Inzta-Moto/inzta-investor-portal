import assert from "node:assert/strict";
import { test } from "node:test";

import { readFirebaseConfig } from "./config.ts";

const complete = {
  NEXT_PUBLIC_FIREBASE_API_KEY: "test-api-key",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "example.firebaseapp.com",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "example",
  NEXT_PUBLIC_FIREBASE_APP_ID: "1:000:web:000",
};

test("returns the config when every variable is present", () => {
  const result = readFirebaseConfig(complete);
  assert.deepEqual(result, {
    ok: true,
    config: {
      apiKey: "test-api-key",
      authDomain: "example.firebaseapp.com",
      projectId: "example",
      appId: "1:000:web:000",
    },
  });
});

test("lists every missing or blank variable by its env name", () => {
  const result = readFirebaseConfig({ ...complete, NEXT_PUBLIC_FIREBASE_PROJECT_ID: "  ", NEXT_PUBLIC_FIREBASE_APP_ID: undefined });
  assert.deepEqual(result, {
    ok: false,
    missing: ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", "NEXT_PUBLIC_FIREBASE_APP_ID"],
  });
});

test("an empty environment reports all four variables", () => {
  const result = readFirebaseConfig({});
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.missing.length, 4);
});
