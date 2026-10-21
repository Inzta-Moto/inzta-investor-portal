import assert from "node:assert/strict";
import { test } from "node:test";

import { formatRupiah, formatRupiahCompact, isRupiah } from "./rupiah.ts";

const NBSP = " ";
const MINUS = "−";

test("formats whole Rupiah with dot grouping and the symbol attached", () => {
  assert.equal(formatRupiah(6_400_000), "Rp6.400.000");
  assert.equal(formatRupiah(200_000_000), "Rp200.000.000");
  assert.equal(formatRupiah(0), "Rp0");
});

test("marks negative amounts with a true minus sign", () => {
  assert.equal(formatRupiah(-50_000), `${MINUS}Rp50.000`);
});

test("rejects fractions and non-numbers", () => {
  assert.throws(() => formatRupiah(1.5), RangeError);
  assert.throws(() => formatRupiah(Number.NaN), RangeError);
  assert.equal(isRupiah("1000"), false);
});

test("compacts millions and billions with one decimal", () => {
  assert.equal(formatRupiahCompact(6_400_000), `Rp6,4${NBSP}jt`);
  assert.equal(formatRupiahCompact(153_600_000), `Rp153,6${NBSP}jt`);
  assert.equal(formatRupiahCompact(200_000_000), `Rp200${NBSP}jt`);
  assert.equal(formatRupiahCompact(1_200_000_000), `Rp1,2${NBSP}M`);
  assert.equal(formatRupiahCompact(950_000), "Rp950.000");
});

test("rounding never lands on a thousand jt", () => {
  assert.equal(formatRupiahCompact(999_950_000), `Rp1${NBSP}M`);
  assert.equal(formatRupiahCompact(999_999_999), `Rp1${NBSP}M`);
  assert.equal(formatRupiahCompact(999_940_000), `Rp999,9${NBSP}jt`);
  assert.equal(formatRupiahCompact(-6_400_000), `\u2212Rp6,4${NBSP}jt`);
});
