import { agreementMonthKey, formatMonth } from "@/lib/format/dates";
import type { Portfolio } from "@/lib/investment/portfolio";

const AXIS = new Set([1, 12, 16, 20, 24]);

/** Identity motif of the portal: one cell per agreement month, repayments marked under months 16, 20, 24. */
export function ContractTimeline({ portfolio }: { portfolio: Portfolio }) {
  const { phase, termMonths, effectiveDate } = portfolio;
  const current = phase.kind === "running" ? phase.month : phase.kind === "ended" ? termMonths + 1 : 0;
  const repayMonths = new Set(portfolio.repayment.items.map((r) => r.dueMonth));
  const months = Array.from({ length: termMonths }, (_, i) => i + 1);
  const description =
    phase.kind === "running"
      ? `Bulan ke-${phase.month} dari ${termMonths}. Pengembalian dana di bulan ke-16, 20, dan 24.`
      : `Perjanjian ${termMonths} bulan. Pengembalian dana di bulan ke-16, 20, dan 24.`;

  return (
    <div className="grid gap-2.5">
      <div role="img" aria-label={description} className="grid grid-cols-24 gap-0.5 lg:gap-1">
        {months.map((n) => {
          const key = agreementMonthKey(effectiveDate, n);
          const state = n < current ? "bg-brand-amber" : n === current ? "bg-ink" : "bg-track";
          return (
            <div
              key={n}
              title={`Bulan ke-${n}${key ? ` · ${formatMonth(key)}` : ""}`}
              className={`h-7 rounded-[3px] lg:h-9 lg:rounded ${state} ${repayMonths.has(n) ? "repay-marker" : ""}`}
            />
          );
        })}
      </div>
      <div aria-hidden="true" className="tabular mt-1 grid grid-cols-24 gap-0.5 text-[11px] text-ink-3 lg:gap-1">
        {months.map((n) => (
          <span key={n} className="text-center">
            {AXIS.has(n) ? n : ""}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-0.5 text-xs text-ink-3">
        <p className="border-t border-line-strong pt-1.5">Tahun 1 · komisi saja</p>
        <p className="border-t border-line-strong pt-1.5 pl-1">Tahun 2 · komisi + 3 pengembalian</p>
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-2">
        <li className="inline-flex items-center gap-1.5"><i className="size-3 rounded-[3px] bg-brand-amber" />Sudah lewat</li>
        <li className="inline-flex items-center gap-1.5"><i className="size-3 rounded-[3px] bg-ink" />Bulan ini</li>
        <li className="inline-flex items-center gap-1.5"><i className="size-3 rounded-[3px] bg-track" />Akan datang</li>
        <li className="inline-flex items-center gap-1.5"><span aria-hidden="true">▲</span>Jadwal pengembalian</li>
      </ul>
    </div>
  );
}
