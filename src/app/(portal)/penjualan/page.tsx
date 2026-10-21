import type { Metadata } from "next";

import { DownIcon, InfoIcon, UpIcon } from "@/components/icons";
import { Card, Notice, PageHeader, StatCard } from "@/components/portal/cards";
import { SalesChart } from "@/components/portal/sales-chart";
import { formatMonth } from "@/lib/format/dates";
import { formatPercent } from "@/lib/investment/repayment";
import { formatRupiahCompact } from "@/lib/money/rupiah";

import { chartPoints, portfolioFor } from "../portfolio";

export const metadata: Metadata = { title: "Penjualan" };

export default async function PenjualanPage({ searchParams }: PageProps<"/penjualan">) {
  const portfolio = await portfolioFor(searchParams);
  const { points, change } = portfolio.sales;
  const running = points[points.length - 1];
  const complete = points.filter((point) => !point.running && point.revenue > 0);
  const average = complete.length ? Math.round(complete.reduce((sum, point) => sum + point.revenue, 0) / complete.length) : null;

  return (
    <>
      <PageHeader title="Penjualan" subtitle="Hasil penjualan InztaMoto per bulan, dihitung dari catatan Inzta" />
      <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
        <StatCard label={`${formatMonth(running.month, "long")} · berjalan`} value={formatRupiahCompact(running.revenue)}>
          <p className="text-[13px] text-ink-3">Belum lengkap sampai akhir bulan</p>
        </StatCard>
        <StatCard label={change ? formatMonth(change.month, "long") : "Bulan lalu"} value={change ? formatRupiahCompact(change.revenue) : "Belum ada"}>
          {change && change.changeBasisPoints !== null ? (
            <p className={`inline-flex items-center gap-1 text-[13px] font-semibold ${change.changeBasisPoints >= 0 ? "text-good" : "text-bad"}`}>
              {change.changeBasisPoints >= 0 ? <UpIcon className="size-4" /> : <DownIcon className="size-4" />}
              {formatPercent(Math.abs(change.changeBasisPoints))} dibanding {formatMonth(change.previous, "long")}
            </p>
          ) : null}
        </StatCard>
        <StatCard label={`Rata-rata ${complete.length} bulan selesai`} value={average !== null ? formatRupiahCompact(average) : "Belum ada"}>
          <p className="text-[13px] text-ink-3">Bulan berjalan tidak dihitung</p>
        </StatCard>
      </div>
      <Card>
        <SalesChart title="Penjualan per bulan, 12 bulan terakhir" points={chartPoints(portfolio)} tall />
      </Card>
      <Notice>
        <InfoIcon className="size-5 text-brand-amber" />
        <span>Penjualan dihitung dari seluruh kanal (website, marketplace, WhatsApp, toko) per bulan kalender. Rincian per transaksi tidak ditampilkan di portal.</span>
      </Notice>
    </>
  );
}
