import type { Metadata } from "next";

import { Card, PageHeader, StatCard } from "@/components/portal/cards";
import { CommissionReceivedCard } from "@/components/portal/received-cards";
import { CommissionList, CommissionTable } from "@/components/portal/schedules";
import { formatRupiah } from "@/lib/money/rupiah";

import { portfolioFor } from "../portfolio";

export const metadata: Metadata = { title: "Komisi" };

export default async function KomisiPage({ searchParams }: PageProps<"/komisi">) {
  const portfolio = await portfolioFor(searchParams);
  const { items, totals } = portfolio.commission;
  const currentMonth = portfolio.phase.kind === "running" ? portfolio.phase.month : null;

  return (
    <>
      <PageHeader title="Komisi" subtitle={`${formatRupiah(totals.perMonth)} per bulan selama ${portfolio.termMonths} bulan, dibayar tanggal 25–26`} />
      <div className="grid gap-3 lg:grid-cols-12 lg:gap-4">
        <CommissionReceivedCard portfolio={portfolio} className="lg:col-span-7" />
        <div className="grid content-start gap-3 lg:col-span-5 lg:gap-4">
          <StatCard label="Komisi per bulan" value={formatRupiah(totals.perMonth)}>
            <p className="text-[13px] text-ink-3">3,2% × {formatRupiah(portfolio.totalInvestment)}, tetap walau dana sebagian sudah kembali</p>
          </StatCard>
          <StatCard label={`Total ${portfolio.termMonths} bulan`} value={formatRupiah(totals.total)} />
        </div>
      </div>
      <Card flush>
        <h2 className="border-b border-line px-4 py-3.5 text-base font-bold lg:px-5">Jadwal komisi</h2>
        <div className="lg:hidden">
          <CommissionList items={items} currentMonth={currentMonth} />
        </div>
        <div className="hidden lg:block">
          <CommissionTable items={items} currentMonth={currentMonth} effectiveDate={portfolio.effectiveDate} />
        </div>
      </Card>
    </>
  );
}
