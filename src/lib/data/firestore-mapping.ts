import { CONTRACT_TERMS } from "../investment/contract-terms.ts";
import type { Agreement, IsoDate, Payment, RepaymentTerm, Tranche } from "../investment/types.ts";

// Firestore documents are written by hand in the Console (A-008), so every field is checked before it reaches the
// money rules; a malformed field becomes a warning instead of a wrong number.

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

/**
 * Fields the admin filled override the contract terms; a missing field keeps the contract value, and a malformed one
 * keeps it too with a warning, so a typo in the Console never takes the portal down or invents a number.
 */
export function toAgreement(data: Data | undefined): { value: Agreement; warnings: string[] } {
  const value: Agreement = structuredClone(CONTRACT_TERMS);
  const warnings: string[] = [];
  if (!data) return { value, warnings };
  const present = (field: string) => data[field] !== undefined && data[field] !== null;
  const reject = (field: string) => warnings.push(`investor_agreement/current: ${field} tidak valid, memakai ketentuan perjanjian.`);

  const effectiveDate = isoOrNull(data.effectiveDate);
  if (effectiveDate === undefined) reject("effectiveDate");
  else value.effectiveDate = effectiveDate;

  if (present("totalInvestment")) {
    const total = wholeRupiah(data.totalInvestment);
    if (total) value.totalInvestment = total;
    else reject("totalInvestment");
  }
  if (present("termMonths")) {
    if (typeof data.termMonths === "number" && Number.isInteger(data.termMonths) && data.termMonths > 0) value.termMonths = data.termMonths;
    else reject("termMonths");
  }
  if (present("commissionRateBasisPoints")) {
    const rate = basisPointsOrNull(data.commissionRateBasisPoints);
    if (rate !== undefined && rate !== null) value.commissionRateBasisPoints = rate;
    else reject("commissionRateBasisPoints");
  }

  if (present("tranches")) {
    const raw = Array.isArray(data.tranches) ? (data.tranches as Data[]) : null;
    const tranches: Tranche[] = [];
    for (const [index, item] of (raw ?? []).entries()) {
      const amount = wholeRupiah(item?.amount);
      const receivedDate = isoOrNull(item?.receivedDate);
      if (amount === null || receivedDate === undefined || index > 1) break;
      tranches.push({ number: (index + 1) as 1 | 2, amount, receivedDate });
    }
    if (raw && raw.length > 0 && tranches.length === raw.length) value.tranches = tranches;
    else reject("tranches");
  }

  if (present("repayments")) {
    const raw = Array.isArray(data.repayments) ? (data.repayments as Data[]) : null;
    const repayments: RepaymentTerm[] = [];
    for (const [index, item] of (raw ?? []).entries()) {
      const dueMonth = typeof item?.dueMonth === "number" && Number.isInteger(item.dueMonth) && item.dueMonth >= 1 && item.dueMonth <= value.termMonths ? item.dueMonth : null;
      const percentBasisPoints = basisPointsOrNull(item?.percentBasisPoints);
      if (dueMonth === null || percentBasisPoints === undefined) break;
      repayments.push({ number: (index + 1) as 1 | 2 | 3, dueMonth, percentBasisPoints });
    }
    if (raw?.length === 3 && repayments.length === 3) value.repayments = repayments;
    else reject("repayments (harus tepat 3)");
  }

  return { value, warnings };
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
