import assert from "node:assert/strict";
import { test } from "node:test";

import { toAgreement, toPayment } from "./firestore-mapping.ts";

const agreementDoc = {
  effectiveDate: "2026-11-10",
  termMonths: 24,
  totalInvestment: 200_000_000,
  commissionRateBasisPoints: 320,
  tranches: [
    { amount: 150_000_000, receivedDate: "2026-11-10" },
    { amount: 50_000_000, receivedDate: null },
  ],
  repayments: [
    { dueMonth: 16, percentBasisPoints: 2500 },
    { dueMonth: 20, percentBasisPoints: null },
    { dueMonth: 24, percentBasisPoints: null },
  ],
};

test("F-006 AC-001: a well-formed agreement document maps to the same shape as the mock", () => {
  const mapped = toAgreement(agreementDoc);
  assert.equal(mapped.ok, true);
  if (mapped.ok) {
    assert.equal(mapped.value.effectiveDate, "2026-11-10");
    assert.deepEqual(mapped.value.repayments.map((r) => r.percentBasisPoints), [2500, null, null]);
    assert.deepEqual(mapped.value.tranches[1], { number: 2, amount: 50_000_000, receivedDate: null });
  }
});

test("a missing or malformed agreement is reported, never guessed", () => {
  assert.equal(toAgreement(undefined).ok, false);
  assert.equal(toAgreement({ ...agreementDoc, effectiveDate: "10/11/2026" }).ok, false);
  assert.equal(toAgreement({ ...agreementDoc, totalInvestment: 200_000_000.5 }).ok, false);
  assert.equal(toAgreement({ ...agreementDoc, repayments: agreementDoc.repayments.slice(0, 2) }).ok, false);
  assert.equal(toAgreement({ ...agreementDoc, effectiveDate: "" }).ok, true);
});

test("payments need kind, period, whole amount, and date; repayments need a number", () => {
  assert.deepEqual(toPayment("a", { kind: "commission", periodMonth: 1, amount: 6_400_000, paidDate: "2026-12-25", note: " via BCA " }), {
    ok: true,
    value: { kind: "commission", periodMonth: 1, amount: 6_400_000, paidDate: "2026-12-25", note: "via BCA" },
  });
  assert.equal(toPayment("b", { kind: "repayment", periodMonth: 16, amount: 50_000_000, paidDate: "2028-03-25" }).ok, false);
  assert.equal(toPayment("c", { kind: "commission", periodMonth: 1, amount: "6400000", paidDate: "2026-12-25" }).ok, false);
  assert.equal(toPayment("d", { kind: "bonus", periodMonth: 1, amount: 1, paidDate: "2026-12-25" }).ok, false);
});
