"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CommissionIcon, HomeIcon, ReturnIcon, SalesIcon } from "../icons";

const ITEMS = [
  { href: "/ringkasan", label: "Ringkasan", Icon: HomeIcon },
  { href: "/penjualan", label: "Penjualan", Icon: SalesIcon },
  { href: "/komisi", label: "Komisi", Icon: CommissionIcon },
  { href: "/pengembalian", label: "Pengembalian", Icon: ReturnIcon },
] as const;

/** Same active treatment as the internal dashboard menu: a charcoal block with the logo orange. */
export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigasi utama" className="grid content-start gap-1 px-3 py-4">
      <p className="px-3 pb-2 text-xs font-semibold text-ink-3">Laporan</p>
      {ITEMS.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-[10px] px-3 text-sm font-semibold ${
              active ? "bg-nav-active text-nav-active-text" : "text-ink-2 hover:bg-surface-sunk hover:text-ink"
            }`}
          >
            <Icon className={`size-5 ${active ? "text-nav-active-icon" : ""}`} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      {ITEMS.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`grid min-h-16 justify-items-center gap-1 px-1 pt-2 pb-2.5 text-[11px] ${active ? "font-bold text-ink" : "font-semibold text-ink-3"}`}
          >
            <Icon className={`h-[30px] w-[52px] rounded-full px-3.5 py-1 ${active ? "bg-nav-active text-nav-active-icon" : ""}`} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
