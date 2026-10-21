import type { Portfolio } from "../investment/portfolio.ts";
import type { SalesPoint } from "../investment/sales.ts";
import { formatRupiah } from "../money/rupiah.ts";
import { formatMonth, monthName } from "./dates.ts";

export type ChartPoint = { month: string; short: string; label: string; revenue: number; amount: string; running: boolean };

/** Display-ready chart points for the sales chart. */
export function chartPoints(portfolio: Portfolio): ChartPoint[] {
  return toChartPoints(portfolio.sales.points);
}

export function toChartPoints(points: SalesPoint[]): ChartPoint[] {
  return points.map((point) => ({
    month: point.month,
    short: monthName(point.month),
    label: formatMonth(point.month, "long"),
    revenue: point.revenue,
    amount: formatRupiah(point.revenue),
    running: point.running,
  }));
}

export function phaseSubtitle(portfolio: Portfolio): string {
  const { phase, termMonths, today } = portfolio;
  const month = formatMonth(today.slice(0, 7), "long");
  if (phase.kind === "running") return `Bulan ke-${phase.month} dari ${termMonths} · ${month}`;
  if (phase.kind === "before") return `Perjanjian dimulai, komisi pertama bulan depan · ${month}`;
  if (phase.kind === "ended") return `Masa ${termMonths} bulan sudah selesai`;
  return "Perjanjian belum aktif";
}
