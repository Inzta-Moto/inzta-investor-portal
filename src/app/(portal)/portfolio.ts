import { requireSession } from "@/lib/auth/session";
import { loadPortfolio } from "@/lib/data/load";
import { parseMockScenario } from "@/lib/data/mock";
import { formatMonth, monthName } from "@/lib/format/dates";
import type { Portfolio } from "@/lib/investment/portfolio";
import { formatRupiah } from "@/lib/money/rupiah";
import type { ChartPoint } from "@/components/portal/sales-chart";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * The data access point checks the session itself: layouts are not re-rendered on client navigation, so a gate
 * only in the layout would let an expired session still receive page data.
 */
export async function portfolioFor(searchParams: SearchParams): Promise<Portfolio> {
  await requireSession();
  return loadPortfolio(parseMockScenario((await searchParams).skenario));
}

export function chartPoints(portfolio: Portfolio): ChartPoint[] {
  return portfolio.sales.points.map((point) => ({
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
