export const MAX_FAILURES = 5;
export const WINDOW_MS = 15 * 60 * 1000;

type Entry = { failures: number; firstAt: number };

/**
 * Failed-login counter per key. In memory is enough for the single investor account (ADR-0004, ADR-0006): it resets
 * on restart and is per server instance, while scrypt and a strong password carry the rest of the protection.
 */
export class AttemptLimiter {
  private readonly entries = new Map<string, Entry>();

  /** Milliseconds until the key may try again, or 0 when it is allowed now. */
  retryAfter(key: string, nowMs: number, maxFailures = MAX_FAILURES): number {
    const entry = this.entries.get(key);
    if (!entry) return 0;
    if (nowMs - entry.firstAt >= WINDOW_MS) {
      this.entries.delete(key);
      return 0;
    }
    return entry.failures >= maxFailures ? WINDOW_MS - (nowMs - entry.firstAt) : 0;
  }

  recordFailure(key: string, nowMs: number): void {
    const entry = this.entries.get(key);
    if (!entry || nowMs - entry.firstAt >= WINDOW_MS) this.entries.set(key, { failures: 1, firstAt: nowMs });
    else entry.failures += 1;
  }

  reset(key: string): void {
    this.entries.delete(key);
  }
}
