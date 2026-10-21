import { cache } from "react";

import { todayInJakarta } from "../investment/calendar.ts";
import { buildPortfolio, type Portfolio } from "../investment/portfolio.ts";
import { InvestorDataError } from "./firestore-source.ts";
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
    throw error;
  }
});
