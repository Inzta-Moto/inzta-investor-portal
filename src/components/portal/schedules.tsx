import { agreementMonthKey, formatDate, formatDueWindow, formatMonth } from "@/lib/format/dates";
import type { CommissionItem } from "@/lib/investment/commission";
import type { RepaymentItem } from "@/lib/investment/repayment";
import { formatPercent } from "@/lib/investment/repayment";
import type { IsoDate } from "@/lib/investment/types";
import { formatRupiah } from "@/lib/money/rupiah";

import { ReturnIcon } from "../icons";
import { StatusChip } from "./status-chip";

function due(item: { dueStart: IsoDate | null; dueEnd: IsoDate | null }): string {
  return item.dueStart && item.dueEnd ? formatDueWindow(item.dueStart, item.dueEnd) : "Menunggu Tanggal Efektif";
}

function chip(item: CommissionItem) {
  return <StatusChip status={item.status} detail={item.status === "paid" && item.paidDate ? formatDate(item.paidDate) : undefined} />;
}

/** Mobile list; the left edge marks the month that is due now, a real state rather than decoration. */
export function CommissionList({ items, currentMonth, title }: { items: CommissionItem[]; currentMonth: number | null; title?: (item: CommissionItem) => string }) {
  return (
    <ul>
      {items.map((item) => (
        <li
          key={item.month}
          className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 border-b border-line px-4 py-3.5 last:border-b-0 ${
            item.month === currentMonth ? "shadow-[inset_3px_0_0_#d97706]" : ""
          }`}
        >
          <div className="grid min-w-0 gap-0.5">
            <p className="font-bold">{title ? title(item) : `Bulan ke-${item.month}`}</p>
            <p className="text-[13px] text-ink-3">{due(item)}</p>
          </div>
          <p className="tabular text-right font-semibold">{formatRupiah(item.amount)}</p>
          <span />
          <span className="justify-self-end">{chip(item)}</span>
          {item.withRepayment ? (
            <p className="col-span-2 flex items-center gap-1.5 text-xs text-ink-2">
              <ReturnIcon className="size-4" />
              Bersamaan pengembalian ke-{item.withRepayment}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function CommissionTable({ items, currentMonth, effectiveDate }: { items: CommissionItem[]; currentMonth: number | null; effectiveDate: IsoDate | null }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-surface-sunk text-left text-xs font-semibold text-ink-3">
            <th scope="col" className="px-5 py-3">Bulan</th>
            <th scope="col" className="px-5 py-3">Periode</th>
            <th scope="col" className="px-5 py-3">Jatuh tempo</th>
            <th scope="col" className="px-5 py-3 text-right">Nominal</th>
            <th scope="col" className="px-5 py-3">Status</th>
            <th scope="col" className="px-5 py-3">Catatan</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const period = agreementMonthKey(effectiveDate, item.month);
            return (
              <tr key={item.month} className="border-t border-line whitespace-nowrap">
                <th scope="row" className={`px-5 py-3 text-left font-bold ${item.month === currentMonth ? "shadow-[inset_3px_0_0_#d97706]" : ""}`}>
                  Bulan ke-{item.month}
                </th>
                <td className="px-5 py-3">{period ? formatMonth(period, "long") : "–"}</td>
                <td className="px-5 py-3">{due(item)}</td>
                <td className="tabular px-5 py-3 text-right">{formatRupiah(item.amount)}</td>
                <td className="px-5 py-3">{chip(item)}</td>
                <td className="px-5 py-3 text-ink-3">{item.withRepayment ? `Bersamaan pengembalian ke-${item.withRepayment}` : ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function RepaymentCards({ items, effectiveDate, layout = "stack" }: { items: RepaymentItem[]; effectiveDate: IsoDate | null; layout?: "stack" | "row" }) {
  return (
    <div className={`grid gap-2 ${layout === "row" ? "lg:grid-cols-3 lg:gap-4" : ""}`}>
      {items.map((item) => {
        const month = agreementMonthKey(effectiveDate, item.dueMonth);
        return (
          <article
            key={item.number}
            className={`grid items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 ${
              layout === "row" ? "grid-cols-[40px_minmax(0,1fr)_auto] lg:grid-cols-[40px_minmax(0,1fr)] lg:items-start" : "grid-cols-[40px_minmax(0,1fr)_auto]"
            }`}
          >
            <span className="grid size-10 place-items-center rounded-[10px] bg-brand-charcoal font-bold text-brand-orange">{item.number}</span>
            <div className="min-w-0">
              <h3 className="font-bold">Pengembalian ke-{item.number}</h3>
              <p className="text-[13px] text-ink-3">
                Bulan ke-{item.dueMonth}
                {month ? ` · ${formatMonth(month, "long")}` : ""}
              </p>
            </div>
            <div
              className={`grid justify-items-end gap-1 text-right ${
                layout === "row" ? "lg:col-span-2 lg:justify-items-start lg:border-t lg:border-line lg:pt-2.5 lg:text-left" : ""
              }`}
            >
              {item.amount !== null ? (
                <>
                  <b className="tabular">{formatRupiah(item.amount)}</b>
                  <span className="text-xs text-ink-3">
                    {item.percentBasisPoints !== null ? `${formatPercent(item.percentBasisPoints)} dari dana` : ""}
                  </span>
                </>
              ) : null}
              <StatusChip status={item.status} detail={item.status === "paid" && item.paidDate ? formatDate(item.paidDate) : undefined} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
