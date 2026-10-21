import assert from "node:assert/strict";
import { test } from "node:test";

import { snapshotSource } from "./snapshot-source.ts";

test("the saved copy matches the production totals of 2026-10-21 and is marked as a snapshot", async () => {
  const snapshot = await snapshotSource.getSnapshot("2026-10-21");
  assert.equal(snapshot.source, "snapshot");
  assert.equal(snapshot.agreement.effectiveDate, null);
  assert.deepEqual(snapshot.payments, []);
  assert.equal(snapshot.monthlySales.find((m) => m.month === "2026-09")?.revenue, 111_244_737);
  assert.equal(snapshot.monthlySales.length, 12);
  assert.deepEqual(await snapshotSource.getMonths(["2026-04", "2026-05"]), [
    { month: "2026-04", revenue: 0 },
    { month: "2026-05", revenue: 11_365_000 },
  ]);
  assert.equal(await snapshotSource.getFirstSaleMonth(), "2026-05");
});
