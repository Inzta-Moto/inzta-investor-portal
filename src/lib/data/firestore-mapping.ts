import type { Agreement, IsoDate, Payment, RepaymentTerm, Tranche } from "../investment/types.ts";

// Firestore documents are written by hand in the Console (A-008), so every field is checked before it reaches the
// money rules; a malformed document becomes a warning instead of a wrong number.

export type Mapped<T> = { ok: true; value: T } | { ok: false; reason: string };

type Data = Record<string, unknown>;

const ISO = /^\d{4}-\d{2}-\d{2}$/;

function wholeRupiah(value: unknown): number | null {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

function isoOrNull(value: unknown): IsoDate | null | undefined {
  if (value === null || value === undefined || value === "") return null;
  return typeof value === "string" && ISO.test(value) ? value : undefined;
}

function basisPointsOrNull(value: unknown): number | null | undefined {
  if (value === null || value === undefined || value === "") return null;
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 10_000 ? value : undefined;
}

export function toAgreement(data: Data | undefined): Mapped<Agreement> {
  if (!data) return { ok: false, reason: "Dokumen investor_agreement/current belum ada." };
  const effectiveDate = isoOrNull(data.effectiveDate);
  if (effectiveDate === undefined) return { ok: false, reason: "effectiveDate harus berformat YYYY-MM-DD atau kosong." };
  const totalInvestment = wholeRupiah(data.totalInvestment);
  if (!totalInvestment) return { ok: false, reason: "totalInvestment harus Rupiah bulat lebih dari 0." };
  const termMonths = typeof data.termMonths === "number" && Number.isInteger(data.termMonths) && data.termMonths > 0 ? data.termMonths : null;
  if (!termMonths) return { ok: false, reason: "termMonths harus bilangan bulat lebih dari 0." };
  const rate = basisPointsOrNull(data.commissionRateBasisPoints);
  if (rate === undefined || rate === null) return { ok: false, reason: "commissionRateBasisPoints harus 0 sampai 10000." };

  const rawTranches = Array.isArray(data.tranches) ? (data.tranches as Data[]) : [];
  const tranches: Tranche[] = [];
  for (const [index, raw] of rawTranches.entries()) {
    const amount = wholeRupiah(raw?.amount);
    const receivedDate = isoOrNull(raw?.receivedDate);
    if (amount === null || receivedDate === undefined) return { ok: false, reason: `tranches[${index}] tidak valid.` };
    tranches.push({ number: (index + 1) as 1 | 2, amount, receivedDate });
  }

  const rawRepayments = Array.isArray(data.repayments) ? (data.repayments as Data[]) : [];
  if (rawRepayments.length !== 3) return { ok: false, reason: "repayments harus berisi tepat 3 pengembalian." };
  const repayments: RepaymentTerm[] = [];
  for (const [index, raw] of rawRepayments.entries()) {
    const dueMonth = typeof raw?.dueMonth === "number" && Number.isInteger(raw.dueMonth) && raw.dueMonth >= 1 && raw.dueMonth <= termMonths ? raw.dueMonth : null;
    const percentBasisPoints = basisPointsOrNull(raw?.percentBasisPoints);
    if (dueMonth === null || percentBasisPoints === undefined) return { ok: false, reason: `repayments[${index}] tidak valid.` };
    repayments.push({ number: (index + 1) as 1 | 2 | 3, dueMonth, percentBasisPoints });
  }

  return { ok: true, value: { effectiveDate, termMonths, totalInvestment, commissionRateBasisPoints: rate, tranches, repayments } };
}

export function toPayment(id: string, data: Data): Mapped<Payment> {
  const kind = data.kind === "commission" || data.kind === "repayment" ? data.kind : null;
  const periodMonth = typeof data.periodMonth === "number" && Number.isInteger(data.periodMonth) && data.periodMonth >= 1 ? data.periodMonth : null;
  const amount = wholeRupiah(data.amount);
  const paidDate = isoOrNull(data.paidDate);
  if (!kind || periodMonth === null || amount === null || !paidDate) return { ok: false, reason: `investor_payments/${id} tidak valid dan diabaikan.` };
  const payment: Payment = { kind, periodMonth, amount, paidDate };
  if (kind === "repayment") {
    const number = data.repaymentNumber;
    if (number !== 1 && number !== 2 && number !== 3) return { ok: false, reason: `investor_payments/${id}: repaymentNumber harus 1, 2, atau 3.` };
    payment.repaymentNumber = number;
  }
  if (typeof data.note === "string" && data.note.trim()) payment.note = data.note.trim();
  return { ok: true, value: payment };
}
