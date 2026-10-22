import { cache } from "react";

import { addMonths, monthKey, toYearMonth, todayInJakarta } from "../investment/calendar.ts";
import { buildPortfolio, type Portfolio } from "../investment/portfolio.ts";
import { groupFundUsage, type FundUsageMonth } from "../investment/fund-usage.ts";
import { availableYears, filterMonths, monthFocus, parseSalesFilter, salesPoints, type MonthFocus, type SalesFilter, type SalesPoint } from "../investment/sales.ts";
import type { IsoDate } from "../investment/types.ts";
import { InvestorDataError, QUOTA_MESSAGE, isQuotaError } from "./firestore-source.ts";
import { getDataSource } from "./source.ts";

export type PortfolioResult = { ok: true; portfolio: Portfolio; updatedAt: string } | { ok: false; reason: string };

function clockInJakarta(now: Date): string {
  return new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hour12: false }).format(now).replace(":", ".");
}

/**
 * One Firestore read per request, shared by everything that renders it. Missing or malformed admin data becomes a
 * readable message for the page; any other failure goes to the error boundary.
 */
export const loadPortfolio = cache(async (): Promise<PortfolioResult> => {
  const now = new Date();
  const today = todayInJakarta(now);
  try {
    const snapshot = await getDataSource().getSnapshot(today, now.getTime());
    return { ok: true, portfolio: buildPortfolio(snapshot, today), updatedAt: clockInJakarta(now) };
  } catch (error) {
    if (error instanceof InvestorDataError) return { ok: false, reason: error.message };
    if (isQuotaError(error)) return { ok: false, reason: QUOTA_MESSAGE };
    throw error;
  }
});

export type SalesView = { filter: SalesFilter; years: number[]; today: IsoDate; points: SalesPoint[]; focus: MonthFocus | null };

/**
 * The Penjualan chart and table for ?tahun=&bulan=. A chosen month also loads the month before it, which can sit in the
 * previous year, so the comparison line always has both numbers.
 */
export async function loadSalesView(params: Record<string, string | string[] | undefined>): Promise<SalesView> {
  const now = new Date();
  const today = todayInJakarta(now);
  const source = getDataSource();
  const years = availableYears(await source.getFirstSaleMonth(now.getTime()), today);
  const filter = parseSalesFilter(params, years, today);
  const months = filterMonths(filter, today);
  const focusMonth = filter?.month ? monthKey({ year: filter.year, month: filter.month }) : null;
  const previous = focusMonth ? monthKey(addMonths(toYearMonth(focusMonth), -1)) : null;
  const fetch = previous && !months.includes(previous) ? [previous, ...months] : months;
  const monthly = await source.getMonths(fetch, today, now.getTime());
  return { filter, years, today, points: salesPoints(months, monthly, today), focus: focusMonth ? monthFocus(focusMonth, monthly, today) : null };
}

export type FundUsageView = { months: FundUsageMonth[]; skipped: number };

/** The Penggunaan Dana list: marked Belanja Produksi items, newest month first, without any total. */
export async function loadFundUsage(): Promise<FundUsageView> {
  const { items, skipped } = await getDataSource().getFundUsage(Date.now());
  return { months: groupFundUsage(items), skipped };
}
