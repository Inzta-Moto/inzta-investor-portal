import type { InvestorSnapshot, IsoDate, MonthKey, MonthlySales } from "../investment/types.ts";
import { adminDb, createFirestoreSource, isQuotaError } from "./firestore-source.ts";
import { snapshotSource } from "./snapshot-source.ts";

/** The only way pages get investor data (ADR-0003, ADR-0006): the server reads Firestore with the Admin SDK. */
export interface InvestorDataSource {
  getSnapshot(today: IsoDate, nowMs?: number): Promise<InvestorSnapshot>;
  /** Monthly sales totals for any months, for the Penjualan month and year filter. */
  getMonths(months: MonthKey[], today: IsoDate, nowMs?: number): Promise<MonthlySales[]>;
  getFirstSaleMonth(nowMs?: number): Promise<MonthKey | null>;
}

// One source per server instance, so its month cache survives between requests.
let source: InvestorDataSource | null = null;

/** Firestore first; while it refuses reads for quota, the saved copy keeps the portal usable. */
async function withFallback<T>(live: () => Promise<T>, saved: () => Promise<T>): Promise<T> {
  try {
    return await live();
  } catch (error) {
    if (!isQuotaError(error)) throw error;
    console.warn("Firestore read quota exhausted; serving the saved copy of 2026-10-21.");
    return saved();
  }
}

export function getDataSource(): InvestorDataSource {
  if (!source) {
    const firestore = createFirestoreSource(adminDb());
    source = {
      getSnapshot: (today, nowMs) => withFallback(() => firestore.getSnapshot(today, nowMs), () => snapshotSource.getSnapshot(today)),
      getMonths: (months, today, nowMs) => withFallback(() => firestore.getMonths(months, today, nowMs), () => snapshotSource.getMonths(months)),
      getFirstSaleMonth: (nowMs) => withFallback(() => firestore.getFirstSaleMonth(nowMs), () => snapshotSource.getFirstSaleMonth()),
    };
  }
  return source;
}
