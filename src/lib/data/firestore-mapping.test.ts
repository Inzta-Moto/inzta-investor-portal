import assert from "node:assert/strict";
import { test } from "node:test";

import { CONTRACT_TERMS } from "../investment/contract-terms.ts";
import { toAgreement, toFundUsageItem, toPayment } from "./firestore-mapping.ts";

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
  const { value, invalidFields } = toAgreement(agreementDoc);
  assert.deepEqual(invalidFields, []);
  assert.equal(value.effectiveDate, "2026-11-10");
  assert.deepEqual(value.repayments.map((r) => r.percentBasisPoints), [2500, null, null]);
  assert.deepEqual(value.tranches[1], { number: 2, amount: 50_000_000, receivedDate: null });
});

test("F-006 AC-003: no document means the contract terms, not an error", () => {
  const { value, invalidFields } = toAgreement(undefined);
  assert.deepEqual(value, CONTRACT_TERMS);
  assert.deepEqual(invalidFields, []);
  assert.equal(value.commissionRateBasisPoints, 320);
  assert.equal(value.effectiveDate, null);
});

test("a document with only the dates the admin knows keeps every other contract term", () => {
  const { value, invalidFields } = toAgreement({ effectiveDate: "2026-10-23" });
  assert.deepEqual(invalidFields, []);
  assert.equal(value.effectiveDate, "2026-10-23");
  assert.equal(value.totalInvestment, 200_000_000);
  assert.deepEqual(value.repayments.map((r) => r.dueMonth), [16, 20, 24]);
});

test("a malformed field keeps the contract value and is reported, never guessed", () => {
  const bad = toAgreement({ ...agreementDoc, effectiveDate: "10/11/2026", totalInvestment: 200_000_000.5, repayments: agreementDoc.repayments.slice(0, 2) });
  assert.equal(bad.value.effectiveDate, null);
  assert.equal(bad.value.totalInvestment, 200_000_000);
  assert.deepEqual(bad.value.repayments, CONTRACT_TERMS.repayments);
  assert.deepEqual(bad.invalidFields, ["effectiveDate", "totalInvestment", "repayments"]);
  assert.equal(toAgreement({ ...agreementDoc, effectiveDate: "" }).value.effectiveDate, null);
});

test("repayment rows must keep rising due months, so a reordered or repeated row is not mislabelled", () => {
  const reversed = toAgreement({ repayments: [...agreementDoc.repayments].reverse() });
  assert.deepEqual(reversed.value.repayments, CONTRACT_TERMS.repayments);
  assert.deepEqual(reversed.invalidFields, ["repayments"]);
  const repeated = toAgreement({ repayments: [agreementDoc.repayments[0], agreementDoc.repayments[0], agreementDoc.repayments[2]] });
  assert.deepEqual(repeated.invalidFields, ["repayments"]);
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

test("F-009 AC-005: a Belanja Investasi item keeps the category as typed and the item total as the amount", () => {
  const mapped = toFundUsageItem("p1", { date: "2026-10-17", itemName: " terpal uno ", category: "bahan", quantity: 5, unit: "meter", totalCost: 600_000 });
  assert.deepEqual(mapped, { ok: true, value: { date: "2026-10-17", itemName: "terpal uno", category: "bahan", quantity: 5, unit: "meter", amount: 600_000 } });
});

test("F-009 AC-010: a Belanja Investasi item without a date, name, quantity, or total is skipped", () => {
  for (const broken of [
    { itemName: "kain", quantity: 1, totalCost: 1 },
    { date: "2026-10-17", itemName: "  ", quantity: 1, totalCost: 1 },
    { date: "2026-10-17", itemName: "kain", quantity: 0, totalCost: 1 },
    { date: "2026-10-17", itemName: "kain", quantity: 1, totalCost: "1" },
  ]) {
    assert.equal(toFundUsageItem("p", broken).ok, false);
  }
});
