import assert from "node:assert/strict";
import { test } from "node:test";

import type { Firestore } from "firebase-admin/firestore";

import { buildPortfolio } from "../investment/portfolio.ts";
import { INDEX_MESSAGE, createFirestoreSource } from "./firestore-source.ts";

// A Firestore stand-in: the agreement and payments read fine, the sales aggregation fails like production did on
// 2026-10-24 (missing composite index). Only the sales section may be affected.
function failingSalesDb(): Firestore {
  const indexError = Object.assign(new Error("9 FAILED_PRECONDITION: The query requires an index."), { code: 9 });
  const salesQuery = {
    where: () => salesQuery,
    aggregate: () => ({ get: () => Promise.reject(indexError) }),
  };
  return {
    doc: () => ({ get: async () => ({ exists: true, data: () => ({ effectiveDate: "2026-07-10" }) }) }),
    collection: (name: string) =>
      name === "sales"
        ? salesQuery
        : { get: async () => ({ docs: [{ id: "c1", data: () => ({ kind: "commission", periodMonth: 1, amount: 6_400_000, paidDate: "2026-08-25" }) }] }) },
  } as unknown as Firestore;
}

test("F-006: when the sales sum fails, the snapshot still carries the agreement and payments", async () => {
  const snapshot = await createFirestoreSource(failingSalesDb()).getSnapshot("2026-10-24", 0);
  assert.equal(snapshot.salesUnavailable, INDEX_MESSAGE);
  assert.deepEqual(snapshot.monthlySales, []);
  assert.equal(snapshot.agreement.effectiveDate, "2026-07-10");
  assert.equal(snapshot.payments.length, 1);
  const portfolio = buildPortfolio(snapshot, "2026-10-24");
  assert.equal(portfolio.sales.unavailable, INDEX_MESSAGE);
  assert.equal(portfolio.commission.totals.received, 6_400_000);
  assert.deepEqual(portfolio.phase, { kind: "running", month: 3 });
});
