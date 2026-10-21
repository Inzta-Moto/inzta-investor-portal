import { addMonths, monthKey, toYearMonth } from "./calendar.ts";
import type { IsoDate, MonthKey, MonthlySales } from "./types.ts";

/** Loose shape of an internal dashboard `sales` document; only the fields the revenue rule needs. */
export type SaleLike = {
  date?: unknown;
  revenue?: unknown;
  sellingPrice?: unknown;
  quantity?: unknown;
};

function finite(value: unknown): number | null {
  const number = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;
  return Number.isFinite(number) ? number : null;
}

/**
 * Same priority as `getSaleRevenue` in the internal dashboard: `revenue` when it is a number, otherwise
 * `sellingPrice * quantity`, otherwise 0. Kept identical so portal totals match the dashboard (A-007).
 */
export function saleRevenue(sale: SaleLike): number {
  const revenue = finite(sale.revenue);
  if (revenue !== null) return Math.round(revenue);
  const price = finite(sale.sellingPrice) ?? 0;
  const quantity = finite(sale.quantity) ?? 0;
  return Math.round(price * quantity);
}

export type SalesPoint = { month: MonthKey; revenue: number; running: boolean };

/** Twelve consecutive months ending in today's month; missing months are zero, the last one is still running. */
export function lastTwelveMonths(monthly: MonthlySales[], today: IsoDate): SalesPoint[] {
  const byMonth = new Map(monthly.map((m) => [m.month, m.revenue]));
  const end = toYearMonth(today);
  const points: SalesPoint[] = [];
  for (let offset = -11; offset <= 0; offset += 1) {
    const key = monthKey(addMonths(end, offset));
    points.push({ month: key, revenue: byMonth.get(key) ?? 0, running: offset === 0 });
  }
  return points;
}

export type MonthChange = { month: MonthKey; revenue: number; previous: MonthKey; previousRevenue: number; changeBasisPoints: number | null };

/** Latest complete month against the one before it; null change when the earlier month had no sales. */
export function latestCompleteChange(points: SalesPoint[]): MonthChange | null {
  const complete = points.filter((p) => !p.running);
  if (complete.length < 2) return null;
  const last = complete[complete.length - 1];
  const before = complete[complete.length - 2];
  const changeBasisPoints = before.revenue > 0 ? Math.round(((last.revenue - before.revenue) * 10_000) / before.revenue) : null;
  return { month: last.month, revenue: last.revenue, previous: before.month, previousRevenue: before.revenue, changeBasisPoints };
}
