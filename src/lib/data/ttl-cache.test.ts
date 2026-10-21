import assert from "node:assert/strict";
import { test } from "node:test";

import { readAdminConfig } from "./admin-config.ts";
import { TtlCache } from "./ttl-cache.ts";

test("cached values are reused until the TTL passes, then reloaded", async () => {
  const cache = new TtlCache<number>();
  let loads = 0;
  const load = async () => ++loads;
  assert.equal(await cache.get("2026-12", 60_000, 0, load), 1);
  assert.equal(await cache.get("2026-12", 60_000, 59_999, load), 1);
  assert.equal(await cache.get("2026-12", 60_000, 60_000, load), 2);
  assert.equal(await cache.get("2026-11", 60_000, 60_000, load), 3);
});

test("concurrent callers share one pending load", async () => {
  const cache = new TtlCache<string>();
  let loads = 0;
  const load = () => new Promise<string>((resolve) => setTimeout(() => resolve(`v${++loads}`), 5));
  const [a, b] = await Promise.all([cache.get("k", 1000, 0, load), cache.get("k", 1000, 0, load)]);
  assert.deepEqual([a, b, loads], ["v1", "v1", 1]);
});

test("a failed load is not cached", async () => {
  const cache = new TtlCache<number>();
  await assert.rejects(cache.get("k", 1000, 0, async () => Promise.reject(new Error("offline"))));
  assert.equal(await cache.get("k", 1000, 1, async () => 7), 7);
});

test("admin config: emulator needs no key; production needs all three variables", () => {
  assert.deepEqual(readAdminConfig({ FIRESTORE_EMULATOR_HOST: "127.0.0.1:8080" }), { ok: true, mode: "emulator", projectId: "demo-inzta" });
  assert.deepEqual(readAdminConfig({ FIREBASE_PROJECT_ID: "inzta-5244e" }), { ok: false, missing: ["FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"] });
  const ok = readAdminConfig({ FIREBASE_PROJECT_ID: "p", FIREBASE_CLIENT_EMAIL: "sa@p.iam.gserviceaccount.com", FIREBASE_PRIVATE_KEY: "-----BEGIN-----\\nabc\\n-----END-----" });
  assert.equal(ok.ok && ok.mode === "service-account" && ok.privateKey, "-----BEGIN-----\nabc\n-----END-----");
});

test("the cache keeps at most its entry limit, dropping the oldest key first", async () => {
  const cache = new TtlCache<number>(2);
  for (const key of ["a", "b", "c"]) await cache.get(key, 1000, 0, async () => 1);
  let loads = 0;
  await cache.get("a", 1000, 1, async () => ++loads);
  await cache.get("c", 1000, 1, async () => ++loads);
  assert.equal(loads, 1);
});
