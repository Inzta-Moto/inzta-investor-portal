import { agreementPhase, type AgreementPhase } from "./calendar.ts";
import { buildCommissionSchedule, commissionTotals, type CommissionItem, type CommissionTotals } from "./commission.ts";
import { buildRepaymentSchedule, repaymentTotals, validateRepaymentSplit, type RepaymentItem, type RepaymentTotals } from "./repayment.ts";
import { lastTwelveMonths, latestCompleteChange, type MonthChange, type SalesPoint } from "./sales.ts";
import type { DataSourceKind, IsoDate, InvestorSnapshot } from "./types.ts";

export type Portfolio = {
  source: DataSourceKind;
  asOf: IsoDate;
  today: IsoDate;
  effectiveDate: IsoDate | null;
  termMonths: number;
  totalInvestment: number;
  phase: AgreementPhase;
  commission: { items: CommissionItem[]; totals: CommissionTotals; current: CommissionItem | null };
  repayment: { items: RepaymentItem[]; totals: RepaymentTotals; next: RepaymentItem | null };
  sales: { points: SalesPoint[]; change: MonthChange | null };
  warnings: string[];
};

/** Everything the four portal pages render, computed once per request from the snapshot. */
export function buildPortfolio(snapshot: InvestorSnapshot, today: IsoDate): Portfolio {
  const { agreement, payments } = snapshot;
  const phase = agreementPhase(agreement.effectiveDate, today, agreement.termMonths);
  const items = buildCommissionSchedule(agreement, payments, today);
  const repayments = buildRepaymentSchedule(agreement, payments, today);
  const points = lastTwelveMonths(snapshot.monthlySales, today);
  const warnings: string[] = [];
  const split = validateRepaymentSplit(agreement);
  if (!split.ok) warnings.push(split.reason);

  const current = phase.kind === "running" ? (items[phase.month - 1] ?? null) : null;
  return {
    source: snapshot.source,
    asOf: snapshot.asOf,
    today,
    effectiveDate: agreement.effectiveDate,
    termMonths: agreement.termMonths,
    totalInvestment: agreement.totalInvestment,
    phase,
    commission: { items, totals: commissionTotals(agreement, payments), current },
    repayment: { items: repayments, totals: repaymentTotals(agreement, payments), next: repayments.find((r) => r.status !== "paid") ?? null },
    sales: { points, change: latestCompleteChange(points) },
    warnings,
  };
}
