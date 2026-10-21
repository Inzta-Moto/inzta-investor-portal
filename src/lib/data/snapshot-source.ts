import { CONTRACT_TERMS } from "../investment/contract-terms.ts";
import { addMonths, monthKey, toYearMonth } from "../investment/calendar.ts";
import type { InvestorSnapshot, IsoDate, MonthKey, MonthlySales } from "../investment/types.ts";

/**
 * Monthly sales totals read from `database-inzta` on 2026-10-21 and confirmed equal to the ERP dashboard by Sehan.
 * Served only while Firestore refuses reads because the shared Spark quota is used up, so the portal keeps working
 * for the investor; the page then says "Data per 21 Okt 2026" instead of "Data langsung".
 */
export const SNAPSHOT_AS_OF: IsoDate = "2026-10-21";

const SNAPSHOT_SALES: MonthlySales[] = [
  { month: "2026-05", revenue: 11_365_000 },
  { month: "2026-06", revenue: 79_644_131 },
  { month: "2026-07", revenue: 105_080_710 },
  { month: "2026-08", revenue: 97_330_669 },
  { month: "2026-09", revenue: 111_244_737 },
  { month: "2026-10", revenue: 44_575_650 },
];

function totals(months: MonthKey[]): MonthlySales[] {
  const byMonth = new Map(SNAPSHOT_SALES.map((m) => [m.month, m.revenue]));
  return months.map((month) => ({ month, revenue: byMonth.get(month) ?? 0 }));
}

export const snapshotSource = {
  async getSnapshot(today: IsoDate): Promise<InvestorSnapshot> {
    const months = Array.from({ length: 12 }, (_, i) => monthKey(addMonths(toYearMonth(today), i - 11)));
    return { source: "snapshot", agreement: structuredClone(CONTRACT_TERMS), payments: [], monthlySales: totals(months), asOf: SNAPSHOT_AS_OF, warnings: [] };
  },
  async getMonths(months: MonthKey[]): Promise<MonthlySales[]> {
    return totals(months);
  },
  async getFirstSaleMonth(): Promise<MonthKey | null> {
    return SNAPSHOT_SALES[0].month;
  },
};
