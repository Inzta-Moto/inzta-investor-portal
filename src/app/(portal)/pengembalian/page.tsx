import type { Metadata } from "next";

import { PortfolioPage } from "../portfolio";

export const metadata: Metadata = { title: "Pengembalian dana" };

export default function PengembalianPage() {
  return <PortfolioPage view="pengembalian" />;
}
