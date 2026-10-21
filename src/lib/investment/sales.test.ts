import assert from "node:assert/strict";
import { test } from "node:test";

import { availableYears, filterMonths, lastTwelveMonths, latestCompleteChange, monthFocus, parseSalesFilter, saleRevenue, salesPoints } from "./sales.ts";

test("AC-010: revenue first, then selling price times quantity, then zero", () => {
  assert.equal(saleRevenue({ revenue: 165_000, sellingPrice: 999, quantity: 9 }), 165_000);
  assert.equal(saleRevenue({ sellingPrice: 165_000, quantity: 2 }), 330_000);
  assert.equal(saleRevenue({ revenue: "abc", sellingPrice: 100_000, quantity: 3 }), 300_000);
  assert.equal(saleRevenue({ revenue: "195000" }), 195_000);
  assert.equal(saleRevenue({}), 0);
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

test("years run from the first sale to this year, newest first", () => {
  assert.deepEqual(availableYears("2026-05", "2027-03-14"), [2027, 2026]);
  assert.deepEqual(availableYears(null, "2026-10-21"), [2026]);
});

test("the URL filter accepts known years and past months only", () => {
  const years = [2026];
  assert.equal(parseSalesFilter({}, years, "2026-10-21"), null);
  assert.equal(parseSalesFilter({ tahun: "2019" }, years, "2026-10-21"), null);
  assert.deepEqual(parseSalesFilter({ tahun: "2026" }, years, "2026-10-21"), { year: 2026, month: null });
  assert.deepEqual(parseSalesFilter({ tahun: "2026", bulan: "8" }, years, "2026-10-21"), { year: 2026, month: 8 });
  assert.deepEqual(parseSalesFilter({ tahun: "2026", bulan: "12" }, years, "2026-10-21"), { year: 2026, month: null });
  assert.deepEqual(parseSalesFilter({ tahun: ["2026", "2025"], bulan: "abc" }, years, "2026-10-21"), { year: 2026, month: null });
});

test("a chosen year shows January up to this month, a past year all twelve", () => {
  assert.deepEqual(filterMonths({ year: 2026, month: null }, "2026-03-02"), ["2026-01", "2026-02", "2026-03"]);
  assert.equal(filterMonths({ year: 2026, month: 8 }, "2027-01-05").length, 12);
  assert.equal(filterMonths(null, "2026-10-21").at(-1), "2026-10");
  const points = salesPoints(["2026-09", "2026-10"], [{ month: "2026-09", revenue: 5 }], "2026-10-21");
  assert.deepEqual(points, [{ month: "2026-09", revenue: 5, running: false }, { month: "2026-10", revenue: 0, running: true }]);
});

test("a chosen January is compared with December of the year before", () => {
  const focus = monthFocus("2027-01", [{ month: "2026-12", revenue: 200 }, { month: "2027-01", revenue: 250 }], "2027-03-01");
  assert.deepEqual(focus, { month: "2027-01", revenue: 250, previous: "2026-12", previousRevenue: 200, changeBasisPoints: 2500, running: false });
  assert.equal(monthFocus("2026-05", [{ month: "2026-05", revenue: 9 }], "2026-05-20").changeBasisPoints, null);
});

