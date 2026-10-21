"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

/**
 * Year and month for the sales chart, kept in the URL (?tahun=&bulan=) so the server renders the chosen period and the
 * 30-second refresh keeps it. Native selects open the phone's own picker, which is the easiest control for the investor.
 */
export function SalesFilter({
  years,
  year,
  month,
  currentYear,
  currentMonth,
}: {
  years: number[];
  year: number | null;
  month: number | null;
  currentYear: number;
  currentMonth: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const go = (nextYear: string, nextMonth: string) => {
    const params = new URLSearchParams();
    if (nextYear) {
      params.set("tahun", nextYear);
      if (nextMonth) params.set("bulan", nextMonth);
    }
    const query = params.toString();
    startTransition(() => router.push(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  };

  const select = "min-h-11 w-full rounded-[10px] border border-line-strong bg-surface px-3 text-sm font-semibold text-ink disabled:text-ink-3";
  return (
    <div className="grid gap-1.5">
      <div className="grid grid-cols-2 gap-2.5 sm:max-w-md">
        <label className="grid gap-1 text-xs font-semibold text-ink-3">
          Tahun
          <select className={select} value={year ?? ""} onChange={(event) => go(event.target.value, "")}>
            <option value="">12 bulan terakhir</option>
            {years.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-semibold text-ink-3">
          Bulan
          <select className={select} value={month ?? ""} disabled={year === null} onChange={(event) => go(String(year), event.target.value)}>
            <option value="">{year === null ? "Pilih tahun dulu" : "Semua bulan"}</option>
            {MONTHS.map((name, index) => (
              <option key={name} value={index + 1} disabled={year === currentYear && index + 1 > currentMonth}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p aria-live="polite" className="min-h-4 text-xs text-ink-3">
        {pending ? "Memuat periode…" : ""}
      </p>
    </div>
  );
}
