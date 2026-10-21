import assert from "node:assert/strict";
import { test } from "node:test";

import { DEV_CREDENTIALS, credentialsMatch, hashPassword, parseScryptHash, readCredentialConfig, sessionKey, verifyPassword } from "./investor-credentials.ts";
import { SESSION_TTL_MS, signSession, verifySession } from "./session-token.ts";

const SECRET = "a".repeat(40);
const NOW = Date.UTC(2027, 0, 14, 3, 0, 0);
const HASH = hashPassword("kata-sandi-investor", Buffer.from("0123456789abcdef"));

test("a fresh token verifies; tampered, expired, or foreign tokens do not", () => {
  const token = signSession(SECRET, NOW);
  assert.equal(verifySession(token, SECRET, NOW + 1000), true);
  assert.equal(verifySession(token, SECRET, NOW + SESSION_TTL_MS), false);
  assert.equal(verifySession(token, "b".repeat(40), NOW), false);
  const [version, expires, signature] = token.split(".");
  assert.equal(verifySession(`${version}.${Number(expires) + 60_000}.${signature}`, SECRET, NOW), false);
  assert.equal(verifySession(`${version}.${expires}.${signature.slice(2)}`, SECRET, NOW), false);
  assert.equal(verifySession(undefined, SECRET, NOW), false);
  assert.equal(verifySession("garbage", SECRET, NOW), false);
});

test("scrypt hashes verify only the original password and reject malformed hashes", async () => {
  assert.match(HASH, /^scrypt\$16384\$8\$1\$/);
  assert.equal(await verifyPassword("kata-sandi-investor", HASH), true);
  assert.equal(await verifyPassword("kata-sandi-lain", HASH), false);
  assert.equal(await verifyPassword("kata-sandi-investor", "plain-text"), false);
  assert.equal(await verifyPassword("kata-sandi-investor", HASH.replace(/\$[^$]+$/, "$AAAA")), false);
});

test("hash parameters scrypt would refuse are rejected up front instead of crashing the login", () => {
  assert.notEqual(parseScryptHash(HASH), null);
  assert.equal(parseScryptHash(HASH.replace("$16384$", "$100000$")), null);
  assert.equal(parseScryptHash(HASH.replace("$16384$", "$1048576$")), null);
  assert.equal(parseScryptHash(HASH.split("$").slice(0, 5).join("$")), null);
  const bad = readCredentialConfig({ INVESTOR_USERNAME: "inv", INVESTOR_PASSWORD_HASH: HASH.replace("$16384$", "$100000$"), SESSION_SECRET: SECRET }, "production");
  assert.equal(bad.ok, false);
});

test("changing the password or username changes the session key, which signs out old cookies", () => {
  const config = { username: "inv", passwordHash: HASH, secret: SECRET };
  const token = signSession(sessionKey(config), NOW);
  assert.equal(verifySession(token, sessionKey(config), NOW), true);
  const rotated = hashPassword("kata-sandi-baru-2027", Buffer.from("fedcba9876543210"));
  assert.equal(verifySession(token, sessionKey({ ...config, passwordHash: rotated }), NOW), false);
  assert.equal(verifySession(token, sessionKey({ ...config, username: "lain" }), NOW), false);
});

test("credentials match only when both username and password match", async () => {
  const config = { username: "herlambang", passwordHash: HASH };
  assert.equal(await credentialsMatch(config, "herlambang", "kata-sandi-investor"), true);
  assert.equal(await credentialsMatch(config, " herlambang ", "kata-sandi-investor"), true);
  assert.equal(await credentialsMatch(config, "herlambang", "salah"), false);
  assert.equal(await credentialsMatch(config, "admin", "kata-sandi-investor"), false);
});

test("production refuses to log in without a full, hashed configuration", () => {
  assert.equal(readCredentialConfig({}, "production").ok, false);
  assert.deepEqual(readCredentialConfig({ INVESTOR_USERNAME: "inv", INVESTOR_PASSWORD_HASH: HASH, SESSION_SECRET: "short" }, "production"), {
    ok: false,
    reason: "SESSION_SECRET minimal 32 karakter.",
  });
  assert.equal(readCredentialConfig({ INVESTOR_USERNAME: "inv", INVESTOR_PASSWORD_HASH: "rahasia", SESSION_SECRET: SECRET }, "production").ok, false);
  const full = readCredentialConfig({ INVESTOR_USERNAME: " inv ", INVESTOR_PASSWORD_HASH: HASH, SESSION_SECRET: SECRET }, "production");
  assert.deepEqual(full, { ok: true, username: "inv", passwordHash: HASH, secret: SECRET, usingDevDefaults: false });
});

test("development falls back to the documented account only when nothing is set", async () => {
  const dev = readCredentialConfig({}, "development");
  assert.equal(dev.ok, true);
  if (dev.ok) {
    assert.equal(dev.usingDevDefaults, true);
    assert.equal(await credentialsMatch(dev, DEV_CREDENTIALS.username, DEV_CREDENTIALS.password), true);
  }
  assert.equal(readCredentialConfig({ INVESTOR_USERNAME: "inv" }, "development").ok, false);
});
