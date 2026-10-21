import assert from "node:assert/strict";
import { test } from "node:test";

import { agreementMonthKey, formatDate, formatDueWindow, formatMonth, monthName } from "./dates.ts";

test("Indonesian month and date labels", () => {
  assert.equal(formatMonth("2027-01"), "Jan 2027");
  assert.equal(formatMonth("2026-08", "long"), "Agustus 2026");
  assert.equal(monthName("2026-05"), "Mei");
  assert.equal(formatDate("2026-12-25"), "25 Des 2026");
  assert.equal(formatDueWindow("2027-01-25", "2027-01-26"), "25–26 Jan 2027");
});

test("agreement month labels need an Effective Date", () => {
  assert.equal(agreementMonthKey("2026-11-10", 1), "2026-12");
  assert.equal(agreementMonthKey("2026-11-10", 24), "2028-11");
  assert.equal(agreementMonthKey(null, 3), null);
});
