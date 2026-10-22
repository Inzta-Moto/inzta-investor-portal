import type { FundUsageItem, MonthKey } from "./types.ts";

export type FundUsageMonth = { month: MonthKey; items: FundUsageItem[] };

/** Newest first, one group per calendar month. Same-day items keep name order so a refresh never reshuffles them. */
export function groupFundUsage(items: FundUsageItem[]): FundUsageMonth[] {
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date) || a.itemName.localeCompare(b.itemName, "id"));
  const months: FundUsageMonth[] = [];
  for (const item of sorted) {
    const month = item.date.slice(0, 7);
    const last = months.at(-1);
    if (last?.month === month) last.items.push(item);
    else months.push({ month, items: [item] });
  }
  return months;
}
