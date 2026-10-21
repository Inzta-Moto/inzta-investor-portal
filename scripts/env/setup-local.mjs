#!/usr/bin/env node
// Fills .env.local for the portal without ever printing a value: investor login, session secret, project id, and,
// when given a downloaded key file, the service account. Run it yourself; agents never read .env files.
//
//   npm run env:setup
//   npm run env:setup -- --service-account C:\path\to\inzta-5244e-key.json
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";

import { hashPassword } from "../../src/lib/auth/investor-credentials.ts";
import { removeKeys, upsertEnv } from "./env-file.mjs";

const PROJECT_ID = "inzta-5244e";
const ENV_FILE = ".env.local";
// Variables from the mock era (ADR-0004, ADR-0005) that the app no longer reads; DEMO_INVESTOR_PASSWORD is plain text.
const OBSOLETE = [
  "INVESTOR_DATA_SOURCE",
  "DEMO_INVESTOR_USERNAME",
  "DEMO_INVESTOR_PASSWORD",
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function readServiceAccount(path) {
  const key = JSON.parse(readFileSync(path, "utf8"));
  if (key.type !== "service_account" || !key.client_email || !key.private_key) {
    throw new Error("Berkas itu bukan kunci service account Firebase (JSON dari Project settings, Service accounts).");
  }
  if (key.project_id !== PROJECT_ID) throw new Error(`Kunci ini untuk project ${key.project_id}, bukan ${PROJECT_ID}.`);
  return { clientEmail: key.client_email, privateKey: key.private_key };
}

// Reads one line per prompt from a terminal or a pipe; readline/promises loses piped lines between questions.
async function askAll(prompts) {
  const rl = createInterface({ input: process.stdin, output: process.stderr, terminal: Boolean(process.stdin.isTTY) });
  const lines = rl[Symbol.asyncIterator]();
  const answers = [];
  for (const prompt of prompts) {
    process.stderr.write(prompt);
    const { value, done } = await lines.next();
    answers.push(done ? "" : value);
  }
  rl.close();
  return answers;
}

const keyPath = argValue("--service-account");
const serviceAccount = keyPath ? readServiceAccount(keyPath) : null;

const [typedUsername, password] = await askAll(["Username investor [investor@inzta.id]: ", "Kata sandi investor: "]);
const username = typedUsername.trim() || "investor@inzta.id";
if (password.length < 8) {
  console.error("Kata sandi minimal 8 karakter.");
  process.exit(1);
}

const original = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, "utf8") : "";
const existingSecret = /^\s*SESSION_SECRET\s*=\s*"?([^"\r\n]*)"?\s*$/m.exec(original)?.[1] ?? "";

const values = {
  INVESTOR_USERNAME: username,
  INVESTOR_PASSWORD_HASH: hashPassword(password),
  // An existing strong secret is kept so devices already signed in stay signed in.
  SESSION_SECRET: existingSecret.length >= 32 ? existingSecret : randomBytes(32).toString("hex"),
  FIREBASE_PROJECT_ID: PROJECT_ID,
};
if (serviceAccount) {
  values.FIREBASE_CLIENT_EMAIL = serviceAccount.clientEmail;
  values.FIREBASE_PRIVATE_KEY = serviceAccount.privateKey;
}

// With a real key the portal should read production, so an emulator host left in the file would silently win.
const toRemove = serviceAccount ? [...OBSOLETE, "FIRESTORE_EMULATOR_HOST"] : OBSOLETE;
const { text: cleaned, removed } = removeKeys(original, toRemove);
writeFileSync(ENV_FILE, upsertEnv(cleaned, values), { encoding: "utf8", mode: 0o600 });

console.log(`${ENV_FILE} diperbarui: ${Object.keys(values).join(", ")}.`);
if (removed.length) console.log(`Dihapus karena tidak dipakai lagi: ${removed.join(", ")}.`);
if (password.length < 12) console.log("Peringatan: kata sandi di bawah 12 karakter mudah ditebak; ganti sebelum portal dibuka di internet.");
if (!serviceAccount) {
  console.log("Kunci service account belum diisi: unduh dari Firebase Console, lalu jalankan lagi dengan --service-account <berkas.json>.");
}
