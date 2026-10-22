import assert from "node:assert/strict";
import { test } from "node:test";

import { groupFundUsage } from "./fund-usage.ts";
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
