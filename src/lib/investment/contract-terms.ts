import type { Agreement } from "./types.ts";

/**
 * Terms already fixed by the agreement draft (Pasal 2 to 5, version of 2026-10-21), so the portal runs before anyone
 * writes `investor_agreement/current`. Only what is decided at signing or funding stays null: the Effective Date,
 * the tranche dates, and the three repayment percentages. A Firestore document overrides any of these fields.
 */
export const CONTRACT_TERMS: Agreement = {
  effectiveDate: null,
  termMonths: 24,
  totalInvestment: 200_000_000,
  commissionRateBasisPoints: 320,
  tranches: [
    { number: 1, amount: 150_000_000, receivedDate: null },
    { number: 2, amount: 50_000_000, receivedDate: null },
  ],
  repayments: [
    { number: 1, dueMonth: 16, percentBasisPoints: null },
    { number: 2, dueMonth: 20, percentBasisPoints: null },
    { number: 3, dueMonth: 24, percentBasisPoints: null },
  ],
};
