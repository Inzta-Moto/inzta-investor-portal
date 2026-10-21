import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

import { addMonths, monthKey, parseIsoDate, toYearMonth } from "../investment/calendar.ts";
import { saleRevenue } from "../investment/sales.ts";
import type { Agreement, InvestorSnapshot, IsoDate, MonthKey, MonthlySales, Payment } from "../investment/types.ts";
import { readAdminConfig } from "./admin-config.ts";
import { toAgreement, toPayment } from "./firestore-mapping.ts";
import { TtlCache } from "./ttl-cache.ts";

// Only these sales fields are ever fetched (ADR-0006): customer, city, reseller, and cost price stay in Firestore.
export const SALES_FIELDS = ["date", "revenue", "sellingPrice", "quantity"] as const;

// The Spark plan's daily read quota is shared with the internal dashboard, so only sales dated yesterday or later are
// re-read on every 30-second refresh; older days seldom change and are re-read once an hour.
const RECENT_TTL = 25_000;
const SETTLED_TTL = 60 * 60_000;
const AGREEMENT_TTL = 25_000;

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
  const settled = new TtlCache<Map<MonthKey, number>>();
  const recent = new TtlCache<Map<MonthKey, number>>();
  const meta = new TtlCache<{ agreement: Agreement; payments: Payment[]; warnings: string[] }>();
  const first = new TtlCache<MonthKey | null>();

  /** Revenue per month for sales dated in [from, to), or from `from` onwards when `to` is null. */
  async function rangeTotals(from: IsoDate, to: IsoDate | null): Promise<Map<MonthKey, number>> {
    // `date` is a "YYYY-MM-DD" string in the internal dashboard, so a string range selects whole days.
    let query = db.collection("sales").where("date", ">=", from);
    if (to) query = query.where("date", "<", to);
    const snap = await query.select(...SALES_FIELDS).get();
    const totals = new Map<MonthKey, number>();
    for (const doc of snap.docs) {
      const data = doc.data();
      if (typeof data.date !== "string") continue;
      const month = data.date.slice(0, 7);
      totals.set(month, (totals.get(month) ?? 0) + saleRevenue(data));
    }
    return totals;
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
    const settledRanges = keys.map((key) => {
      const from = `${key}-01`;
      const end = nextMonthStart(key);
      return { from, to: end < recentFrom ? end : recentFrom };
    });
    const [live, ...older] = await Promise.all([
      recent.get(recentFrom, RECENT_TTL, nowMs, () => rangeTotals(recentFrom, null)),
      ...settledRanges.map(({ from, to }) =>
        to <= from ? Promise.resolve(new Map<MonthKey, number>()) : settled.get(`${from}|${to}`, SETTLED_TTL, nowMs, () => rangeTotals(from, to)),
      ),
    ]);
    return keys.map((month, i) => ({ month, revenue: (older[i].get(month) ?? 0) + (live.get(month) ?? 0) }));
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
  };
}
