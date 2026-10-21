import { agreementMonthOf, monthKey, parseIsoDate, toYearMonth } from "../investment/calendar.ts";
import type { IsoDate, MonthKey } from "../investment/types.ts";

const SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const LONG = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export function monthName(month: MonthKey, style: "short" | "long" = "short"): string {
  const { month: m } = toYearMonth(month);
  return (style === "short" ? SHORT : LONG)[m - 1];
}

/** "Jan 2027" or "Januari 2027". */
export function formatMonth(month: MonthKey, style: "short" | "long" = "short"): string {
  return `${monthName(month, style)} ${toYearMonth(month).year}`;
}

/** "25 Jan 2027". */
export function formatDate(date: IsoDate): string {
  const { year, month, day } = parseIsoDate(date);
  return `${day} ${SHORT[month - 1]} ${year}`;
}

/** "25–26 Jan 2027" for a window inside one month. */
export function formatDueWindow(start: IsoDate, end: IsoDate): string {
  const a = parseIsoDate(start);
  const b = parseIsoDate(end);
  return `${a.day}–${b.day} ${SHORT[b.month - 1]} ${b.year}`;
}

/** Calendar month of agreement month n, or null while the Effective Date is unknown. */
export function agreementMonthKey(effectiveDate: IsoDate | null, n: number): MonthKey | null {
  return effectiveDate ? monthKey(agreementMonthOf(effectiveDate, n)) : null;
}
