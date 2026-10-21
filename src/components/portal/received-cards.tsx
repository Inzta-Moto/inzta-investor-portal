import { formatDate, formatDueWindow } from "@/lib/format/dates";
import type { Portfolio } from "@/lib/investment/portfolio";
import { formatPercent } from "@/lib/investment/repayment";
import { formatRupiah, formatRupiahCompact } from "@/lib/money/rupiah";

import { Card, CardLabel, Meter } from "./cards";
import { StatusChip } from "./status-chip";

/** "How much has come in": commission received so far against Rp153,6 jt. */
export function CommissionReceivedCard({ portfolio, className = "" }: { portfolio: Portfolio; className?: string }) {
  const { totals, items } = portfolio.commission;
  const next = items.find((item) => item.status !== "paid");
  return (
    <Card className={`grid content-start gap-3 ${className}`}>
      <CardLabel>Komisi sudah masuk</CardLabel>
      <p className="tabular text-2xl leading-tight font-bold tracking-[-0.015em] lg:text-[28px]">{formatRupiah(totals.received)}</p>
      <Meter
        ratio={totals.total > 0 ? totals.received / totals.total : 0}
        label="Komisi sudah masuk dari total"
        left={`${totals.paidMonths} dari ${portfolio.termMonths} bulan`}
        right={`dari ${formatRupiahCompact(totals.total)}`}
      />
      <dl className="grid grid-cols-2 gap-3 border-t border-line pt-3 text-[13px]">
        <div>
          <dt className="text-ink-3">Per bulan</dt>
          <dd className="tabular font-semibold">{formatRupiah(totals.perMonth)}</dd>
        </div>
        <div>
          <dt className="text-ink-3">Belum masuk</dt>
          <dd className="tabular font-semibold">{formatRupiah(totals.remaining)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-ink-3">Berikutnya</dt>
          <dd className="font-semibold">
            {next ? `Bulan ke-${next.month}${next.dueStart && next.dueEnd ? ` · ${formatDueWindow(next.dueStart, next.dueEnd)}` : ""}` : "Semua komisi sudah dibayar"}
          </dd>
        </div>
      </dl>
    </Card>
  );
}

/** Repayments received so far against Rp200 jt, with each of the three installments (Pasal 5). */
export function RepaymentReceivedCard({ portfolio, className = "" }: { portfolio: Portfolio; className?: string }) {
  const { totals, items } = portfolio.repayment;
  const paidCount = items.filter((item) => item.status === "paid").length;
  return (
    <Card className={`grid content-start gap-3 ${className}`}>
      <CardLabel>Pengembalian dana sudah masuk</CardLabel>
      <p className="tabular text-2xl leading-tight font-bold tracking-[-0.015em] lg:text-[28px]">{formatRupiah(totals.returned)}</p>
      <Meter
        ratio={totals.total > 0 ? totals.returned / totals.total : 0}
        label="Pengembalian dana sudah masuk dari total"
        left={`${paidCount} dari ${items.length} kali · ${formatPercent(totals.returnedBasisPoints)}`}
        right={`dari ${formatRupiahCompact(totals.total)}`}
      />
      <ul className="grid gap-2 border-t border-line pt-3 text-[13px]">
        {items.map((item) => (
          <li key={item.number} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <span>
              <b>Ke-{item.number}</b> <span className="text-ink-3">· bulan ke-{item.dueMonth}</span>
            </span>
            <span className="flex items-center gap-2">
              {item.amount !== null ? <span className="tabular font-semibold">{formatRupiah(item.status === "paid" ? item.paidAmount : item.amount)}</span> : null}
              <StatusChip status={item.status} detail={item.status === "paid" && item.paidDate ? formatDate(item.paidDate) : undefined} />
            </span>
          </li>
        ))}
      </ul>
      <p className="text-[13px] text-ink-3">
        Sisa belum kembali <b className="tabular text-ink">{formatRupiah(totals.remaining)}</b>
      </p>
    </Card>
  );
}
