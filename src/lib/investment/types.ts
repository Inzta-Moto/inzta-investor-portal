// Shapes the portal reads. They mirror the proposed `investor_*` collections (docs/architecture/data-model.md),
// never the raw `sales` documents, so the mock and the future Firestore adapter return the same contract (ADR-0003).

/** Calendar date `YYYY-MM-DD`, the same string format the internal dashboard stores. */
export type IsoDate = string;
/** Calendar month `YYYY-MM`. */
export type MonthKey = string;

export type RepaymentTerm = {
  number: 1 | 2 | 3;
  /** Agreement month the repayment is due with that month's commission (16, 20, 24). */
  dueMonth: number;
  /** Share of the total investment in basis points (10000 = 100%); null until the admin enters the signed value. */
  percentBasisPoints: number | null;
};

export type Tranche = {
  number: 1 | 2;
  amount: number;
  receivedDate: IsoDate | null;
};

export type Agreement = {
  /** Date tranche I arrived in full; null until the agreement is signed and funded. */
  effectiveDate: IsoDate | null;
  termMonths: number;
  totalInvestment: number;
  commissionRateBasisPoints: number;
  tranches: Tranche[];
  repayments: RepaymentTerm[];
};

export type Payment = {
  kind: "commission" | "repayment";
  /** Agreement month 1..24 the payment settles. */
  periodMonth: number;
  repaymentNumber?: 1 | 2 | 3;
  amount: number;
  paidDate: IsoDate;
  note?: string;
};

export type MonthlySales = {
  month: MonthKey;
  revenue: number;
};

export type DataSourceKind = "mock" | "firestore";

export type InvestorSnapshot = {
  source: DataSourceKind;
  agreement: Agreement;
  payments: Payment[];
  monthlySales: MonthlySales[];
  /** When the summary was produced; shown as "Diperbarui". */
  asOf: IsoDate;
};

export type ScheduleStatus = "paid" | "due" | "late" | "upcoming" | "unset";
