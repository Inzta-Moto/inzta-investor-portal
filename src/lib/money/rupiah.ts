// Amounts are whole Rupiah held as safe integers; the agreement and the sales data never use cents.
const NBSP = " ";
const MINUS = "−";

export function isRupiah(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value);
}

function groupThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Hand-rolled instead of Intl so server and browser output never differ by ICU version (hydration-safe).
export function formatRupiah(value: number): string {
  if (!isRupiah(value)) throw new RangeError(`value must be a whole Rupiah amount, got ${value}`);
  // PUEBI writes the currency symbol attached to the number: Rp6.400.000.
  const body = `Rp${groupThousands(String(Math.abs(value)))}`;
  return value < 0 ? `${MINUS}${body}` : body;
}

function oneDecimal(value: number): string {
  return value.toFixed(1).replace(/\.0$/, "").replace(".", ",");
}

/** Short form for stat tiles and axes: "Rp6,4 jt", "Rp1,2 M". Below one million the full amount is clearer. */
export function formatRupiahCompact(value: number): string {
  if (!isRupiah(value)) throw new RangeError(`value must be a whole Rupiah amount, got ${value}`);
  const sign = value < 0 ? MINUS : "";
  const abs = Math.abs(value);
  // Decide the unit after rounding, so 999.950.000 reads "Rp1 M" instead of "Rp1000 jt".
  if (Math.round(abs / 100_000) >= 10_000) return `${sign}Rp${oneDecimal(abs / 1_000_000_000)}${NBSP}M`;
  if (abs >= 1_000_000) return `${sign}Rp${oneDecimal(abs / 1_000_000)}${NBSP}jt`;
  return formatRupiah(value);
}
