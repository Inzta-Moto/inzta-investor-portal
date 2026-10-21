import { cache } from "react";

import { todayInJakarta } from "../investment/calendar.ts";
import { buildPortfolio, type Portfolio } from "../investment/portfolio.ts";
import type { MockScenario } from "./mock.ts";
import { getDataSource } from "./source.ts";

/** One snapshot per request and scenario, shared by everything that renders it through React's request cache. */
export const loadPortfolio = cache(async (scenario: MockScenario): Promise<Portfolio> => {
  const today = todayInJakarta();
  const snapshot = await getDataSource(process.env.INVESTOR_DATA_SOURCE, scenario).getSnapshot(today);
  return buildPortfolio(snapshot, today);
});
