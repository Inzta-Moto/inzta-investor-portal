import type { DataSourceKind, InvestorSnapshot, IsoDate } from "../investment/types.ts";
import { createMockSource, type MockScenario } from "./mock.ts";

/** The only way pages get investor data (ADR-0003). A Firestore adapter implements the same contract in F-006. */
export interface InvestorDataSource {
  readonly kind: DataSourceKind;
  getSnapshot(today: IsoDate): Promise<InvestorSnapshot>;
}

/** Never throws, so the layout can render its shell even when the setting is wrong. */
export function dataSourceKind(setting: string | undefined): DataSourceKind {
  return (setting?.trim() || "mock") === "mock" ? "mock" : "firestore";
}

export function getDataSource(setting: string | undefined, scenario: MockScenario = "awal"): InvestorDataSource {
  const value = setting?.trim() || "mock";
  if (value === "mock") return createMockSource(scenario);
  throw new Error(`Sumber data "${value}" belum tersedia; integrasi Firestore ditahan sampai F-006. Pakai INVESTOR_DATA_SOURCE=mock.`);
}
