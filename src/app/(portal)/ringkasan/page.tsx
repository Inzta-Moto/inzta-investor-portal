import type { Metadata } from "next";

import { PortfolioPage } from "../portfolio";

export const metadata: Metadata = { title: "Ringkasan" };

export default function RingkasanPage() {
  return <PortfolioPage view="ringkasan" />;
}
