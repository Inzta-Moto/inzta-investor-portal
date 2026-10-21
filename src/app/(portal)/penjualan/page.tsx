import type { Metadata } from "next";

import { PortfolioPage } from "../portfolio";

export const metadata: Metadata = { title: "Penjualan" };

export default async function PenjualanPage({ searchParams }: PageProps<"/penjualan">) {
  return <PortfolioPage view="penjualan" searchParams={await searchParams} />;
}
