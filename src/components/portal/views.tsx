import Link from "next/link";

import { agreementMonthKey, formatMonth } from "@/lib/format/dates";
import { chartPoints, phaseSubtitle, toChartPoints } from "@/lib/format/portfolio-view";
import type { FundUsageView, SalesView } from "@/lib/data/load";
import type { MonthFocus } from "@/lib/investment/sales";
import type { CommissionItem } from "@/lib/investment/commission";
import type { Portfolio } from "@/lib/investment/portfolio";
import { formatPercent } from "@/lib/investment/repayment";
import { formatRupiah, formatRupiahCompact } from "@/lib/money/rupiah";

import { AlertIcon, DownIcon, InfoIcon, RightIcon, UpIcon } from "../icons";
import { Card, Notice, PageHeader, StatCard } from "./cards";
import { CommissionHero } from "./commission-hero";
import { ContractTimeline } from "./contract-timeline";
import { RetryWhenReady } from "./auto-refresh";
import { Paginated } from "./paginated";
import { CommissionReceivedCard, RepaymentReceivedCard } from "./received-cards";
import { RepaymentTable } from "./repayment-table";
import { SalesChart } from "./sales-chart";
import { SalesFilter } from "./sales-filter";
import { CommissionList, CommissionTable, RepaymentCards } from "./schedules";

// Presentational only: props in, markup out. Data is read on the server (ADR-0006).

export type PortalView = "ringkasan" | "penjualan" | "komisi" | "pengembalian" | "penggunaan-dana";

function Warnings({ portfolio }: { portfolio: Portfolio }) {
  return portfolio.warnings.map((warning) => (
    <Notice key={warning} tone="warn">
      <AlertIcon className="size-5 text-warn" />
      <span>{warning} Hubungi admin Inzta untuk memperbaiki data.</span>
    </Notice>
  ));
}

/** Shown in place of a section whose data could not be read, so the rest of the page stays usable. */
function SectionUnavailable({ reason }: { reason: string }) {
  return (
    <Notice tone="warn">
      <AlertIcon className="size-5 text-warn" />
      <span>{reason} Halaman ini mencoba memuat ulang secara berkala.</span>
      <RetryWhenReady />
    </Notice>
  );
}

function ChangeLine({ portfolio }: { portfolio: Portfolio }) {
  const change = portfolio.sales.change;
  if (!change || change.changeBasisPoints === null) return null;
  const up = change.changeBasisPoints >= 0;
  return (
    <span className={`inline-flex items-start gap-1 text-[13px] font-semibold ${up ? "text-good" : "text-bad"}`}>
      {up ? <UpIcon className="mt-px size-4" /> : <DownIcon className="mt-px size-4" />}
      <span>
        {formatPercent(Math.abs(change.changeBasisPoints))} dibanding {formatMonth(change.previous, "short")}
      </span>
    </span>
  );
}

export function RingkasanView({ portfolio }: { portfolio: Portfolio }) {
  const { commission, sales } = portfolio;
  const currentMonth = portfolio.phase.kind === "running" ? portfolio.phase.month : null;
  const upcoming = commission.items.filter((item) => item.status !== "paid").slice(0, 3);
  return (
    <>
      <PageHeader title="Ringkasan" subtitle={phaseSubtitle(portfolio)} />
      <Warnings portfolio={portfolio} />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-4">
        <CommissionHero portfolio={portfolio} className="lg:col-span-7" />
        <CommissionReceivedCard portfolio={portfolio} className="lg:col-span-5" />
        <RepaymentReceivedCard portfolio={portfolio} className="lg:col-span-5" />
        <Card className="lg:col-span-7">
          <div className="mb-3.5 flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-bold lg:text-base">Perjalanan {portfolio.termMonths} bulan</h2>
            <Link href="/pengembalian" className="inline-flex min-h-11 items-center gap-1 text-[13px] font-semibold text-ink-2 hover:text-ink hover:underline">
              Pengembalian
              <RightIcon className="size-4" />
            </Link>
          </div>
          <ContractTimeline portfolio={portfolio} />
        </Card>
        <Card className="lg:col-span-8">
          {sales.unavailable ? (
            <>
              <h2 className="mb-3 text-[15px] font-bold lg:text-base">Penjualan per bulan</h2>
              <SectionUnavailable reason={sales.unavailable} />
            </>
          ) : (
            <SalesChart title="Penjualan per bulan" points={chartPoints(portfolio)} />
          )}
          {!sales.unavailable && sales.change ? (
            <p className="mt-3 flex flex-wrap items-center gap-x-2 border-t border-line pt-3 text-[13px] text-ink-2">
              {formatMonth(sales.change.month, "long")}: <b className="tabular text-ink">{formatRupiah(sales.change.revenue)}</b>
              <ChangeLine portfolio={portfolio} />
            </p>
          ) : null}
        </Card>
        <Card flush className="lg:col-span-4">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 lg:px-5">
            <h2 className="text-[15px] font-bold lg:text-base">Komisi terdekat</h2>
            <Link href="/komisi" className="inline-flex min-h-11 items-center gap-1 text-[13px] font-semibold text-ink-2 hover:text-ink hover:underline">
              Semua
              <RightIcon className="size-4" />
            </Link>
          </div>
          {upcoming.length ? (
            <CommissionList items={upcoming} currentMonth={currentMonth} />
          ) : (
            <p className="px-4 py-5 text-sm text-ink-2">Seluruh komisi {portfolio.termMonths} bulan sudah dibayar.</p>
          )}
        </Card>
      </div>
    </>
  );
}

// Three subgrid rows per stat card, with the card's own tighter gap inside them.
const ALIGNED = "row-span-3 grid-rows-subgrid gap-y-1.5";

function FocusSummary({ focus }: { focus: MonthFocus }) {
  const up = (focus.changeBasisPoints ?? 0) >= 0;
  return (
    <div className="grid gap-1 rounded-[10px] border border-line bg-surface-sunk px-3.5 py-3">
      <p className="text-[13px] text-ink-3">
        {formatMonth(focus.month, "long")}
        {focus.running ? " · berjalan" : ""}
      </p>
      <p className="tabular text-xl font-bold">{formatRupiah(focus.revenue)}</p>
      {focus.changeBasisPoints !== null ? (
        <p className={`inline-flex items-start gap-1 text-[13px] font-semibold ${up ? "text-good" : "text-bad"}`}>
          {up ? <UpIcon className="mt-px size-4" /> : <DownIcon className="mt-px size-4" />}
          <span>
            {formatPercent(Math.abs(focus.changeBasisPoints))} dibanding {formatMonth(focus.previous, "long")} ({formatRupiah(focus.previousRevenue)})
          </span>
        </p>
      ) : (
        <p className="text-[13px] text-ink-3">Belum ada penjualan di {formatMonth(focus.previous, "long")} untuk dibandingkan.</p>
      )}
    </div>
  );
}

export function PenjualanView({ portfolio, sales, error }: { portfolio: Portfolio; sales?: SalesView; error?: string }) {
  const { points, change } = portfolio.sales;
  const unavailable = portfolio.sales.unavailable ?? error ?? (sales ? null : "Rincian penjualan belum bisa dimuat saat ini.");
  if (unavailable || !sales) {
    return (
      <>
        <PageHeader title="Penjualan" subtitle="Hasil penjualan InztaMoto per bulan, dihitung dari catatan Inzta" />
        <Warnings portfolio={portfolio} />
        <SectionUnavailable reason={unavailable ?? "Rincian penjualan belum bisa dimuat saat ini."} />
      </>
    );
  }
  const running = points[points.length - 1];
  const complete = points.filter((point) => !point.running && point.revenue > 0);
  const average = complete.length ? Math.round(complete.reduce((sum, point) => sum + point.revenue, 0) / complete.length) : null;
  return (
    <>
      <PageHeader title="Penjualan" subtitle="Hasil penjualan InztaMoto per bulan, dihitung dari catatan Inzta" />
      <Warnings portfolio={portfolio} />
      {/* The running month leads at full width; the two finished-month figures pair up beside each other on a phone.
          Each card spans three shared rows (label, figure, note), so figures line up even when a label wraps. */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-3 lg:grid-cols-3 lg:gap-x-4">
        <StatCard className={`col-span-2 lg:col-span-1 ${ALIGNED}`} label={`${formatMonth(running.month, "long")} · berjalan`} value={formatRupiahCompact(running.revenue)}>
          <p className="text-[13px] text-ink-3">Belum lengkap sampai akhir bulan</p>
        </StatCard>
        <StatCard compact className={ALIGNED} label={change ? formatMonth(change.month, "long") : "Bulan lalu"} value={change ? formatRupiahCompact(change.revenue) : "Belum ada"}>
          <ChangeLine portfolio={portfolio} />
        </StatCard>
        <StatCard compact className={ALIGNED} label={`Rata-rata ${complete.length} bulan`} value={average !== null ? formatRupiahCompact(average) : "Belum ada"}>
          <p className="text-[13px] text-ink-3">Bulan berjalan tidak dihitung</p>
        </StatCard>
      </div>
      <Card>
        <SalesChart
          title={sales.filter ? `Penjualan per bulan, ${sales.filter.year}` : "Penjualan per bulan, 12 bulan terakhir"}
          points={toChartPoints(sales.points)}
          tall
          highlight={sales.focus?.month}
          controls={
            <SalesFilter
              years={sales.years}
              year={sales.filter?.year ?? null}
              month={sales.filter?.month ?? null}
              currentYear={Number(sales.today.slice(0, 4))}
              currentMonth={Number(sales.today.slice(5, 7))}
            />
          }
          summary={sales.focus ? <FocusSummary focus={sales.focus} /> : null}
        />
      </Card>
      <Notice>
        <InfoIcon className="size-5 text-brand-amber" />
        <span>Penjualan dihitung dari seluruh kanal (website, marketplace, WhatsApp, toko) per bulan kalender. Rincian per transaksi tidak ditampilkan di portal.</span>
      </Notice>
    </>
  );
}

// Six rows fit one phone screen; a desktop page shows one agreement year.
const PHONE_PAGE = 6;
const DESKTOP_PAGE = 12;

function chunk<T>(list: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, (i + 1) * size));
}

function pageLabels(items: CommissionItem[], size: number): string[] {
  return chunk(items, size).map((page) => `Bulan ${page[0].month}–${page[page.length - 1].month}`);
}

/** Opens on the page that holds the running month, so the investor lands on what is due now. */
function pageIndexOf(items: CommissionItem[], month: number | null, size: number): number {
  const index = month === null ? -1 : items.findIndex((item) => item.month === month);
  return index < 0 ? 0 : Math.floor(index / size);
}

export function KomisiView({ portfolio }: { portfolio: Portfolio }) {
  const { items, totals } = portfolio.commission;
  const currentMonth = portfolio.phase.kind === "running" ? portfolio.phase.month : null;
  const focusMonth = portfolio.phase.kind === "ended" ? (items.at(-1)?.month ?? null) : currentMonth;
  return (
    <>
      <PageHeader title="Komisi" subtitle={`${formatRupiah(totals.perMonth)} per bulan selama ${portfolio.termMonths} bulan, dibayar tanggal 25–26`} />
      <Warnings portfolio={portfolio} />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-4">
        <CommissionReceivedCard portfolio={portfolio} className="lg:col-span-7" />
        <div className="grid content-start gap-3 lg:col-span-5 lg:gap-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-4">
            <StatCard compact label="Komisi per bulan" value={formatRupiah(totals.perMonth)} />
            <StatCard compact label={`Total ${portfolio.termMonths} bulan`} value={formatRupiah(totals.total)} />
          </div>
          <p className="px-1 text-[13px] text-ink-3">
            {formatPercent(portfolio.commissionRateBasisPoints)} × {formatRupiah(portfolio.totalInvestment)} per bulan, tetap walau dana sebagian sudah kembali.
          </p>
        </div>
      </div>
      <Card flush>
        <h2 className="border-b border-line px-4 py-3.5 text-[15px] font-bold lg:text-base lg:px-5">Jadwal komisi</h2>
        <div className="lg:hidden">
          <Paginated
            navLabel="Halaman jadwal komisi"
            initialPage={pageIndexOf(items, focusMonth, PHONE_PAGE)}
            labels={pageLabels(items, PHONE_PAGE)}
            pages={chunk(items, PHONE_PAGE).map((page) => <CommissionList key={page[0].month} items={page} currentMonth={currentMonth} />)}
          />
        </div>
        <div className="hidden lg:block">
          <Paginated
            navLabel="Halaman jadwal komisi"
            initialPage={pageIndexOf(items, focusMonth, DESKTOP_PAGE)}
            labels={pageLabels(items, DESKTOP_PAGE)}
            pages={chunk(items, DESKTOP_PAGE).map((page) => (
              <CommissionTable key={page[0].month} items={page} currentMonth={currentMonth} effectiveDate={portfolio.effectiveDate} />
            ))}
          />
        </div>
      </Card>
    </>
  );
}

export function PengembalianView({ portfolio }: { portfolio: Portfolio }) {
  const { next } = portfolio.repayment;
  const nextMonth = next ? agreementMonthKey(portfolio.effectiveDate, next.dueMonth) : null;
  return (
    <>
      <PageHeader title="Pengembalian dana" subtitle="Tiga kali di tahun kedua: bulan ke-16, 20, dan 24 (Pasal 5)" />
      <Warnings portfolio={portfolio} />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-4">
        <RepaymentReceivedCard portfolio={portfolio} className="lg:col-span-7" />
        <StatCard className="lg:col-span-5" label="Pengembalian berikutnya" value={next ? `Ke-${next.number} · bulan ke-${next.dueMonth}` : "Selesai"}>
          <p className="text-[13px] text-ink-3">
            {next
              ? `${nextMonth ? formatMonth(nextMonth, "long") : "Menunggu Tanggal Efektif"} · ${next.amount !== null ? formatRupiah(next.amount) : "nominal belum ditetapkan"}`
              : "Seluruh Dana Investasi sudah kembali."}
          </p>
        </StatCard>
      </div>
      <Card flush>
        <h2 className="border-b border-line px-4 py-3.5 text-[15px] font-bold lg:text-base lg:px-5">Jadwal pengembalian</h2>
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

const USAGE_SUBTITLE = "Dana investasi Anda yang sudah dipakai PT Inzta Gear Indonesia untuk belanja usaha, dicatat oleh tim Inzta.";

// One global figure, no item list (client revision 2026-10-24); no remaining-fund figure either, because the
// investment also covers costs that are not purchases.
export function PenggunaanDanaView({ portfolio, fundUsage, error }: { portfolio: Portfolio; fundUsage?: FundUsageView; error?: string }) {
  if (!fundUsage) {
    return (
      <>
        <PageHeader title="Penggunaan Dana Investasi" subtitle={USAGE_SUBTITLE} />
        <SectionUnavailable reason={error ?? "Total penggunaan dana belum bisa dimuat saat ini."} />
      </>
    );
  }
  const { summary, skipped } = fundUsage;
  const period =
    summary.firstMonth && summary.lastMonth
      ? summary.firstMonth === summary.lastMonth
        ? formatMonth(summary.firstMonth, "long")
        : `${formatMonth(summary.firstMonth, "long")} sampai ${formatMonth(summary.lastMonth, "long")}`
      : null;
  return (
    <>
      <PageHeader title="Penggunaan Dana Investasi" subtitle={USAGE_SUBTITLE} />
      {skipped ? (
        <Notice tone="warn">
          <AlertIcon className="size-5 text-warn" />
          <span>{skipped} catatan belanja belum terbaca dan belum dihitung. Hubungi admin Inzta untuk memperbaiki data.</span>
        </Notice>
      ) : null}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-4">
        <StatCard className="lg:col-span-7" label="Total dana investasi terpakai" value={formatRupiah(summary.total)}>
          <p className="text-[13px] text-ink-3">
            {summary.count === 0 ? "Belum ada belanja yang dibayar dari dana investasi." : `${summary.count} belanja · ${period}`}
          </p>
        </StatCard>
        <StatCard className="lg:col-span-5" label="Dana investasi" value={formatRupiah(portfolio.totalInvestment)}>
          <p className="text-[13px] text-ink-3">Sesuai perjanjian, Tahap I dan Tahap II.</p>
        </StatCard>
      </div>
      <Notice>
        <InfoIcon className="size-5 text-brand-amber" />
        <span>Angka ini bertambah setiap tim Inzta mencatat belanja yang dibayar dari dana investasi. Rincian per barang disimpan Inzta dan tidak ditampilkan di portal.</span>
      </Notice>
    </>
  );
}

export function PortfolioView({
  view,
  portfolio,
  sales,
  fundUsage,
  sectionError,
}: {
  view: PortalView;
  portfolio: Portfolio;
  sales?: SalesView;
  fundUsage?: FundUsageView;
  sectionError?: string;
}) {
  if (view === "penjualan") return <PenjualanView portfolio={portfolio} sales={sales} error={sectionError} />;
  if (view === "penggunaan-dana") return <PenggunaanDanaView portfolio={portfolio} fundUsage={fundUsage} error={sectionError} />;
  if (view === "komisi") return <KomisiView portfolio={portfolio} />;
  if (view === "pengembalian") return <PengembalianView portfolio={portfolio} />;
  return <RingkasanView portfolio={portfolio} />;
}
