import Image from "next/image";

import { agreementMonthKey, formatDate, formatDueWindow, formatMonth } from "@/lib/format/dates";
import type { Portfolio } from "@/lib/investment/portfolio";
import { formatRupiah, formatRupiahCompact } from "@/lib/money/rupiah";

import { StatusChip } from "./status-chip";

function phaseMessage(portfolio: Portfolio): { title: string; body: string } | null {
  const { phase, effectiveDate } = portfolio;
  if (phase.kind === "unsigned") return { title: "Perjanjian belum aktif", body: "Jadwal komisi tampil setelah Tanggal Efektif dicatat admin Inzta." };
  if (phase.kind === "before" && effectiveDate) {
    const first = agreementMonthKey(effectiveDate, 1);
    return { title: "Komisi pertama segera", body: `Komisi bulan ke-1 jatuh tempo 25–26 ${first ? formatMonth(first) : ""}.` };
  }
  if (phase.kind === "ended") return { title: "Masa perjanjian selesai", body: "Seluruh jadwal 24 bulan sudah lewat. Rekap tetap bisa dilihat di halaman Komisi dan Pengembalian." };
  return null;
}

/** The one hero per screen: this month's commission, because that is what the investor opens the portal to check. */
export function CommissionHero({ portfolio, className = "" }: { portfolio: Portfolio; className?: string }) {
  const current = portfolio.commission.current;
  const message = phaseMessage(portfolio);
  const lastMonth = agreementMonthKey(portfolio.effectiveDate, portfolio.termMonths);

  return (
    <section
      className={`@container relative grid content-start gap-3 overflow-hidden rounded-xl border border-hero-border bg-hero p-4 pt-5 text-white lg:gap-4 lg:p-6 ${className}`}
      aria-label="Komisi bulan ini"
    >
      {/* The logo mark sits large and faint in the corner so the hero carries the brand without extra ornament. */}
      <Image src="/brand/inzta-mark.png" alt="" width={180} height={180} className="pointer-events-none absolute -right-8 -bottom-10 opacity-[0.12]" />
      {current ? (
        <>
          <p className="relative text-[13px] font-semibold text-brand-orange">Komisi bulan ke-{current.month}</p>
          <p className="hero-value relative font-bold">{formatRupiah(current.amount)}</p>
          <div className="relative flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-[#d6d3d1]">
            <StatusChip
              status={current.status}
              tone="on-dark"
              detail={current.status === "paid" && current.paidDate ? formatDate(current.paidDate) : undefined}
            />
            {current.dueStart && current.dueEnd ? <span>Jatuh tempo {formatDueWindow(current.dueStart, current.dueEnd)}</span> : null}
          </div>
        </>
      ) : (
        <div className="relative grid gap-2">
          <p className="text-[13px] font-semibold text-brand-orange">Komisi</p>
          <p className="text-2xl font-bold">{message?.title}</p>
          <p className="text-sm text-[#d6d3d1]">{message?.body}</p>
        </div>
      )}
      <dl className="relative grid grid-cols-3 gap-3 border-t border-white/10 pt-3.5 text-xs text-[#d6d3d1]">
        <div>
          <dt>Dana investasi</dt>
          <dd className="tabular text-[15px] font-bold text-white">{formatRupiahCompact(portfolio.totalInvestment)}</dd>
        </div>
        <div>
          <dt>Total komisi</dt>
          <dd className="tabular text-[15px] font-bold text-white">{formatRupiahCompact(portfolio.commission.totals.total)}</dd>
        </div>
        <div>
          <dt>Berakhir</dt>
          <dd className="text-[15px] font-bold text-white">{lastMonth ? formatMonth(lastMonth) : "Belum ditetapkan"}</dd>
        </div>
      </dl>
    </section>
  );
}
