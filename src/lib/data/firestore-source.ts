import { cert, getApps, initializeApp } from "firebase-admin/app";
import { AggregateField, getFirestore, type Firestore } from "firebase-admin/firestore";

import { addMonths, monthKey, parseIsoDate, toYearMonth } from "../investment/calendar.ts";
import type { Agreement, FundUsageItem, InvestorSnapshot, IsoDate, MonthKey, MonthlySales, Payment } from "../investment/types.ts";
import { readAdminConfig } from "./admin-config.ts";
import { toAgreement, toFundUsageItem, toPayment } from "./firestore-mapping.ts";
import { TtlCache } from "./ttl-cache.ts";

// Only these sales fields are ever fetched (ADR-0006): customer, city, reseller, and cost price stay in Firestore.
export const SALES_FIELDS = ["date", "revenue", "sellingPrice", "quantity"] as const;

// Belanja Investasi from the ERP's own menu (ADR-0008): unit price, notes, and who typed the item stay in Firestore.
// Each item holds the agreement id so a second investor (F-011) only changes the value the portal asks for.
export const FUND_USAGE_FIELDS = ["date", "itemName", "category", "quantity", "unit", "totalCost"] as const;
export const INVESTOR_AGREEMENT_ID = "current";

export type FundUsage = { items: FundUsageItem[]; skipped: number };

// Firestore code 8: the Spark plan's daily read quota, shared with the ERP dashboard, is used up.
export const QUOTA_MESSAGE =
  "Kuota baca harian database Inzta sudah habis, jadi data belum bisa ditampilkan. Data muncul lagi setelah kuota direset, sekitar pukul 14.00 sampai 15.00 WIB.";

export function isQuotaError(error: unknown): boolean {
  const code = (error as { code?: unknown } | null)?.code;
  return code === 8 || code === "resource-exhausted" || /RESOURCE_EXHAUSTED/.test(String((error as Error | null)?.message ?? ""));
}

// The Spark plan's daily read quota is shared with the internal dashboard, so only sales dated yesterday or later are
// re-read on every 30-second refresh; older days seldom change and are re-read once an hour.
const RECENT_TTL = 25_000;
const SETTLED_TTL = 60 * 60_000;
const AGREEMENT_TTL = 25_000;

// Firestore code 9 with this text: the sum() aggregation on sales needs the composite index (date, revenue) from
// firestore.indexes.json, which the owner creates in the project; the emulator never enforces it.
export const INDEX_MESSAGE =
  "Database Inzta belum memiliki index untuk total penjualan bulanan, jadi data belum bisa dihitung. Admin Inzta perlu membuat index itu sekali.";

export function isMissingIndexError(error: unknown): boolean {
  const code = (error as { code?: unknown } | null)?.code;
  return (code === 9 || code === "failed-precondition") && /requires an index/i.test(String((error as Error | null)?.message ?? ""));
}

export class InvestorDataError extends Error {}

export function adminDb(): Firestore {
  if (!getApps().length) {
    const config = readAdminConfig(process.env);
    if (!config.ok) throw new InvestorDataError(`Koneksi data belum dikonfigurasi: isi ${config.missing.join(", ")}.`);
    if (config.mode === "emulator") {
      // Without this the SDK spends seconds probing for a Google Cloud metadata server that a local machine lacks.
      process.env.METADATA_SERVER_DETECTION ??= "none";
      initializeApp({ projectId: config.projectId });
    }
    else {
      initializeApp({
        projectId: config.projectId,
        credential: cert({ projectId: config.projectId, clientEmail: config.clientEmail, privateKey: config.privateKey }),
      });
    }
  }
  return getFirestore();
}

function nextMonthStart(month: MonthKey): IsoDate {
  return `${monthKey(addMonths(toYearMonth(month), 1))}-01`;
}

// Yesterday is part of the live window because the dashboard defaults new sales to the UTC date, a day behind WIB
// until 07.00.
function previousDay(date: IsoDate): IsoDate {
  const { year, month, day } = parseIsoDate(date);
  return new Date(Date.UTC(year, month - 1, day - 1)).toISOString().slice(0, 10);
}

export function createFirestoreSource(db: Firestore) {
  const settled = new TtlCache<number>();
  const recent = new TtlCache<number>();
  const meta = new TtlCache<{ agreement: Agreement; payments: Payment[]; warnings: string[] }>();
  const first = new TtlCache<MonthKey | null>();
  const usage = new TtlCache<FundUsage>();

  /**
   * Revenue of sales dated in [from, to), summed by Firestore. An aggregation costs one read per 1,000 matching sales,
   * where reading the documents cost one read each and used up the Spark quota shared with the ERP dashboard.
   * Every production sale carries a numeric `revenue` (checked 2026-10-21), so the sellingPrice * quantity fallback
   * for legacy documents no longer applies here.
   */
  async function rangeSum(from: IsoDate, to: IsoDate): Promise<number> {
    // `date` is a "YYYY-MM-DD" string in the internal dashboard, so a string range selects whole days.
    const snap = await db.collection("sales").where("date", ">=", from).where("date", "<", to).aggregate({ revenue: AggregateField.sum("revenue") }).get();
    return Math.round(snap.data().revenue ?? 0);
  }

  async function loadMeta() {
    const [agreementSnap, paymentsSnap] = await Promise.all([db.doc("investor_agreement/current").get(), db.collection("investor_payments").get()]);
    // No document yet is normal before signing: the contract terms carry the portal until the admin adds the dates.
    const agreement = toAgreement(agreementSnap.exists ? agreementSnap.data() : undefined);
    const payments: Payment[] = [];
    const warnings: string[] = [];
    // The investor sees a plain sentence; the field names and document ids go to the server log for the admin.
    if (agreement.invalidFields.length) {
      console.warn(`investor_agreement/current: invalid ${agreement.invalidFields.join(", ")}; using the contract terms.`);
      warnings.push("Sebagian data perjanjian belum terbaca dengan benar, jadi portal memakai ketentuan perjanjian sampai admin Inzta memperbaikinya.");
    }
    let skippedPayments = 0;
    for (const doc of paymentsSnap.docs) {
      const mapped = toPayment(doc.id, doc.data());
      if (mapped.ok) payments.push(mapped.value);
      else {
        console.warn(mapped.reason);
        skippedPayments += 1;
      }
    }
    if (skippedPayments) warnings.push(`${skippedPayments} catatan pembayaran belum terbaca dan belum dihitung. Hubungi admin Inzta bila angka terasa kurang.`);
    return { agreement: agreement.value, payments, warnings };
  }

  /** Totals for any months: each is split at the live window, and the cache key carries the range, so a new day starts a new range. */
  async function monthTotals(keys: MonthKey[], today: IsoDate, nowMs: number): Promise<MonthlySales[]> {
    const recentFrom = previousDay(today);
    return Promise.all(
      keys.map(async (month) => {
        const start = `${month}-01`;
        const end = nextMonthStart(month);
        const settledTo = end < recentFrom ? end : recentFrom;
        const liveFrom = start > recentFrom ? start : recentFrom;
        const [older, live] = await Promise.all([
          settledTo > start ? settled.get(`${start}|${settledTo}`, SETTLED_TTL, nowMs, () => rangeSum(start, settledTo)) : 0,
          end > liveFrom ? recent.get(`${liveFrom}|${end}`, RECENT_TTL, nowMs, () => rangeSum(liveFrom, end)) : 0,
        ]);
        return { month, revenue: older + live };
      }),
    );
  }

  async function loadFundUsage(): Promise<FundUsage> {
    const snap = await db.collection("investor_purchases").where("investorAgreementId", "==", INVESTOR_AGREEMENT_ID).select(...FUND_USAGE_FIELDS).get();
    const items: FundUsageItem[] = [];
    let skipped = 0;
    for (const doc of snap.docs) {
      const mapped = toFundUsageItem(doc.id, doc.data());
      if (mapped.ok) items.push(mapped.value);
      else {
        console.warn(mapped.reason);
        skipped += 1;
      }
    }
    return { items, skipped };
  }

  async function loadFirstSaleMonth(): Promise<MonthKey | null> {
    // The string range keeps documents whose date is not text out of the ordering, as the month queries do.
    const snap = await db.collection("sales").where("date", ">=", "").orderBy("date").limit(1).select("date").get();
    const date = snap.docs[0]?.get("date");
    return typeof date === "string" && /^\d{4}-\d{2}/.test(date) ? date.slice(0, 7) : null;
  }

  return {
    async getSnapshot(today: IsoDate, nowMs = Date.now()): Promise<InvestorSnapshot> {
      const keys = Array.from({ length: 12 }, (_, i) => monthKey(addMonths(toYearMonth(today), i - 11)));
      const [{ agreement, payments, warnings }, monthlySales] = await Promise.all([
        meta.get("current", AGREEMENT_TTL, nowMs, loadMeta),
        monthTotals(keys, today, nowMs),
      ]);
      return { source: "firestore", agreement, payments, monthlySales, asOf: today, warnings };
    },
    getMonths(keys: MonthKey[], today: IsoDate, nowMs = Date.now()): Promise<MonthlySales[]> {
      return monthTotals(keys, today, nowMs);
    },
    async getFirstSaleMonth(nowMs = Date.now()): Promise<MonthKey | null> {
      return first.get("first", SETTLED_TTL, nowMs, loadFirstSaleMonth);
    },
    getFundUsage(nowMs = Date.now()): Promise<FundUsage> {
      return usage.get(INVESTOR_AGREEMENT_ID, AGREEMENT_TTL, nowMs, loadFundUsage);
    },
  };
}
