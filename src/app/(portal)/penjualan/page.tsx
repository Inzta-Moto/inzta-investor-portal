import type { Metadata } from "next";

import { PortfolioPage } from "../portfolio";

export const metadata: Metadata = { title: "Penjualan" };

export default function PenjualanPage() {
  return <PortfolioPage view="penjualan" />;
}
