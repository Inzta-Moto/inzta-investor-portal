"use client";

import { useState, type ReactNode } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

/**
 * Shows one page of a long schedule at a time. Pages are rendered on the server; only the page number lives in the
 * browser, so the 30-second refresh keeps the page the investor is on.
 */
export function Paginated({ pages, labels, initialPage, navLabel }: { pages: ReactNode[]; labels: string[]; initialPage: number; navLabel: string }) {
  const last = pages.length - 1;
  const [page, setPage] = useState(Math.min(Math.max(initialPage, 0), last));
  if (pages.length <= 1) return <>{pages[0]}</>;

  const button = "inline-flex min-h-12 items-center justify-center gap-1 rounded-[10px] border border-line-strong bg-surface px-3 text-[15px] font-bold hover:bg-surface-sunk disabled:border-line disabled:text-ink-3 disabled:hover:bg-surface";
  return (
    <>
      {pages[page]}
      <nav aria-label={navLabel} className="grid gap-2.5 border-t border-line px-4 py-3.5 lg:px-5">
        <p aria-live="polite" className="text-center text-sm font-semibold text-ink-2">
          {labels[page]} · halaman {page + 1} dari {pages.length}
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button type="button" className={button} disabled={page === 0} onClick={() => setPage(page - 1)}>
            <ChevronLeftIcon className="size-5" />
            Sebelumnya
          </button>
          <button type="button" className={button} disabled={page === last} onClick={() => setPage(page + 1)}>
            Berikutnya
            <ChevronRightIcon className="size-5" />
          </button>
        </div>
      </nav>
    </>
  );
}
