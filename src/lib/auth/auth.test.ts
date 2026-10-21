import assert from "node:assert/strict";
import { test } from "node:test";

import { DEV_DEMO_CREDENTIALS, credentialsMatch, readDemoAuthConfig } from "./demo-config.ts";
import { SESSION_TTL_MS, signSession, verifySession } from "./session-token.ts";

const SECRET = "a".repeat(40);
const NOW = Date.UTC(2027, 0, 14, 3, 0, 0);

test("AC-003: a fresh token verifies; tampered, expired, or foreign tokens do not", () => {
  const token = signSession(SECRET, NOW);
  assert.equal(verifySession(token, SECRET, NOW + 1000), true);
  assert.equal(verifySession(token, SECRET, NOW + SESSION_TTL_MS), false);
  assert.equal(verifySession(token, "b".repeat(40), NOW), false);
  const [version, expires, signature] = token.split(".");
  assert.equal(verifySession(`${version}.${Number(expires) + 60_000}.${signature}`, SECRET, NOW), false);
  assert.equal(verifySession(`${version}.${expires}.${signature.slice(2)}`, SECRET, NOW), false);
  assert.equal(verifySession(`v2.${expires}.${signature}`, SECRET, NOW), false);
  assert.equal(verifySession(undefined, SECRET, NOW), false);
  assert.equal(verifySession("garbage", SECRET, NOW), false);
});

test("AC-004: credentials match only when both fields match", () => {
  const config = { username: "investor", password: "rahasia-panjang" };
  assert.equal(credentialsMatch(config, "investor", "rahasia-panjang"), true);
  assert.equal(credentialsMatch(config, " investor ", "rahasia-panjang"), true);
  assert.equal(credentialsMatch(config, "investor", "rahasia"), false);
  assert.equal(credentialsMatch(config, "admin", "rahasia-panjang"), false);
  assert.equal(credentialsMatch(config, "", ""), false);
});

test("AC-008: production refuses to log in without full configuration", () => {
  const missing = readDemoAuthConfig({}, "production");
  assert.equal(missing.ok, false);
  const shortSecret = readDemoAuthConfig({ DEMO_INVESTOR_USERNAME: "inv", DEMO_INVESTOR_PASSWORD: "pw", SESSION_SECRET: "short" }, "production");
  assert.deepEqual(shortSecret, { ok: false, reason: "SESSION_SECRET minimal 32 karakter." });
  const full = readDemoAuthConfig({ DEMO_INVESTOR_USERNAME: " inv ", DEMO_INVESTOR_PASSWORD: "pw", SESSION_SECRET: SECRET }, "production");
  assert.deepEqual(full, { ok: true, username: "inv", password: "pw", secret: SECRET, usingDevDefaults: false });
});

test("AC-009: development falls back to the documented demo account only when nothing is set", () => {
  const dev = readDemoAuthConfig({}, "development");
  assert.equal(dev.ok, true);
  if (dev.ok) {
    assert.equal(dev.usingDevDefaults, true);
    assert.equal(dev.username, DEV_DEMO_CREDENTIALS.username);
    assert.ok(dev.secret.length >= 32);
  }
  assert.equal(readDemoAuthConfig({ DEMO_INVESTOR_USERNAME: "inv" }, "development").ok, false);
});
