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
  const body = `Rp${NBSP}${groupThousands(String(Math.abs(value)))}`;
  return value < 0 ? `${MINUS}${body}` : body;
}
