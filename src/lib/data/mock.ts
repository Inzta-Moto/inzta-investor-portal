import { addMonths, dueWindow, isoDate, monthKey, toYearMonth } from "../investment/calendar.ts";
import type { Agreement, InvestorSnapshot, IsoDate, MonthlySales, Payment } from "../investment/types.ts";
import type { InvestorDataSource } from "./source.ts";

// Sample sales in whole Rupiah for the twelve months ending in the current month (the last value is a partial month).
// These are illustration values, not Inzta figures; every page labels them as sample data while the mock is active.
const SAMPLE_SALES = [
  41_200_000, 38_900_000, 45_600_000, 52_300_000, 47_800_000, 50_100_000,
  55_400_000, 49_700_000, 58_200_000, 61_500_000, 66_800_000, 24_300_000,
];

export type MockScenario = "awal" | "tahun-kedua";

export const MOCK_SCENARIOS: Record<MockScenario, { label: string; month: number; split: (number | null)[]; repaidThrough: number }> = {
  // Early in the agreement, as the portal will look right after signing: percentages not yet entered.
  awal: { label: "Awal kontrak", month: 3, split: [null, null, null], repaidThrough: 0 },
  // Year two with a 25/25/50% split and two repayments received, so the "sudah masuk" cards show real progress.
  "tahun-kedua": { label: "Tahun ke-2", month: 21, split: [2500, 2500, 5000], repaidThrough: 2 },
};

export function parseMockScenario(value: string | string[] | undefined | null): MockScenario {
  return value === "tahun-kedua" ? "tahun-kedua" : "awal";
}

export function mockSnapshot(today: IsoDate, scenario: MockScenario = "awal"): InvestorSnapshot {
  const setup = MOCK_SCENARIOS[scenario];
  const now = toYearMonth(today);
  const effectiveDate = isoDate(addMonths(now, -setup.month), 10);
  const repayMonths = [16, 20, 24] as const;

  const agreement: Agreement = {
    effectiveDate,
    termMonths: 24,
    totalInvestment: 200_000_000,
    commissionRateBasisPoints: 320,
    tranches: [
      { number: 1, amount: 150_000_000, receivedDate: effectiveDate },
      { number: 2, amount: 50_000_000, receivedDate: setup.month > 3 ? isoDate(addMonths(toYearMonth(effectiveDate), 2), 5) : null },
    ],
    repayments: repayMonths.map((dueMonth, index) => ({
      number: (index + 1) as 1 | 2 | 3,
      dueMonth,
      percentBasisPoints: setup.split[index],
    })),
  };

  const payments: Payment[] = [];
  // After the due window closes the sample pays the current month too, so a preview late in the month is not "Terlambat".
  const paidThrough = Number(today.slice(8, 10)) > 26 ? setup.month : setup.month - 1;
  for (let month = 1; month <= paidThrough; month += 1) {
    payments.push({ kind: "commission", periodMonth: month, amount: 6_400_000, paidDate: dueWindow(effectiveDate, month).start });
  }
  for (let index = 0; index < setup.repaidThrough; index += 1) {
    const percent = setup.split[index] ?? 0;
    payments.push({
      kind: "repayment",
      periodMonth: repayMonths[index],
      repaymentNumber: (index + 1) as 1 | 2 | 3,
      amount: (agreement.totalInvestment * percent) / 10_000,
      paidDate: dueWindow(effectiveDate, repayMonths[index]).start,
    });
  }

  const monthlySales: MonthlySales[] = SAMPLE_SALES.map((revenue, index) => ({
    month: monthKey(addMonths(now, index - (SAMPLE_SALES.length - 1))),
    revenue,
  }));

  return { source: "mock", agreement, payments, monthlySales, asOf: today };
}

export function createMockSource(scenario: MockScenario = "awal"): InvestorDataSource {
  return {
    kind: "mock",
    async getSnapshot(today) {
      return mockSnapshot(today, scenario);
    },
  };
}
