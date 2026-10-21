import assert from "node:assert/strict";
import { test } from "node:test";

import { AttemptLimiter, MAX_FAILURES, WINDOW_MS } from "./attempt-limiter.ts";

test("blocks a client after five failures for the rest of the window, then lets it retry", () => {
  const limiter = new AttemptLimiter();
  const start = 1_000_000;
  for (let i = 0; i < MAX_FAILURES - 1; i += 1) limiter.recordFailure("1.2.3.4", start + i);
  assert.equal(limiter.retryAfter("1.2.3.4", start + 10), 0);
  limiter.recordFailure("1.2.3.4", start + 10);
  assert.equal(limiter.retryAfter("1.2.3.4", start + 60_000), WINDOW_MS - 60_000);
  assert.equal(limiter.retryAfter("5.6.7.8", start + 60_000), 0);
  assert.equal(limiter.retryAfter("1.2.3.4", start + WINDOW_MS), 0);
});

test("a successful login clears the counter", () => {
  const limiter = new AttemptLimiter();
  for (let i = 0; i < MAX_FAILURES; i += 1) limiter.recordFailure("k", i);
  limiter.reset("k");
  assert.equal(limiter.retryAfter("k", 10), 0);
});
