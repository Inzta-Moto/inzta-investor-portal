import type { Metadata } from "next";
import Link from "next/link";

import { RightIcon, UpIcon, DownIcon } from "@/components/icons";
import { Card, PageHeader } from "@/components/portal/cards";
import { CommissionHero } from "@/components/portal/commission-hero";
import { ContractTimeline } from "@/components/portal/contract-timeline";
import { CommissionReceivedCard, RepaymentReceivedCard } from "@/components/portal/received-cards";
import { SalesChart } from "@/components/portal/sales-chart";
import { CommissionList } from "@/components/portal/schedules";
import { formatMonth } from "@/lib/format/dates";
import { formatPercent } from "@/lib/investment/repayment";
import { formatRupiah } from "@/lib/money/rupiah";

import { chartPoints, phaseSubtitle, portfolioFor } from "../portfolio";

export const metadata: Metadata = { title: "Ringkasan" };

export default async function RingkasanPage({ searchParams }: PageProps<"/ringkasan">) {
  const portfolio = await portfolioFor(searchParams);
  const { commission, sales } = portfolio;
  const currentMonth = portfolio.phase.kind === "running" ? portfolio.phase.month : null;
  const upcoming = commission.items.filter((item) => item.status !== "paid").slice(0, 3);
  const change = sales.change;

  return (
    <>
      <PageHeader title="Ringkasan" subtitle={phaseSubtitle(portfolio)} />
      <div className="grid gap-3 lg:grid-cols-12 lg:gap-4">
        <CommissionHero portfolio={portfolio} className="lg:col-span-7" />
        <CommissionReceivedCard portfolio={portfolio} className="lg:col-span-5" />
        <RepaymentReceivedCard portfolio={portfolio} className="lg:col-span-5" />
        <Card className="lg:col-span-7">
          <div className="mb-3.5 flex items-center justify-between gap-3">
            <h2 className="text-base font-bold">Perjalanan {portfolio.termMonths} bulan</h2>
            <Link href="/pengembalian" className="inline-flex min-h-10 items-center gap-1 text-[13px] font-semibold text-ink-2 hover:text-ink hover:underline">
              Pengembalian
              <RightIcon className="size-4" />
            </Link>
          </div>
          <ContractTimeline portfolio={portfolio} />
        </Card>
        <Card className="lg:col-span-8">
          <SalesChart title="Penjualan per bulan" points={chartPoints(portfolio)} />
          {change ? (
            <p className="mt-3 border-t border-line pt-3 text-[13px] text-ink-2">
              {formatMonth(change.month, "long")}: <b className="tabular text-ink">{formatRupiah(change.revenue)}</b>
              {change.changeBasisPoints !== null ? (
                <span className={`ml-2 inline-flex items-center gap-1 font-semibold ${change.changeBasisPoints >= 0 ? "text-good" : "text-bad"}`}>
                  {change.changeBasisPoints >= 0 ? <UpIcon className="size-4" /> : <DownIcon className="size-4" />}
                  {formatPercent(Math.abs(change.changeBasisPoints))} dibanding {formatMonth(change.previous)}
                </span>
              ) : null}
            </p>
          ) : null}
        </Card>
        <Card flush className="lg:col-span-4">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 lg:px-5">
            <h2 className="text-base font-bold">Komisi terdekat</h2>
            <Link href="/komisi" className="inline-flex min-h-10 items-center gap-1 text-[13px] font-semibold text-ink-2 hover:text-ink hover:underline">
              Semua
              <RightIcon className="size-4" />
            </Link>
          </div>
          {upcoming.length ? (
            <CommissionList items={upcoming} currentMonth={currentMonth} title={(item) => `Komisi bulan ke-${item.month}`} />
          ) : (
            <p className="px-4 py-5 text-sm text-ink-2">Seluruh komisi 24 bulan sudah dibayar.</p>
          )}
        </Card>
      </div>
    </>
  );
}
