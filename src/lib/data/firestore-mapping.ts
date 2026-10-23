import { CONTRACT_TERMS } from "../investment/contract-terms.ts";
import type { Agreement, FundUsageItem, IsoDate, Payment, RepaymentTerm, Tranche } from "../investment/types.ts";

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
 * keeps it too and is listed in invalidFields, so a typo in the Console never takes the portal down or invents a number.
 */
export function toAgreement(data: Data | undefined): { value: Agreement; invalidFields: string[] } {
  const value: Agreement = structuredClone(CONTRACT_TERMS);
  const invalidFields: string[] = [];
  if (!data) return { value, invalidFields };
  const present = (field: string) => data[field] !== undefined && data[field] !== null;
  const reject = (field: string) => invalidFields.push(field);

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
    // Rows are numbered by position, so the due months must rise; a reordered or repeated row would mislabel an installment.
    const rising = repayments.every((item, index) => index === 0 || item.dueMonth > repayments[index - 1].dueMonth);
    if (raw?.length === 3 && repayments.length === 3 && rising) value.repayments = repayments;
    else reject("repayments");
  }

  return { value, invalidFields };
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

/** Belanja Investasi items are typed by hand in the ERP, so an item with a broken field is skipped, not guessed. */
export function toFundUsageItem(id: string, data: Data): Mapped<FundUsageItem> {
  const date = isoOrNull(data.date);
  const itemName = typeof data.itemName === "string" ? data.itemName.trim() : "";
  const quantity = typeof data.quantity === "number" && Number.isFinite(data.quantity) && data.quantity > 0 ? data.quantity : null;
  // The ERP stores Math.round(quantity * unitPrice); rounding again keeps an older fractional total readable.
  const amount = typeof data.totalCost === "number" && Number.isFinite(data.totalCost) && data.totalCost >= 0 ? Math.round(data.totalCost) : null;
  if (!date || !itemName || quantity === null || amount === null) return { ok: false, reason: `investor_purchases/${id} tidak valid dan diabaikan.` };
  return {
    ok: true,
    value: {
      date,
      itemName,
      category: typeof data.category === "string" ? data.category.trim() : "",
      quantity,
      unit: typeof data.unit === "string" ? data.unit.trim() : "",
      amount,
    },
  };
}
