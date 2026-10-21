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
  return salesPoints(filterMonths(null, today), monthly, today);
}

/** Points for the given months; a month without sales is zero and today's month is marked as still running. */
export function salesPoints(months: MonthKey[], monthly: MonthlySales[], today: IsoDate): SalesPoint[] {
  const byMonth = new Map(monthly.map((m) => [m.month, m.revenue]));
  const current = monthKey(toYearMonth(today));
  return months.map((month) => ({ month, revenue: byMonth.get(month) ?? 0, running: month === current }));
}

/** Null shows the last twelve months; a year shows January to December, or up to this month for the current year. */
export type SalesFilter = { year: number; month: number | null } | null;

/** Years the investor can pick, newest first, from the first recorded sale to this year. */
export function availableYears(firstSaleMonth: MonthKey | null, today: IsoDate): number[] {
  const current = toYearMonth(today).year;
  const first = firstSaleMonth ? Math.min(toYearMonth(firstSaleMonth).year, current) : current;
  return Array.from({ length: current - first + 1 }, (_, i) => current - i);
}

type Params = Record<string, string | string[] | undefined>;

/** Reads ?tahun=&bulan= from the URL; anything unknown, out of range, or in the future falls back to the default view. */
export function parseSalesFilter(params: Params, years: number[], today: IsoDate): SalesFilter {
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const year = Number(first(params.tahun));
  if (!Number.isInteger(year) || !years.includes(year)) return null;
  const now = toYearMonth(today);
  const month = Number(first(params.bulan));
  const validMonth = Number.isInteger(month) && month >= 1 && month <= 12 && !(year === now.year && month > now.month);
  return { year, month: validMonth ? month : null };
}

export function filterMonths(filter: SalesFilter, today: IsoDate): MonthKey[] {
  const now = toYearMonth(today);
  if (!filter) return Array.from({ length: 12 }, (_, i) => monthKey(addMonths(now, i - 11)));
  const last = filter.year === now.year ? now.month : 12;
  return Array.from({ length: last }, (_, i) => monthKey({ year: filter.year, month: i + 1 }));
}

export type MonthFocus = MonthChange & { running: boolean };

/** One chosen month against the month before it, which may fall in the previous year. */
export function monthFocus(month: MonthKey, monthly: MonthlySales[], today: IsoDate): MonthFocus {
  const byMonth = new Map(monthly.map((m) => [m.month, m.revenue]));
  const previous = monthKey(addMonths(toYearMonth(month), -1));
  const revenue = byMonth.get(month) ?? 0;
  const previousRevenue = byMonth.get(previous) ?? 0;
  const changeBasisPoints = previousRevenue > 0 ? Math.round(((revenue - previousRevenue) * 10_000) / previousRevenue) : null;
  return { month, revenue, previous, previousRevenue, changeBasisPoints, running: month === monthKey(toYearMonth(today)) };
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
