import type { Metadata } from "next";

import { PortfolioPage } from "../portfolio";

export const metadata: Metadata = { title: "Penggunaan dana" };

export default function PenggunaanDanaPage() {
  return <PortfolioPage view="penggunaan-dana" />;
}
