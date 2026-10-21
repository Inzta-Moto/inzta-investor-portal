import { BASIS_POINTS } from "./commission.ts";
import { dueWindow } from "./calendar.ts";
import { timeStatus } from "./schedule-status.ts";
import type { Agreement, IsoDate, Payment, ScheduleStatus } from "./types.ts";

export type RepaymentItem = {
  number: 1 | 2 | 3;
  dueMonth: number;
  dueStart: IsoDate | null;
  dueEnd: IsoDate | null;
  percentBasisPoints: number | null;
  /** Null while the admin has not entered the signed percentage; never shown as zero. */
  amount: number | null;
  status: ScheduleStatus;
  paidAmount: number;
  paidDate: IsoDate | null;
};

export type SplitCheck = { ok: true; complete: boolean } | { ok: false; reason: string };

export function validateRepaymentSplit(agreement: Agreement): SplitCheck {
  const values = agreement.repayments.map((r) => r.percentBasisPoints);
  for (const value of values) {
    if (value !== null && (!Number.isInteger(value) || value < 0 || value > BASIS_POINTS)) {
      return { ok: false, reason: "Persentase pengembalian harus bilangan bulat antara 0% dan 100%." };
    }
  }
  if (values.some((value) => value === null)) return { ok: true, complete: false };
  const sum = values.reduce<number>((acc, value) => acc + (value ?? 0), 0);
  if (sum !== BASIS_POINTS) {
    return { ok: false, reason: `Jumlah persentase pengembalian ${formatPercent(sum)}, seharusnya 100%.` };
  }
  return { ok: true, complete: true };
}

// Floors each share; when all three are known the remainder goes to the last one so the total is exact (Pasal 5 ayat 3).
export function repaymentAmounts(agreement: Agreement): (number | null)[] {
  const amounts = agreement.repayments.map((r) =>
    r.percentBasisPoints === null ? null : Math.floor((agreement.totalInvestment * r.percentBasisPoints) / BASIS_POINTS),
  );
  const check = validateRepaymentSplit(agreement);
  if (check.ok && check.complete && amounts.length > 0) {
    const assigned = amounts.reduce<number>((sum, value) => sum + (value ?? 0), 0);
    amounts[amounts.length - 1] = (amounts[amounts.length - 1] ?? 0) + (agreement.totalInvestment - assigned);
  }
  return amounts;
}

export function buildRepaymentSchedule(agreement: Agreement, payments: Payment[], today: IsoDate): RepaymentItem[] {
  const amounts = repaymentAmounts(agreement);
  return agreement.repayments.map((term, index) => {
    const window = agreement.effectiveDate ? dueWindow(agreement.effectiveDate, term.dueMonth) : null;
    const settled = payments.filter((p) => p.kind === "repayment" && p.repaymentNumber === term.number);
    const paidAmount = settled.reduce((sum, p) => sum + p.amount, 0);
    const amount = amounts[index] ?? null;
    let status: ScheduleStatus;
    if (settled.length > 0 && (amount === null || paidAmount >= amount)) status = "paid";
    else if (amount === null) status = "unset";
    else status = timeStatus(window?.end ?? null, today);
    return {
      number: term.number,
      dueMonth: term.dueMonth,
      dueStart: window?.start ?? null,
      dueEnd: window?.end ?? null,
      percentBasisPoints: term.percentBasisPoints,
      amount,
      status,
      paidAmount,
      paidDate: settled.at(-1)?.paidDate ?? null,
    };
  });
}

export type RepaymentTotals = { total: number; returned: number; remaining: number; returnedBasisPoints: number };

/** Returned money comes from recorded payments, not from the schedule. */
export function repaymentTotals(agreement: Agreement, payments: Payment[]): RepaymentTotals {
  const returned = payments.filter((p) => p.kind === "repayment").reduce((sum, p) => sum + p.amount, 0);
  const total = agreement.totalInvestment;
  return {
    total,
    returned,
    remaining: Math.max(0, total - returned),
    returnedBasisPoints: total > 0 ? Math.min(BASIS_POINTS, Math.floor((returned * BASIS_POINTS) / total)) : 0,
  };
}

export function formatPercent(basisPoints: number): string {
  const value = basisPoints / 100;
  return `${Number.isInteger(value) ? value : value.toFixed(2).replace(/0+$/, "")}%`.replace(".", ",");
}
