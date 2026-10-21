/**
 * Small per-instance cache so the 30-second auto refresh does not re-read the same Firestore documents. Concurrent
 * callers for one key share the pending load instead of each starting a query.
 */
export class TtlCache<T> {
  // Range keys change daily, so the oldest entries are dropped instead of growing for the life of the server.
  private readonly maxEntries: number;

  constructor(maxEntries = 64) {
    this.maxEntries = maxEntries;
  }

  private readonly entries = new Map<string, { value: T; at: number }>();
  private readonly pending = new Map<string, Promise<T>>();

  async get(key: string, ttlMs: number, nowMs: number, load: () => Promise<T>): Promise<T> {
    const hit = this.entries.get(key);
    if (hit && nowMs - hit.at < ttlMs) return hit.value;
    const running = this.pending.get(key);
    if (running) return running;
    const promise = load()
      .then((value) => {
        this.entries.delete(key);
        this.entries.set(key, { value, at: nowMs });
        if (this.entries.size > this.maxEntries) this.entries.delete(this.entries.keys().next().value as string);
        return value;
      })
      .finally(() => this.pending.delete(key));
    this.pending.set(key, promise);
    return promise;
  }
}
