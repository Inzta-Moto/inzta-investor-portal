import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";

import { THEME_COOKIE, parseTheme } from "@/lib/theme";

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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // A stored choice is rendered on the server so the page never flashes the other theme before hydration.
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value);
  return (
    <html lang="id" className={jakarta.variable} data-theme={theme ?? undefined}>
      <body className="min-h-dvh bg-bg font-sans text-[14px] leading-normal lg:text-[15px] text-ink antialiased">{children}</body>
    </html>
  );
}
