import { Suspense, type ReactNode } from "react";

import { signOut } from "@/app/masuk/actions";

import { LogoutIcon } from "../icons";
import { LogoMark } from "./logo-mark";
import { BottomNav, SidebarNav } from "./nav-links";

function SignOutButton({ compact }: { compact?: boolean }) {
  return (
    <form action={signOut}>
      {compact ? (
        <button type="submit" aria-label="Keluar" className="grid size-11 place-items-center rounded-[10px] text-ink-2 hover:bg-surface-sunk hover:text-ink">
          <LogoutIcon />
        </button>
      ) : (
        <button
          type="submit"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border border-line-strong bg-surface text-[15px] font-bold hover:bg-surface-sunk"
        >
          <LogoutIcon className="size-5" />
          Keluar
        </button>
      )}
    </form>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="sticky top-0 hidden h-dvh w-62 shrink-0 flex-col border-r border-line bg-surface lg:flex">
        <div className="flex items-center gap-3 border-b border-line px-5 pt-6 pb-5">
          <LogoMark size={36} />
          <div className="leading-tight">
            <p className="text-[15px] font-bold">Portal Investor</p>
            <p className="text-xs text-ink-3">PT Inzta Gear Indonesia</p>
          </div>
        </div>
        <div className="flex-1">
          <Suspense>
            <SidebarNav />
          </Suspense>
        </div>
        <div className="grid gap-2.5 border-t border-line px-3 pt-3.5 pb-5">
          <div className="px-2 py-1.5 leading-tight">
            <p className="text-[13px] font-bold">Akun investor</p>
            <p className="text-xs text-ink-3">Hanya lihat</p>
          </div>
          <SignOutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 lg:px-8">
          <div className="flex min-w-0 items-center gap-2.5 lg:hidden">
            <LogoMark size={28} />
            <p className="text-[15px] font-bold">Portal Investor</p>
          </div>
          <p className="hidden text-sm text-ink-3 lg:block">Laporan investasi PT Inzta Gear Indonesia · tas motor dan riding gear InztaMoto</p>
          <div className="lg:hidden">
            <SignOutButton compact />
          </div>
        </header>
        <main className="mx-auto grid w-full grid-cols-1 max-w-[1180px] flex-1 content-start gap-3 px-4 pt-4 pb-24 lg:gap-4 lg:px-8 lg:pt-7 lg:pb-12">{children}</main>
      </div>
      <Suspense>
        <BottomNav />
      </Suspense>
    </div>
  );
}
