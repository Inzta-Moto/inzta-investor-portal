import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Portal Investor Inzta Gear",
  description: "Laporan hasil penjualan bulanan, rekap komisi, dan pengembalian dana investasi PT Inzta Gear Indonesia.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id">
      <body className="min-h-dvh bg-background font-sans text-text antialiased">{children}</body>
    </html>
  );
}
