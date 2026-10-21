import type { ScheduleStatus } from "@/lib/investment/types";

import { AlertIcon, CalendarIcon, CheckIcon, ClockIcon, DashIcon } from "../icons";

const STYLE: Record<ScheduleStatus, { className: string; label: string; Icon: typeof CheckIcon }> = {
  paid: { className: "bg-good-soft text-good", label: "Dibayar", Icon: CheckIcon },
  // Due now is the strongest orange accent in the UI; charcoal text on #F59E0B is 8.1:1.
  due: { className: "bg-brand-orange text-[#1c1917]", label: "Jatuh tempo", Icon: ClockIcon },
  late: { className: "bg-bad-soft text-bad", label: "Terlambat", Icon: AlertIcon },
  upcoming: { className: "border border-line bg-surface-sunk text-ink-2", label: "Akan datang", Icon: CalendarIcon },
  unset: { className: "border border-dashed border-line-strong text-ink-3", label: "Belum ditetapkan", Icon: DashIcon },
};

/** Status always carries an icon and a word, never colour alone. */
export function StatusChip({ status, detail, tone }: { status: ScheduleStatus; detail?: string; tone?: "on-dark" }) {
  const style = STYLE[status];
  const onDark = tone === "on-dark" && status === "paid" ? "bg-[rgb(74_222_128/0.16)] text-[#86efac]" : style.className;
  return (
    <span className={`inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-md pr-2.5 pl-2 text-xs font-bold ${onDark}`}>
      <style.Icon className="size-3.5" strokeWidth={2.25} />
      {style.label}
      {detail ? ` ${detail}` : null}
    </span>
  );
}
