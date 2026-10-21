import { parseIsoDate } from "./calendar.ts";
import type { IsoDate, ScheduleStatus } from "./types.ts";

/**
 * Status of one unpaid obligation due on the 25th to 26th of its month: due during that month until the 26th,
 * late afterwards, upcoming before the month starts.
 */
export function timeStatus(dueEnd: IsoDate | null, today: IsoDate): Exclude<ScheduleStatus, "paid" | "unset"> {
  if (!dueEnd) return "upcoming";
  const due = parseIsoDate(dueEnd);
  const now = parseIsoDate(today);
  const dueIndex = due.year * 12 + due.month;
  const nowIndex = now.year * 12 + now.month;
  if (nowIndex < dueIndex) return "upcoming";
  if (nowIndex > dueIndex) return "late";
  return now.day <= due.day ? "due" : "late";
}
