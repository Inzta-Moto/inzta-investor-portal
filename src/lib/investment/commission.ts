import { dueWindow } from "./calendar.ts";
import { timeStatus } from "./schedule-status.ts";
import type { Agreement, IsoDate, Payment, ScheduleStatus } from "./types.ts";

export type CommissionItem = {
  month: number;
  dueStart: IsoDate | null;
  dueEnd: IsoDate | null;
  amount: number;
  status: Exclude<ScheduleStatus, "unset">;
  paidDate: IsoDate | null;
  /** Repayment number settled together with this month's commission, if any. */
  withRepayment: 1 | 2 | 3 | null;
};

export const BASIS_POINTS = 10_000;

/** Flat 3.2% of the full investment every month, independent of tranches and repayments (Pasal 4). */
export function monthlyCommission(agreement: Agreement): number {
  return Math.floor((agreement.totalInvestment * agreement.commissionRateBasisPoints) / BASIS_POINTS);
}

export function buildCommissionSchedule(agreement: Agreement, payments: Payment[], today: IsoDate): CommissionItem[] {
  const amount = monthlyCommission(agreement);
  const paid = paidByMonth(payments);
  const items: CommissionItem[] = [];
  for (let month = 1; month <= agreement.termMonths; month += 1) {
    const window = agreement.effectiveDate ? dueWindow(agreement.effectiveDate, month) : null;
    const payment = paid.get(month);
    const settled = payment !== undefined && payment.amount >= amount;
    const repayment = agreement.repayments.find((r) => r.dueMonth === month);
    items.push({
      month,
      dueStart: window?.start ?? null,
      dueEnd: window?.end ?? null,
      amount,
      status: settled ? "paid" : timeStatus(window?.end ?? null, today),
      paidDate: settled ? payment.paidDate : null,
      withRepayment: repayment?.number ?? null,
    });
  }
  return items;
}

/** Sums commission payments per agreement month; the latest date is kept as the paid date. */
function paidByMonth(payments: Payment[]): Map<number, { amount: number; paidDate: IsoDate }> {
  const byMonth = new Map<number, { amount: number; paidDate: IsoDate }>();
  for (const p of payments) {
    if (p.kind !== "commission") continue;
    const previous = byMonth.get(p.periodMonth);
    byMonth.set(p.periodMonth, {
      amount: (previous?.amount ?? 0) + p.amount,
      paidDate: previous && previous.paidDate > p.paidDate ? previous.paidDate : p.paidDate,
    });
  }
  return byMonth;
}

export type CommissionTotals = {
  perMonth: number;
  total: number;
  received: number;
  paidMonths: number;
  remaining: number;
};

export function commissionTotals(agreement: Agreement, payments: Payment[]): CommissionTotals {
  const perMonth = monthlyCommission(agreement);
  const total = perMonth * agreement.termMonths;
  const commissions = payments.filter((p) => p.kind === "commission");
  const received = commissions.reduce((sum, p) => sum + p.amount, 0);
  const paidMonths = [...paidByMonth(payments).values()].filter((p) => p.amount >= perMonth).length;
  return { perMonth, total, received, paidMonths, remaining: Math.max(0, total - received) };
}
