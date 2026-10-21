import assert from "node:assert/strict";
import { test } from "node:test";

import { CONTRACT_TERMS } from "../investment/contract-terms.ts";
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

test("F-006 AC-001: a well-formed agreement document overrides the contract terms", () => {
  const { value, warnings } = toAgreement(agreementDoc);
  assert.deepEqual(warnings, []);
  assert.equal(value.effectiveDate, "2026-11-10");
  assert.deepEqual(value.repayments.map((r) => r.percentBasisPoints), [2500, null, null]);
  assert.deepEqual(value.tranches[1], { number: 2, amount: 50_000_000, receivedDate: null });
});

test("F-006 AC-003: no document means the contract terms, not an error", () => {
  const { value, warnings } = toAgreement(undefined);
  assert.deepEqual(value, CONTRACT_TERMS);
  assert.deepEqual(warnings, []);
  assert.equal(value.commissionRateBasisPoints, 320);
  assert.equal(value.effectiveDate, null);
});

test("a document with only the dates the admin knows keeps every other contract term", () => {
  const { value, warnings } = toAgreement({ effectiveDate: "2026-10-23" });
  assert.deepEqual(warnings, []);
  assert.equal(value.effectiveDate, "2026-10-23");
  assert.equal(value.totalInvestment, 200_000_000);
  assert.deepEqual(value.repayments.map((r) => r.dueMonth), [16, 20, 24]);
});

test("a malformed field keeps the contract value and is reported, never guessed", () => {
  const bad = toAgreement({ ...agreementDoc, effectiveDate: "10/11/2026", totalInvestment: 200_000_000.5, repayments: agreementDoc.repayments.slice(0, 2) });
  assert.equal(bad.value.effectiveDate, null);
  assert.equal(bad.value.totalInvestment, 200_000_000);
  assert.deepEqual(bad.value.repayments, CONTRACT_TERMS.repayments);
  assert.equal(bad.warnings.length, 3);
  assert.equal(toAgreement({ ...agreementDoc, effectiveDate: "" }).value.effectiveDate, null);
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
