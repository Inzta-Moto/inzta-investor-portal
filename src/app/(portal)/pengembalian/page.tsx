import type { Metadata } from "next";

import { AlertIcon, InfoIcon } from "@/components/icons";
import { Card, Notice, PageHeader, StatCard } from "@/components/portal/cards";
import { RepaymentReceivedCard } from "@/components/portal/received-cards";
import { RepaymentTable } from "@/components/portal/repayment-table";
import { RepaymentCards } from "@/components/portal/schedules";
import { agreementMonthKey, formatMonth } from "@/lib/format/dates";
import { formatRupiah } from "@/lib/money/rupiah";

import { portfolioFor } from "../portfolio";

export const metadata: Metadata = { title: "Pengembalian dana" };

export default async function PengembalianPage({ searchParams }: PageProps<"/pengembalian">) {
  const portfolio = await portfolioFor(searchParams);
  const { next } = portfolio.repayment;
  const nextMonth = next ? agreementMonthKey(portfolio.effectiveDate, next.dueMonth) : null;

  return (
    <>
      <PageHeader title="Pengembalian dana" subtitle="Tiga kali di tahun kedua: bulan ke-16, 20, dan 24 (Pasal 5)" />
      {portfolio.warnings.map((warning) => (
        <Notice key={warning} tone="warn">
          <AlertIcon className="size-5 text-warn" />
          <span>{warning} Hubungi admin Inzta untuk memperbaiki data.</span>
        </Notice>
      ))}
      <div className="grid gap-3 lg:grid-cols-12 lg:gap-4">
        <RepaymentReceivedCard portfolio={portfolio} className="lg:col-span-7" />
        <StatCard
          className="lg:col-span-5"
          label="Pengembalian berikutnya"
          value={next ? `Ke-${next.number} · bulan ke-${next.dueMonth}` : "Selesai"}
        >
          <p className="text-[13px] text-ink-3">
            {next
              ? `${nextMonth ? formatMonth(nextMonth, "long") : "Menunggu Tanggal Efektif"} · ${next.amount !== null ? formatRupiah(next.amount) : "nominal belum ditetapkan"}`
              : "Seluruh Dana Investasi sudah kembali."}
          </p>
        </StatCard>
      </div>
      <Card flush>
        <h2 className="border-b border-line px-4 py-3.5 text-base font-bold lg:px-5">Jadwal pengembalian</h2>
        <div className="p-3 lg:hidden">
          <RepaymentCards items={portfolio.repayment.items} effectiveDate={portfolio.effectiveDate} />
        </div>
        <div className="hidden lg:block">
          <RepaymentTable portfolio={portfolio} />
        </div>
      </Card>
      <Notice>
        <InfoIcon className="size-5 text-brand-amber" />
        <span>
          Persentase dan jumlah setiap pengembalian diisi saat penandatanganan perjanjian dan dicatat admin Inzta; jumlah ketiganya 100% dari{" "}
          {formatRupiah(portfolio.totalInvestment)}. Komisi tetap dibayar penuh walau sebagian dana sudah kembali.
        </span>
      </Notice>
    </>
  );
}
