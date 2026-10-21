import assert from "node:assert/strict";
import { test } from "node:test";

import { formatRupiah, isRupiah } from "./rupiah.ts";

const NBSP = " ";
const MINUS = "−";

test("formats whole Rupiah with dot grouping and a non-breaking space", () => {
  assert.equal(formatRupiah(4_800_000), `Rp${NBSP}4.800.000`);
  assert.equal(formatRupiah(200_000_000), `Rp${NBSP}200.000.000`);
  assert.equal(formatRupiah(0), `Rp${NBSP}0`);
});

test("marks negative amounts with a true minus sign", () => {
  assert.equal(formatRupiah(-50_000), `${MINUS}Rp${NBSP}50.000`);
});

test("rejects fractions and non-numbers", () => {
  assert.throws(() => formatRupiah(1.5), RangeError);
  assert.throws(() => formatRupiah(Number.NaN), RangeError);
  assert.equal(isRupiah("1000"), false);
});
