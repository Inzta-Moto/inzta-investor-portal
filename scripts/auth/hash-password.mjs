#!/usr/bin/env node
// Prints the INVESTOR_PASSWORD_HASH value for a password typed on stdin, so the password never lands in shell history.
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";

const rl = createInterface({ input: process.stdin, output: process.stderr });
rl.question("Kata sandi investor (minimal 12 karakter): ", (password) => {
  rl.close();
  if (password.length < 12) {
    console.error("Kata sandi terlalu pendek; gunakan minimal 12 karakter.");
    process.exit(1);
  }
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32, { N: 16384, r: 8, p: 1 });
  console.log(["scrypt", 16384, 8, 1, salt.toString("base64"), hash.toString("base64")].join("$"));
});
