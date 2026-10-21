import type { IsoDate, MonthKey } from "./types.ts";

export type YearMonth = { year: number; month: number };

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTH_KEY = /^(\d{4})-(\d{2})/;

// Month arithmetic runs on integers instead of Date so server (UTC) and browser (WIB) never disagree on a month.
export function parseIsoDate(value: IsoDate): { year: number; month: number; day: number } {
  const match = ISO_DATE.exec(value);
  if (!match) throw new RangeError(`expected YYYY-MM-DD, got ${value}`);
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  if (month < 1 || month > 12 || day < 1 || day > 31) throw new RangeError(`invalid date ${value}`);
  return { year, month, day };
}

export function toYearMonth(value: IsoDate | MonthKey): YearMonth {
  const match = MONTH_KEY.exec(value);
  if (!match) throw new RangeError(`expected YYYY-MM, got ${value}`);
  return { year: Number(match[1]), month: Number(match[2]) };
}

export function addMonths(ym: YearMonth, count: number): YearMonth {
  const index = ym.year * 12 + (ym.month - 1) + count;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

export function monthsBetween(from: YearMonth, to: YearMonth): number {
  return to.year * 12 + to.month - (from.year * 12 + from.month);
}

export function monthKey(ym: YearMonth): MonthKey {
  return `${ym.year}-${String(ym.month).padStart(2, "0")}`;
}

export function isoDate(ym: YearMonth, day: number): IsoDate {
  return `${monthKey(ym)}-${String(day).padStart(2, "0")}`;
}

/** Calendar month of agreement month n: the n-th month after the month of the Effective Date (A-013). */
export function agreementMonthOf(effectiveDate: IsoDate, n: number): YearMonth {
  return addMonths(toYearMonth(effectiveDate), n);
}

/** Commission (and repayment) due window: the 25th to the 26th of agreement month n (Pasal 4 ayat 3). */
export function dueWindow(effectiveDate: IsoDate, n: number): { start: IsoDate; end: IsoDate } {
  const ym = agreementMonthOf(effectiveDate, n);
  return { start: isoDate(ym, 25), end: isoDate(ym, 26) };
}

export type AgreementPhase =
  | { kind: "unsigned" }
  | { kind: "before" }
  | { kind: "running"; month: number }
  | { kind: "ended" };

export function agreementPhase(effectiveDate: IsoDate | null, today: IsoDate, termMonths: number): AgreementPhase {
  if (!effectiveDate) return { kind: "unsigned" };
  const elapsed = monthsBetween(toYearMonth(effectiveDate), toYearMonth(today));
  if (elapsed < 1) return { kind: "before" };
  if (elapsed > termMonths) return { kind: "ended" };
  return { kind: "running", month: elapsed };
}

/** Today's date in Jakarta, where the agreement's 25th and 26th are counted. */
export function todayInJakarta(now: Date = new Date()): IsoDate {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
