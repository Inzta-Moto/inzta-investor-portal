import type { InvestorSnapshot, IsoDate, MonthKey, MonthlySales } from "../investment/types.ts";
import { adminDb, createFirestoreSource, type FundUsage } from "./firestore-source.ts";

/** The only way pages get investor data (ADR-0003, ADR-0006): the server reads Firestore with the Admin SDK. */
export interface InvestorDataSource {
  getSnapshot(today: IsoDate, nowMs?: number): Promise<InvestorSnapshot>;
  /** Monthly sales totals for any months, for the Penjualan month and year filter. */
  getMonths(months: MonthKey[], today: IsoDate, nowMs?: number): Promise<MonthlySales[]>;
  getFirstSaleMonth(nowMs?: number): Promise<MonthKey | null>;
  /** Belanja Produksi items the admin marked as paid from the investment (ADR-0007). */
  getFundUsage(nowMs?: number): Promise<FundUsage>;
}

// One source per server instance, so its month cache survives between requests.
let source: InvestorDataSource | null = null;

export function getDataSource(): InvestorDataSource {
  source ??= createFirestoreSource(adminDb());
  return source;
}
