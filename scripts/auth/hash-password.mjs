#!/usr/bin/env node
// Prints the INVESTOR_PASSWORD_HASH value for a password typed on stdin, so the password never lands in shell history.
// For .env.local, `npm run env:setup` writes the hash for you.
import { createInterface } from "node:readline";

import { hashPassword } from "../../src/lib/auth/investor-credentials.ts";

const rl = createInterface({ input: process.stdin, output: process.stderr });
rl.question("Kata sandi investor (minimal 8 karakter): ", (password) => {
  rl.close();
  if (password.length < 8) {
    console.error("Kata sandi terlalu pendek; gunakan minimal 8 karakter.");
    process.exit(1);
  }
  if (password.length < 12) console.error("Peringatan: di bawah 12 karakter mudah ditebak; ganti sebelum portal dibuka di internet.");
  console.log(hashPassword(password));
});
