import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { buildFixtures } from "../../../scripts/emulator/fixtures.mjs";
import { buildPortfolio } from "../investment/portfolio.ts";
import { FUND_USAGE_FIELDS, SALES_FIELDS, adminDb, createFirestoreSource } from "./firestore-source.ts";

// Runs only inside `npm run test:emulator`, which starts the Firestore emulator for project "demo-inzta".
const host = process.env.FIRESTORE_EMULATOR_HOST;
if (!host) throw new Error("FIRESTORE_EMULATOR_HOST is not set; run npm run test:emulator.");

const TODAY = "2026-10-21";
const fx = buildFixtures(TODAY);
const db = adminDb();

async function clear() {
  await fetch(`http://${host}/emulator/v1/projects/demo-inzta/databases/(default)/documents`, { method: "DELETE" });
}

before(async () => {
  await clear();
  await db.doc("investor_agreement/current").set(fx.agreement);
  for (const [id, data] of Object.entries(fx.payments)) await db.doc(`investor_payments/${id}`).set(data);
  for (const [id, data] of Object.entries(fx.sales)) await db.doc(`sales/${id}`).set(data);
  for (const [id, data] of Object.entries(fx.purchases)) await db.doc(`production_purchases/${id}`).set(data);
});

after(clear);

test("F-006: the sales query returns only date, revenue, sellingPrice, quantity", async () => {
  const snap = await db.collection("sales").select(...SALES_FIELDS).get();
  assert.equal(snap.size, 4);
  for (const doc of snap.docs) {
    for (const key of Object.keys(doc.data())) assert.ok((SALES_FIELDS as readonly string[]).includes(key), `unexpected field ${key}`);
  }
});

test("F-006: monthly totals are Firestore sums of revenue per calendar month", async () => {
  const source = createFirestoreSource(db);
  const snapshot = await source.getSnapshot(TODAY, 0);
  const byMonth = new Map(snapshot.monthlySales.map((m) => [m.month, m.revenue]));
  assert.equal(byMonth.get(fx.previous), 165000 + 390000);
  assert.equal(byMonth.get(fx.current), 3 * 295000 + 165000);
  assert.equal(snapshot.monthlySales.length, 12);
  const portfolio = buildPortfolio(snapshot, TODAY);
  assert.deepEqual(portfolio.phase, { kind: "running", month: 3 });
  assert.equal(portfolio.commission.totals.received, 12_800_000);
  assert.deepEqual(portfolio.repayment.items.map((r) => r.amount), [50_000_000, 50_000_000, 100_000_000]);
  assert.equal(JSON.stringify(portfolio).includes("Pelanggan"), false);
});

test("F-006: on the first of the month a sale dated yesterday still counts in the previous month", async () => {
  const [year, month] = fx.current.split("-").map(Number);
  const lastOfPrevious = new Date(Date.UTC(year, month - 1, 0)).toISOString().slice(0, 10);
  await db.doc("sales/sale-boundary").set({ date: lastOfPrevious, revenue: 70000, quantity: 1, sellingPrice: 70000 });
  const snapshot = await createFirestoreSource(db).getSnapshot(`${fx.current}-01`, 0);
  await db.doc("sales/sale-boundary").delete();
  const byMonth = new Map(snapshot.monthlySales.map((m) => [m.month, m.revenue]));
  assert.equal(byMonth.get(fx.previous), 165000 + 390000 + 70000);
  assert.equal(byMonth.get(fx.current), 3 * 295000 + 165000);
});

test("F-006: a backdated sale in an older day appears within the one-hour settled cache", async () => {
  const source = createFirestoreSource(db);
  const before = await source.getSnapshot(TODAY, 0);
  await db.doc("sales/sale-late").set({ date: `${fx.previous}-09`, revenue: 80000, quantity: 1, sellingPrice: 80000 });
  const previous = (s: typeof before) => s.monthlySales.find((m) => m.month === fx.previous)?.revenue ?? 0;
  assert.equal(previous(await source.getSnapshot(TODAY, 30 * 60_000)), previous(before));
  assert.equal(previous(await source.getSnapshot(TODAY, 61 * 60_000)), previous(before) + 80000);
  await db.doc("sales/sale-late").delete();
});

test("F-006: a sale dated today shows up once the 25-second live cache expires", async () => {
  const source = createFirestoreSource(db);
  const before = await source.getSnapshot(TODAY, 0);
  await db.doc("sales/sale-e").set({ date: `${fx.current}-20`, revenue: 500000, quantity: 1, sellingPrice: 500000, customer: "Pelanggan E" });
  const cached = await source.getSnapshot(TODAY, 20_000);
  const fresh = await source.getSnapshot(TODAY, 26_000);
  const current = (s: typeof before) => s.monthlySales.find((m) => m.month === fx.current)?.revenue;
  assert.equal(current(cached), current(before));
  assert.equal(current(fresh), (current(before) ?? 0) + 500000);
});

test("F-006: a payment recorded by the admin appears after the 25-second cache", async () => {
  const source = createFirestoreSource(db);
  await source.getSnapshot(TODAY, 0);
  await db.doc("investor_payments/commission-3").set({ kind: "commission", periodMonth: 3, amount: 6400000, paidDate: "2026-10-25" });
  const fresh = buildPortfolio(await source.getSnapshot(TODAY, 26_000), TODAY);
  assert.equal(fresh.commission.items[2].status, "paid");
});

test("F-006: without an agreement document the portal runs on the contract terms and real sales", async () => {
  const withAgreement = await createFirestoreSource(db).getSnapshot(TODAY, 0);
  await db.doc("investor_agreement/current").delete();
  const snapshot = await createFirestoreSource(db).getSnapshot(TODAY, 0);
  const portfolio = buildPortfolio(snapshot, TODAY);
  assert.deepEqual(portfolio.phase, { kind: "unsigned" });
  assert.equal(portfolio.commission.totals.perMonth, 6_400_000);
  // Sales do not depend on the agreement: the same months and totals as a moment earlier, with the document present.
  assert.deepEqual(snapshot.monthlySales, withAgreement.monthlySales);
  assert.ok((snapshot.monthlySales.find((m) => m.month === fx.current)?.revenue ?? 0) > 0);
  await db.doc("investor_agreement/current").set(fx.agreement);
});

test("F-007: the year filter gets the first sale month and totals for any months", async () => {
  const source = createFirestoreSource(db);
  assert.equal(await source.getFirstSaleMonth(0), fx.previous);
  const snapshot = await source.getSnapshot(TODAY, 0);
  const months = await source.getMonths([fx.previous, fx.current], TODAY, 0);
  assert.deepEqual(months.map((m) => m.month), [fx.previous, fx.current]);
  // Same numbers as the twelve-month view, so the filter never disagrees with the default chart.
  for (const month of months) assert.equal(month.revenue, snapshot.monthlySales.find((m) => m.month === month.month)?.revenue);
  const empty = await source.getMonths(["2020-01"], TODAY, 0);
  assert.deepEqual(empty, [{ month: "2020-01", revenue: 0 }]);
});


test("F-009 AC-009: only marked purchases arrive, with only the six fund usage fields", async () => {
  const snap = await db.collection("production_purchases").where("investorAgreementId", "==", "current").select(...FUND_USAGE_FIELDS).get();
  assert.equal(snap.size, 2);
  for (const doc of snap.docs) {
    for (const key of Object.keys(doc.data())) assert.ok((FUND_USAGE_FIELDS as readonly string[]).includes(key), `unexpected field ${key}`);
  }
  const { items, skipped } = await createFirestoreSource(db).getFundUsage(0);
  assert.equal(skipped, 0);
  assert.deepEqual(items.map((i) => i.itemName).sort(), ["Kain canvas", "Listrik"]);
  assert.equal(JSON.stringify(items).includes("transfer"), false);
});

test("F-009 AC-007: unmarking a purchase removes it once the 25-second cache expires", async () => {
  const source = createFirestoreSource(db);
  assert.equal((await source.getFundUsage(0)).items.length, 2);
  // Rewriting the document without the marker is what the ERP's unmark does to the portal; firebase-admin stays in firestore-source.ts.
  const unmarked: Record<string, unknown> = { ...fx.purchases["purchase-b"] };
  delete unmarked.investorAgreementId;
  await db.doc("production_purchases/purchase-b").set(unmarked);
  assert.equal((await source.getFundUsage(10_000)).items.length, 2);
  assert.equal((await source.getFundUsage(26_000)).items.length, 1);
  await db.doc("production_purchases/purchase-b").set(fx.purchases["purchase-b"]);
});
