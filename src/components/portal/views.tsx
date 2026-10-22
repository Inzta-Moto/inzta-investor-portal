import Link from "next/link";
import type { ReactNode } from "react";

import { agreementMonthKey, formatDate, formatMonth } from "@/lib/format/dates";
import { chartPoints, phaseSubtitle, toChartPoints } from "@/lib/format/portfolio-view";
import type { FundUsageView, SalesView } from "@/lib/data/load";
import { pageFundUsage, type FundUsageMonth } from "@/lib/investment/fund-usage";
import type { MonthFocus } from "@/lib/investment/sales";
import type { CommissionItem } from "@/lib/investment/commission";
import type { Portfolio } from "@/lib/investment/portfolio";
import { formatPercent } from "@/lib/investment/repayment";
import { formatRupiah, formatRupiahCompact } from "@/lib/money/rupiah";

import { AlertIcon, DownIcon, InfoIcon, RightIcon, UpIcon } from "../icons";
import { Card, Notice, PageHeader, StatCard } from "./cards";
import { CommissionHero } from "./commission-hero";
import { ContractTimeline } from "./contract-timeline";
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
          <SalesChart title="Penjualan per bulan" points={chartPoints(portfolio)} />
          {sales.change ? (
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

export function PenjualanView({ portfolio, sales }: { portfolio: Portfolio; sales: SalesView }) {
  const { points, change } = portfolio.sales;
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

const quantityFormat = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 });

function quantityText(quantity: number, unit: string): string {
  return unit ? `${quantityFormat.format(quantity)} ${unit}` : quantityFormat.format(quantity);
}

function FundUsageList({ month }: { month: FundUsageMonth }) {
  return (
    <ul>
      {month.items.map((item, index) => (
        <li key={`${item.date}-${item.itemName}-${index}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-0.5 border-b border-line px-4 py-3.5 last:border-b-0">
          <p className="min-w-0 font-bold break-words">{item.itemName}</p>
          <p className="tabular text-right font-semibold">{formatRupiah(item.amount)}</p>
          <p className="col-span-2 text-[13px] text-ink-3">
            {[formatDate(item.date), item.category, quantityText(item.quantity, item.unit)].filter(Boolean).join(" · ")}
          </p>
        </li>
      ))}
    </ul>
  );
}

function FundUsageTable({ month }: { month: FundUsageMonth }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">Belanja yang dibayar dari dana investasi, {formatMonth(month.month, "long")}</caption>
        <thead>
          <tr className="bg-surface-sunk text-left text-xs font-semibold text-ink-3">
            <th scope="col" className="px-5 py-3">Tanggal</th>
            <th scope="col" className="px-5 py-3">Barang</th>
            <th scope="col" className="px-5 py-3">Kategori</th>
            <th scope="col" className="px-5 py-3 text-right">Jumlah</th>
            <th scope="col" className="px-5 py-3 text-right">Nominal</th>
          </tr>
        </thead>
        <tbody>
          {month.items.map((item, index) => (
            <tr key={`${item.date}-${item.itemName}-${index}`} className="border-t border-line">
              <td className="px-5 py-3 whitespace-nowrap">{formatDate(item.date)}</td>
              <th scope="row" className="px-5 py-3 text-left font-bold">{item.itemName}</th>
              <td className="px-5 py-3 text-ink-2">{item.category || "–"}</td>
              <td className="tabular px-5 py-3 text-right whitespace-nowrap">{quantityText(item.quantity, item.unit)}</td>
              <td className="tabular px-5 py-3 text-right whitespace-nowrap">{formatRupiah(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FundUsagePage({ month, children }: { month: FundUsageMonth; children: ReactNode }) {
  return (
    <div>
      <h2 className="border-b border-line px-4 py-3.5 text-[15px] font-bold lg:px-5 lg:text-base">{formatMonth(month.month, "long")}</h2>
      {children}
    </div>
  );
}

const FUND_USAGE_PAGE = 10;

// Ten items per page and never two months on one page, newest first. The client asked for the list only: no total, remaining fund, or chart.
export function PenggunaanDanaView({ fundUsage }: { fundUsage: FundUsageView }) {
  const { months, skipped } = fundUsage;
  const pages = pageFundUsage(months, FUND_USAGE_PAGE);
  const labels = pages.map((m) => formatMonth(m.month, "long"));
  return (
    <>
      <PageHeader title="Penggunaan Dana Investasi" subtitle="Daftar belanja PT Inzta Gear Indonesia yang dibayar dari dana investasi Anda, dicatat oleh tim Inzta." />
      {skipped ? (
        <Notice tone="warn">
          <AlertIcon className="size-5 text-warn" />
          <span>{skipped} catatan belanja belum terbaca dan belum ditampilkan. Hubungi admin Inzta untuk memperbaiki data.</span>
        </Notice>
      ) : null}
      {months.length === 0 ? (
        <Card>
          <p className="text-sm text-ink-2">Belum ada belanja yang dibayar dari dana investasi.</p>
        </Card>
      ) : (
        <Card flush>
          <div className="lg:hidden">
            <Paginated
              navLabel="Halaman penggunaan dana"
              initialPage={0}
              labels={labels}
              pages={pages.map((m, i) => <FundUsagePage key={`${m.month}-${i}`} month={m}><FundUsageList month={m} /></FundUsagePage>)}
            />
          </div>
          <div className="hidden lg:block">
            <Paginated
              navLabel="Halaman penggunaan dana"
              initialPage={0}
              labels={labels}
              pages={pages.map((m, i) => <FundUsagePage key={`${m.month}-${i}`} month={m}><FundUsageTable month={m} /></FundUsagePage>)}
            />
          </div>
        </Card>
      )}
    </>
  );
}

export function PortfolioView({ view, portfolio, sales, fundUsage }: { view: PortalView; portfolio: Portfolio; sales?: SalesView; fundUsage?: FundUsageView }) {
  if (view === "penjualan" && sales) return <PenjualanView portfolio={portfolio} sales={sales} />;
  if (view === "penggunaan-dana" && fundUsage) return <PenggunaanDanaView fundUsage={fundUsage} />;
  if (view === "komisi") return <KomisiView portfolio={portfolio} />;
  if (view === "pengembalian") return <PengembalianView portfolio={portfolio} />;
  return <RingkasanView portfolio={portfolio} />;
}
