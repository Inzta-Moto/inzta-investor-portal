#!/usr/bin/env node
// Seeds the local Firestore emulator (project "demo-inzta") for previewing the portal. Refuses to run without an
// emulator host so it can never write to the real Inzta project.
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { buildFixtures } from "./fixtures.mjs";

const host = process.env.FIRESTORE_EMULATOR_HOST;
if (!host) {
  console.error("FIRESTORE_EMULATOR_HOST belum diset; skrip ini hanya untuk emulator lokal.");
  process.exit(1);
}

const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const fx = buildFixtures(today);
initializeApp({ projectId: "demo-inzta" });
const db = getFirestore();

await fetch(`http://${host}/emulator/v1/projects/demo-inzta/databases/(default)/documents`, { method: "DELETE" });
await db.doc("investor_agreement/current").set(fx.agreement);
for (const [id, data] of Object.entries(fx.payments)) await db.doc(`investor_payments/${id}`).set(data);
for (const [id, data] of Object.entries(fx.sales)) await db.doc(`sales/${id}`).set(data);
for (const [id, data] of Object.entries(fx.investorPurchases)) await db.doc(`investor_purchases/${id}`).set(data);
for (const [id, data] of Object.entries(fx.productionPurchases)) await db.doc(`production_purchases/${id}`).set(data);
console.log(
  `Emulator terisi: perjanjian, ${Object.keys(fx.payments).length} pembayaran, ${Object.keys(fx.sales).length} penjualan, ${Object.keys(fx.investorPurchases).length} belanja investasi, ${Object.keys(fx.productionPurchases).length} belanja produksi.`,
);
