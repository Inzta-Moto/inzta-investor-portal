import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

// The same typeface as the internal Inzta dashboard, so both apps read as one company.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Portal Investor · Inzta Gear", template: "%s · Portal Investor Inzta Gear" },
  description: "Laporan hasil penjualan bulanan, rekap komisi, dan pengembalian dana investasi PT Inzta Gear Indonesia.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body className="min-h-dvh bg-bg font-sans text-[14px] leading-normal lg:text-[15px] text-ink antialiased">{children}</body>
    </html>
  );
}
