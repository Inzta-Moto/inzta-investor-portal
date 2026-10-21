"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { InfoIcon } from "../icons";

const OPTIONS = [
  { value: "awal", label: "Awal kontrak" },
  { value: "tahun-kedua", label: "Tahun ke-2" },
] as const;

/** Mock mode only: lets the client preview the portal early in the agreement and in year two, with labelled sample data. */
export function ScenarioSwitch() {
  const pathname = usePathname();
  const current = useSearchParams().get("skenario") === "tahun-kedua" ? "tahun-kedua" : "awal";
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-dashed border-line-strong bg-surface px-3.5 py-2.5 text-[13px] text-ink-2">
      <p className="flex items-center gap-2">
        <InfoIcon className="size-4 text-brand-amber" />
        Data contoh untuk pratinjau, bukan angka Inzta.
      </p>
      <div role="group" aria-label="Skenario data contoh" className="inline-flex rounded-lg border border-line bg-surface-sunk p-[3px]">
        {OPTIONS.map((option) => (
          <Link
            key={option.value}
            href={option.value === "awal" ? pathname : `${pathname}?skenario=${option.value}`}
            aria-current={current === option.value ? "true" : undefined}
            className={`inline-flex min-h-8 items-center rounded-md px-3 text-xs font-semibold ${
              current === option.value ? "bg-surface text-ink shadow-sm" : "text-ink-2"
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
