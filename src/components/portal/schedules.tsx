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

function NowTag() {
  return <span className="rounded-md bg-ink px-1.5 py-0.5 text-[11px] font-bold text-bg">Bulan ini</span>;
}

function chip(item: CommissionItem) {
  return <StatusChip status={item.status} detail={item.status === "paid" && item.paidDate ? formatDate(item.paidDate) : undefined} />;
}

/** Mobile list; the running month is named in words and set on a sunk row, so no coloured edge is needed. */
export function CommissionList({ items, currentMonth, title }: { items: CommissionItem[]; currentMonth: number | null; title?: (item: CommissionItem) => string }) {
  return (
    <ul>
      {items.map((item) => (
        <li
          key={item.month}
          className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 border-b border-line px-4 py-3.5 last:border-b-0 ${
            item.month === currentMonth ? "bg-surface-sunk" : ""
          }`}
        >
          <div className="grid min-w-0 gap-0.5">
            <p className="flex flex-wrap items-center gap-x-2 font-bold">
              {title ? title(item) : `Bulan ke-${item.month}`}
              {item.month === currentMonth ? <NowTag /> : null}
            </p>
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
              <tr key={item.month} className={`border-t border-line whitespace-nowrap ${item.month === currentMonth ? "bg-surface-sunk" : ""}`}>
                <th scope="row" className="px-5 py-3 text-left font-bold">
                  <span className="inline-flex items-center gap-2">
                    Bulan ke-{item.month}
                    {item.month === currentMonth ? <NowTag /> : null}
                  </span>
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
            // Amount and status sit under the title, so a long chip such as "Belum ditetapkan" never runs past a narrow phone.
            className="grid grid-cols-[40px_minmax(0,1fr)] items-start gap-x-3 gap-y-2 rounded-xl border border-line bg-surface px-4 py-3.5"
          >
            <span className="grid size-10 place-items-center rounded-[10px] border border-line-strong bg-surface-sunk font-bold text-ink">{item.number}</span>
            <div className="min-w-0">
              <h3 className="font-bold">Pengembalian ke-{item.number}</h3>
              <p className="text-[13px] text-ink-3">
                Bulan ke-{item.dueMonth}
                {month ? ` · ${formatMonth(month, "long")}` : ""}
              </p>
            </div>
            <div className={`col-start-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 ${layout === "row" ? "lg:col-span-2 lg:col-start-1 lg:border-t lg:border-line lg:pt-2.5" : ""}`}>
              {item.amount !== null ? (
                <>
                  <b className="tabular">{formatRupiah(item.amount)}</b>
                  {item.percentBasisPoints !== null ? <span className="text-xs text-ink-3">{formatPercent(item.percentBasisPoints)} dari dana</span> : null}
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
