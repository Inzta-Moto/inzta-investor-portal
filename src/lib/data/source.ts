import type { InvestorSnapshot, IsoDate } from "../investment/types.ts";
import { adminDb, createFirestoreSource } from "./firestore-source.ts";

/** The only way pages get investor data (ADR-0003, ADR-0006): the server reads Firestore with the Admin SDK. */
export interface InvestorDataSource {
  getSnapshot(today: IsoDate, nowMs?: number): Promise<InvestorSnapshot>;
}

// One source per server instance, so its month cache survives between requests.
let source: InvestorDataSource | null = null;

export function getDataSource(): InvestorDataSource {
  source ??= createFirestoreSource(adminDb());
  return source;
}
