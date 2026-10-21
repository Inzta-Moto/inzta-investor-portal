import assert from "node:assert/strict";
import { test } from "node:test";

import { aggregateMonthlySales, lastTwelveMonths, latestCompleteChange, saleRevenue } from "./sales.ts";

test("AC-010: revenue first, then selling price times quantity, then zero", () => {
  assert.equal(saleRevenue({ revenue: 165_000, sellingPrice: 999, quantity: 9 }), 165_000);
  assert.equal(saleRevenue({ sellingPrice: 165_000, quantity: 2 }), 330_000);
  assert.equal(saleRevenue({ revenue: "abc", sellingPrice: 100_000, quantity: 3 }), 300_000);
  assert.equal(saleRevenue({ revenue: "195000" }), 195_000);
  assert.equal(saleRevenue({}), 0);
});

test("sales are summed per calendar month of their date and undated rows are skipped", () => {
  const monthly = aggregateMonthlySales([
    { date: "2026-11-02", revenue: 165_000 },
    { date: "2026-11-30", sellingPrice: 195_000, quantity: 2 },
    { date: "2026-12-01", revenue: 295_000 },
    { date: "", revenue: 1 },
    { revenue: 1 },
  ]);
  assert.deepEqual(monthly, [
    { month: "2026-11", revenue: 555_000 },
    { month: "2026-12", revenue: 295_000 },
  ]);
});

test("AC-011: twelve consecutive months ending today, zero-filled, last one running", () => {
  const points = lastTwelveMonths([{ month: "2027-01", revenue: 24_300_000 }, { month: "2026-12", revenue: 66_800_000 }], "2027-01-14");
  assert.equal(points.length, 12);
  assert.equal(points[0].month, "2026-02");
  assert.equal(points[11].month, "2027-01");
  assert.equal(points[11].running, true);
  assert.equal(points[10].revenue, 66_800_000);
  assert.equal(points[0].revenue, 0);
  assert.equal(points.filter((p) => p.running).length, 1);
});

test("the change compares the latest complete month with the one before", () => {
  const points = lastTwelveMonths(
    [
      { month: "2026-11", revenue: 61_500_000 },
      { month: "2026-12", revenue: 66_800_000 },
      { month: "2027-01", revenue: 24_300_000 },
    ],
    "2027-01-14",
  );
  const change = latestCompleteChange(points);
  assert.equal(change?.month, "2026-12");
  assert.equal(change?.changeBasisPoints, 862);
  const empty = latestCompleteChange(lastTwelveMonths([{ month: "2026-12", revenue: 5 }], "2027-01-14"));
  assert.equal(empty?.changeBasisPoints, null);
});
