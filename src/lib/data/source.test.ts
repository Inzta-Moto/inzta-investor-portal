import assert from "node:assert/strict";
import { test } from "node:test";

import { buildPortfolio } from "../investment/portfolio.ts";
import { MOCK_SCENARIOS, mockSnapshot, parseMockScenario } from "./mock.ts";
import { getDataSource } from "./source.ts";

test("AC-012: the default mock sits in month 3 with months 1 and 2 paid and repayments unset", async () => {
  for (const today of ["2026-10-21", "2027-01-14", "2028-02-29"]) {
    const snapshot = await getDataSource(undefined).getSnapshot(today);
    const portfolio = buildPortfolio(snapshot, today);
    assert.deepEqual(portfolio.phase, { kind: "running", month: MOCK_SCENARIOS.awal.month });
    assert.deepEqual(portfolio.commission.items.slice(0, 2).map((item) => item.status), ["paid", "paid"]);
    const lateInMonth = Number(today.slice(8, 10)) > 26;
    assert.equal(portfolio.commission.current?.status, lateInMonth ? "paid" : "due");
    assert.equal(portfolio.commission.totals.received, lateInMonth ? 19_200_000 : 12_800_000);
    assert.ok(portfolio.repayment.items.every((item) => item.status === "unset"));
    assert.equal(portfolio.repayment.totals.returned, 0);
    assert.equal(portfolio.sales.points.at(-1)?.revenue, 24_300_000);
    assert.equal(portfolio.source, "mock");
    assert.deepEqual(portfolio.warnings, []);
  }
});

test("AC-012: the year-two scenario has two repayments in, Rp100 jt returned of Rp200 jt", async () => {
  const today = "2026-10-21";
  const portfolio = buildPortfolio(await getDataSource("mock", "tahun-kedua").getSnapshot(today), today);
  assert.deepEqual(portfolio.phase, { kind: "running", month: 21 });
  assert.equal(portfolio.commission.totals.received, 20 * 6_400_000);
  assert.deepEqual(portfolio.repayment.items.map((item) => item.status), ["paid", "paid", "upcoming"]);
  assert.deepEqual(portfolio.repayment.items.map((item) => item.amount), [50_000_000, 50_000_000, 100_000_000]);
  assert.deepEqual(portfolio.repayment.totals, { total: 200_000_000, returned: 100_000_000, remaining: 100_000_000, returnedBasisPoints: 5000 });
  assert.equal(portfolio.repayment.next?.number, 3);
});

test("the mock is deterministic for a given day and scenario", () => {
  assert.deepEqual(mockSnapshot("2027-01-14"), mockSnapshot("2027-01-14"));
  assert.deepEqual(mockSnapshot("2027-01-14", "tahun-kedua"), mockSnapshot("2027-01-14", "tahun-kedua"));
});

test("unknown scenario names fall back to the default", () => {
  assert.equal(parseMockScenario("tahun-kedua"), "tahun-kedua");
  assert.equal(parseMockScenario("lain"), "awal");
  assert.equal(parseMockScenario(["tahun-kedua"]), "awal");
  assert.equal(parseMockScenario(undefined), "awal");
});

test("AC-013: any source other than mock is refused until F-006", () => {
  assert.equal(getDataSource("mock").kind, "mock");
  assert.equal(getDataSource("  ").kind, "mock");
  assert.throws(() => getDataSource("firestore"), /F-006/);
});
