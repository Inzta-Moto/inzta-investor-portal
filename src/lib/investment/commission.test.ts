import assert from "node:assert/strict";
import { test } from "node:test";

import { agreementPhase, dueWindow, todayInJakarta } from "./calendar.ts";
import { buildCommissionSchedule, commissionTotals, monthlyCommission } from "./commission.ts";
import type { Agreement, Payment } from "./types.ts";

function agreement(overrides: Partial<Agreement> = {}): Agreement {
  return {
    effectiveDate: "2026-11-10",
    termMonths: 24,
    totalInvestment: 200_000_000,
    commissionRateBasisPoints: 320,
    tranches: [],
    repayments: [
      { number: 1, dueMonth: 16, percentBasisPoints: null },
      { number: 2, dueMonth: 20, percentBasisPoints: null },
      { number: 3, dueMonth: 24, percentBasisPoints: null },
    ],
    ...overrides,
  };
}

test("AC-001: flat 3.2% of Rp200 jt is Rp6.400.000 a month and Rp153.600.000 in total", () => {
  assert.equal(monthlyCommission(agreement()), 6_400_000);
  assert.equal(commissionTotals(agreement(), []).total, 153_600_000);
});

test("AC-002: month 1 falls in the month after the Effective Date, month 24 two years later", () => {
  assert.deepEqual(dueWindow("2026-11-10", 1), { start: "2026-12-25", end: "2026-12-26" });
  assert.deepEqual(dueWindow("2026-11-10", 24), { start: "2028-11-25", end: "2028-11-26" });
  const schedule = buildCommissionSchedule(agreement(), [], "2026-11-20");
  assert.equal(schedule.length, 24);
  assert.equal(schedule[0].dueStart, "2026-12-25");
  assert.equal(schedule[15].withRepayment, 1);
  assert.equal(schedule[23].withRepayment, 3);
});

test("AC-003: paid, due until the 26th, late afterwards, upcoming before the month", () => {
  const payments: Payment[] = [{ kind: "commission", periodMonth: 1, amount: 6_400_000, paidDate: "2026-12-25" }];
  const onTheDay = buildCommissionSchedule(agreement(), payments, "2027-01-26");
  assert.equal(onTheDay[0].status, "paid");
  assert.equal(onTheDay[0].paidDate, "2026-12-25");
  assert.equal(onTheDay[1].status, "due");
  assert.equal(onTheDay[2].status, "upcoming");
  const dayAfter = buildCommissionSchedule(agreement(), payments, "2027-01-27");
  assert.equal(dayAfter[1].status, "late");
  const nextMonth = buildCommissionSchedule(agreement(), payments, "2027-02-01");
  assert.equal(nextMonth[1].status, "late");
  assert.equal(nextMonth[2].status, "due");
});

test("AC-004: without an Effective Date the schedule has 24 undated upcoming rows", () => {
  const schedule = buildCommissionSchedule(agreement({ effectiveDate: null }), [], "2026-10-21");
  assert.equal(schedule.length, 24);
  assert.ok(schedule.every((item) => item.dueStart === null && item.status === "upcoming"));
});

test("AC-009: running month, before the first commission month, and after the term", () => {
  assert.deepEqual(agreementPhase("2026-11-10", "2027-01-14", 24), { kind: "running", month: 2 });
  assert.deepEqual(agreementPhase("2026-11-10", "2026-11-30", 24), { kind: "before" });
  assert.deepEqual(agreementPhase("2026-11-10", "2028-11-30", 24), { kind: "running", month: 24 });
  assert.deepEqual(agreementPhase("2026-11-10", "2028-12-01", 24), { kind: "ended" });
  assert.deepEqual(agreementPhase(null, "2027-01-14", 24), { kind: "unsigned" });
});

test("totals count received commission from payments only", () => {
  const payments: Payment[] = [
    { kind: "commission", periodMonth: 1, amount: 6_400_000, paidDate: "2026-12-25" },
    { kind: "commission", periodMonth: 2, amount: 6_400_000, paidDate: "2027-01-25" },
    { kind: "repayment", periodMonth: 16, repaymentNumber: 1, amount: 50_000_000, paidDate: "2028-03-25" },
  ];
  assert.deepEqual(commissionTotals(agreement(), payments), {
    perMonth: 6_400_000,
    total: 153_600_000,
    received: 12_800_000,
    paidMonths: 2,
    remaining: 140_800_000,
  });
});

test("a partial or duplicated payment does not over-count", () => {
  const payments: Payment[] = [
    { kind: "commission", periodMonth: 1, amount: 3_200_000, paidDate: "2026-12-25" },
    { kind: "commission", periodMonth: 2, amount: 6_400_000, paidDate: "2027-01-25" },
    { kind: "commission", periodMonth: 2, amount: 6_400_000, paidDate: "2027-01-26" },
  ];
  const schedule = buildCommissionSchedule(agreement(), payments, "2027-01-20");
  assert.equal(schedule[0].status, "late");
  assert.equal(schedule[1].status, "paid");
  assert.equal(schedule[1].paidDate, "2027-01-26");
  assert.equal(commissionTotals(agreement(), payments).paidMonths, 1);
  const topUp = [...payments, { kind: "commission" as const, periodMonth: 1, amount: 3_200_000, paidDate: "2027-01-02" }];
  assert.equal(buildCommissionSchedule(agreement(), topUp, "2027-01-20")[0].status, "paid");
});

test("today is taken in Jakarta, so 23:30 UTC already counts as the next day", () => {
  assert.equal(todayInJakarta(new Date("2027-01-25T18:00:00Z")), "2027-01-26");
  assert.equal(todayInJakarta(new Date("2027-01-25T16:59:00Z")), "2027-01-25");
});
