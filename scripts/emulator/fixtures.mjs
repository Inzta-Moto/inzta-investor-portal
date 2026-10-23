// Test data for the local Firestore emulator only (project "demo-inzta"); it is never written to the real project.
// The sales documents mirror the internal dashboard's shape, including fields the investor must never receive.

function monthKey(year, month) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function shift(year, month, delta) {
  const index = year * 12 + (month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

/** Builds fixtures relative to `today` (YYYY-MM-DD) so the emulator always shows agreement month 3. */
export function buildFixtures(today) {
  const [year, month] = today.split("-").map(Number);
  const effective = shift(year, month, -3);
  const effectiveDate = `${monthKey(effective.year, effective.month)}-10`;
  const due = (n) => {
    const m = shift(effective.year, effective.month, n);
    return `${monthKey(m.year, m.month)}-25`;
  };

  const agreement = {
    effectiveDate,
    termMonths: 24,
    totalInvestment: 200000000,
    commissionRateBasisPoints: 320,
    tranches: [
      { amount: 150000000, receivedDate: effectiveDate },
      { amount: 50000000, receivedDate: null },
    ],
    repayments: [
      { dueMonth: 16, percentBasisPoints: 2500 },
      { dueMonth: 20, percentBasisPoints: 2500 },
      { dueMonth: 24, percentBasisPoints: 5000 },
    ],
  };

  const payments = {
    "commission-1": { kind: "commission", periodMonth: 1, amount: 6400000, paidDate: due(1), note: "Transfer BCA" },
    "commission-2": { kind: "commission", periodMonth: 2, amount: 6400000, paidDate: due(2) },
  };

  const current = monthKey(year, month);
  const previous = (() => {
    const m = shift(year, month, -1);
    return monthKey(m.year, m.month);
  })();
  const sales = {
    "sale-a": { date: `${previous}-03`, revenue: 165000, quantity: 1, sellingPrice: 165000, costPrice: 85000, customer: "Pelanggan A", city: "Bandung", resellerName: "Reseller X" },
    "sale-b": { date: `${previous}-17`, revenue: 390000, quantity: 2, sellingPrice: 195000, costPrice: 95000, customer: "Pelanggan B", city: "Jakarta" },
    // Every production sale stores `revenue` (checked 2026-10-21); the portal sums that field with a Firestore aggregation.
    "sale-c": { date: `${current}-02`, revenue: 885000, quantity: 3, sellingPrice: 295000, costPrice: 150000, customer: "Pelanggan C", city: "Surabaya" },
    "sale-d": { date: `${current}-05`, revenue: 165000, quantity: 1, sellingPrice: 165000, costPrice: 85000, customer: "Pelanggan D", district: "Coblong" },
  };

  // Belanja Investasi as the ERP's own menu stores it; only six of its fields reach the portal.
  const investorPurchases = {
    "purchase-a": { date: `${current}-03`, itemName: "Kain canvas", category: "bahan", quantity: 10, unit: "meter", unitPrice: 31000, totalCost: 310000, note: "Toko A, transfer", investorAgreementId: "current", createdBy: "uid-admin" },
    "purchase-b": { date: `${previous}-20`, itemName: "Listrik", category: "Operasional", quantity: 1, unit: "pcs", unitPrice: 300000, totalCost: 300000, note: "Tgl 8", investorAgreementId: "current" },
  };

  // Belanja Produksi stays out of the portal, even an item still carrying the marker from the first F-009 version.
  const productionPurchases = {
    "purchase-c": { date: `${current}-04`, weekKey: `${current}-W1`, itemName: "Bisban 4cm", category: "bahan", quantity: 1, unit: "pcs", unitPrice: 142000, totalCost: 142000, note: "", status: "open", investorAgreementId: "current" },
  };

  return { agreement, payments, sales, investorPurchases, productionPurchases, current, previous };
}
