import assert from "node:assert/strict";
import { test } from "node:test";

import { groupFundUsage, pageFundUsage } from "./fund-usage.ts";
import type { FundUsageItem } from "./types.ts";

const item = (date: string, itemName: string): FundUsageItem => ({ date, itemName, category: "bahan", quantity: 1, unit: "pcs", amount: 100_000 });

test("F-009 AC-005: newest month first, newest day first, same-day items in name order", () => {
  const months = groupFundUsage([item("2026-09-30", "kain"), item("2026-10-17", "terpal uno"), item("2026-10-18", "Listrik"), item("2026-10-17", "bisban z10")]);
  assert.deepEqual(months.map((m) => m.month), ["2026-10", "2026-09"]);
  assert.deepEqual(months[0].items.map((i) => i.itemName), ["Listrik", "bisban z10", "terpal uno"]);
});

test("F-009 AC-008: no marked purchase gives no month", () => {
  assert.deepEqual(groupFundUsage([]), []);
});

test("F-009: a month with more items than one page is split, and pages never mix months", () => {
  const october = Array.from({ length: 23 }, (_, i) => item(`2026-10-${String(1 + (i % 28)).padStart(2, "0")}`, `barang ${i}`));
  const pages = pageFundUsage(groupFundUsage([...october, item("2026-09-30", "kain")]), 10);
  assert.deepEqual(pages.map((p) => [p.month, p.items.length]), [["2026-10", 10], ["2026-10", 10], ["2026-10", 3], ["2026-09", 1]]);
});
