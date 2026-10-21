import assert from "node:assert/strict";
import { test } from "node:test";

import { buildRepaymentSchedule, formatPercent, repaymentAmounts, repaymentTotals, validateRepaymentSplit } from "./repayment.ts";
import type { Agreement, Payment } from "./types.ts";

function agreement(split: (number | null)[]): Agreement {
  return {
    effectiveDate: "2026-11-10",
    termMonths: 24,
    totalInvestment: 200_000_000,
    commissionRateBasisPoints: 320,
    tranches: [],
    repayments: [
      { number: 1, dueMonth: 16, percentBasisPoints: split[0] },
      { number: 2, dueMonth: 20, percentBasisPoints: split[1] },
      { number: 3, dueMonth: 24, percentBasisPoints: split[2] },
    ],
  };
}

test("AC-005: 25/25/50% of Rp200 jt", () => {
  assert.deepEqual(repaymentAmounts(agreement([2500, 2500, 5000])), [50_000_000, 50_000_000, 100_000_000]);
});

test("a split that does not divide evenly still totals exactly Rp200 jt", () => {
  const amounts = repaymentAmounts(agreement([3333, 3333, 3334]));
  assert.equal(amounts.reduce<number>((sum, value) => sum + (value ?? 0), 0), 200_000_000);
});

test("AC-006: unset percentages stay null and read as unset, never zero", () => {
  const schedule = buildRepaymentSchedule(agreement([null, null, null]), [], "2028-03-10");
  assert.deepEqual(schedule.map((item) => item.amount), [null, null, null]);
  assert.deepEqual(schedule.map((item) => item.status), ["unset", "unset", "unset"]);
  assert.equal(schedule[0].dueStart, "2028-03-25");
  assert.equal(schedule[2].dueEnd, "2028-11-26");
});

test("AC-007: a complete split that is not 100% is reported", () => {
  const check = validateRepaymentSplit(agreement([2500, 2500, 4000]));
  assert.equal(check.ok, false);
  if (!check.ok) assert.match(check.reason, /90%/);
  assert.deepEqual(validateRepaymentSplit(agreement([2500, null, null])), { ok: true, complete: false });
  assert.equal(validateRepaymentSplit(agreement([12000, null, null])).ok, false);
});

test("AC-008: returned and remaining come from recorded repayments", () => {
  const payments: Payment[] = [
    { kind: "commission", periodMonth: 16, amount: 6_400_000, paidDate: "2028-03-25" },
    { kind: "repayment", periodMonth: 16, repaymentNumber: 1, amount: 50_000_000, paidDate: "2028-03-25" },
  ];
  assert.deepEqual(repaymentTotals(agreement([2500, 2500, 5000]), payments), {
    total: 200_000_000,
    returned: 50_000_000,
    remaining: 150_000_000,
    returnedBasisPoints: 2500,
  });
  const schedule = buildRepaymentSchedule(agreement([2500, 2500, 5000]), payments, "2028-04-01");
  assert.equal(schedule[0].status, "paid");
  assert.equal(schedule[0].paidAmount, 50_000_000);
  assert.equal(schedule[1].status, "upcoming");
});

test("an underpaid repayment is not shown as paid", () => {
  const payments: Payment[] = [{ kind: "repayment", periodMonth: 16, repaymentNumber: 1, amount: 20_000_000, paidDate: "2028-03-25" }];
  const schedule = buildRepaymentSchedule(agreement([2500, 2500, 5000]), payments, "2028-03-26");
  assert.equal(schedule[0].status, "due");
  assert.equal(schedule[0].paidAmount, 20_000_000);
});

test("a set repayment follows the same due and late rule as commission", () => {
  const schedule = buildRepaymentSchedule(agreement([2500, 2500, 5000]), [], "2028-03-27");
  assert.equal(schedule[0].status, "late");
});

test("percent labels use a decimal comma", () => {
  assert.equal(formatPercent(2500), "25%");
  assert.equal(formatPercent(3333), "33,33%");
});
