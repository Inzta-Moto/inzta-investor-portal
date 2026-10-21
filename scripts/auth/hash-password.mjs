#!/usr/bin/env node
// Prints the INVESTOR_PASSWORD_HASH value for a password typed on stdin, so the password never lands in shell history.
// For .env.local, `npm run env:setup` writes the hash for you.
import { hashPassword } from "../../src/lib/auth/investor-credentials.ts";
import { createPrompter } from "../env/prompt.mjs";

const prompter = createPrompter();
const password = await prompter.ask("Kata sandi investor (minimal 8 karakter): ", { hidden: true });
prompter.close();
if (password.length < 8) {
  console.error("Kata sandi terlalu pendek; gunakan minimal 8 karakter.");
  process.exit(1);
}
if (password.length < 12) console.error("Peringatan: di bawah 12 karakter mudah ditebak; ganti sebelum portal dibuka di internet.");
console.log(hashPassword(password));
