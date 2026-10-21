import type { Metadata } from "next";

import { PortfolioPage } from "../portfolio";

export const metadata: Metadata = { title: "Komisi" };

export default function KomisiPage() {
  return <PortfolioPage view="komisi" />;
}
