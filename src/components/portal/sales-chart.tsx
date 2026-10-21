"use client";

import { useEffect, useId, useRef, useState } from "react";

export type { ChartPoint } from "@/lib/format/portfolio-view";
import type { ChartPoint } from "@/lib/format/portfolio-view";

const ORANGE = "#d97706";
const STEPS = [1_000_000, 2_500_000, 5_000_000, 10_000_000, 25_000_000, 50_000_000, 100_000_000, 250_000_000, 500_000_000, 1_000_000_000];

// At most five gridlines whatever the scale, so 11px axis labels never collide on a phone.
function niceStep(peak: number): number {
  return STEPS.find((step) => Math.ceil(peak / step) <= 4) ?? Math.ceil(peak / 4 / 1_000_000_000) * 1_000_000_000;
}

function tick(value: number): string {
  if (value === 0) return "0";
  if (value >= 1_000_000_000) return `${String(value / 1_000_000_000).replace(".", ",")} M`;
  return `${String(value / 1_000_000).replace(".", ",")} jt`;
}

/**
 * One series, one colour: every month in Inzta orange, the running month hatched because it is incomplete.
 * Drawn in pixels from the measured width so axis text stays 11px on a 360px phone.
 */
export function SalesChart({ points, tall = false, title }: { points: ChartPoint[]; tall?: boolean; title: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [view, setView] = useState<"chart" | "table">("chart");
  const hatchId = `hatch-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    // Measure once immediately; the first observer callback can be delayed in background tabs.
    setWidth(Math.round(element.getBoundingClientRect().width));
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const height = tall ? 300 : 230;
  const padLeft = 44;
  const padTop = 12;
  const padBottom = 26;
  const plotWidth = Math.max(0, width - padLeft - 4);
  const plotHeight = height - padTop - padBottom;
  const peak = Math.max(0, ...points.map((p) => p.revenue));
  const step = niceStep(Math.max(peak, 1));
  const max = Math.max(step, Math.ceil(peak / step) * step);
  const band = points.length ? plotWidth / points.length : 0;
  const barWidth = Math.min(24, band * 0.6);
  const radius = Math.min(4, barWidth / 2);
  const base = padTop + plotHeight;
  const labelEvery = width > 560 ? 1 : 2;
  const ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step);
  const shown = active === null ? null : points[active];

  return (
    <div className="grid gap-3">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-bold">{title}</h2>
        <div role="group" aria-label="Tampilan" className="inline-flex rounded-lg border border-line bg-surface-sunk p-[3px]">
          {(["chart", "table"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={view === mode}
              onClick={() => setView(mode)}
              className={`min-h-8 rounded-md px-3 text-xs font-semibold ${view === mode ? "bg-surface text-ink shadow-sm" : "text-ink-2"}`}
            >
              {mode === "chart" ? "Grafik" : "Tabel"}
            </button>
          ))}
        </div>
      </div>

      <div ref={host} className={`relative ${view === "chart" ? "" : "hidden"}`} style={{ minHeight: height }}>
        {width > 0 ? (
          <svg width={width} height={height} role="group" aria-label={`${title}. Bulan berjalan diarsir karena belum lengkap.`} className="block overflow-visible">
            <defs>
              <pattern id={hatchId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="6" height="6" fill={ORANGE} fillOpacity="0.3" />
                <rect width="3" height="6" fill={ORANGE} />
              </pattern>
            </defs>
            {ticks.map((value) => {
              const y = base - (value / max) * plotHeight;
              return (
                <g key={value}>
                  <line x1={padLeft} x2={width - 4} y1={y} y2={y} stroke="var(--c-line)" />
                  <text x={padLeft - 8} y={y + 4} textAnchor="end" className="fill-ink-3 text-[11px] tabular">
                    {tick(value)}
                  </text>
                </g>
              );
            })}
            {points.map((point, i) => {
              const barHeight = (point.revenue / max) * plotHeight;
              const x = padLeft + band * i + (band - barWidth) / 2;
              const top = base - barHeight;
              const r = Math.min(radius, barHeight);
              const path = `M${x},${base} V${top + r} a${r},${r} 0 0 1 ${r},${-r} h${barWidth - 2 * r} a${r},${r} 0 0 1 ${r},${r} V${base} Z`;
              const showLabel = i % labelEvery === labelEvery - 1 || point.running;
              return (
                <g key={point.month}>
                  {barHeight > 0 ? <path d={path} fill={point.running ? `url(#${hatchId})` : ORANGE} /> : null}
                  {showLabel ? (
                    <text x={padLeft + band * i + band / 2} y={height - 6} textAnchor="middle" className="fill-ink-3 text-[11px]">
                      {point.short}
                    </text>
                  ) : null}
                  <rect
                    x={padLeft + band * i}
                    y={padTop}
                    width={band}
                    height={plotHeight}
                    fill="transparent"
                    role="img"
                    tabIndex={0}
                    aria-label={`${point.label}: ${point.amount}${point.running ? ", bulan berjalan" : ""}`}
                    className="cursor-pointer outline-none focus-visible:stroke-brand-amber focus-visible:stroke-2"
                    onPointerEnter={() => setActive(i)}
                    onPointerLeave={() => setActive(null)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    onClick={() => setActive(i)}
                  />
                </g>
              );
            })}
          </svg>
        ) : null}
        {shown && active !== null ? (
          <div
            role="status"
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg bg-brand-charcoal px-2.5 py-2 text-xs whitespace-nowrap text-white shadow-lg"
            style={{
              left: Math.max(70, Math.min(width - 70, padLeft + band * active + band / 2)),
              top: base - (shown.revenue / max) * plotHeight,
            }}
          >
            {shown.label}
            {shown.running ? " · berjalan" : ""}
            <b className="tabular block text-sm text-brand-orange">{shown.amount}</b>
          </div>
        ) : null}
      </div>

      {/* The table is always in the DOM: visible on demand, otherwise read by screen readers in place of the chart. */}
      {(
        <table className={view === "table" ? "w-full border-collapse text-sm" : "sr-only"}>
          <thead>
            <tr className="text-xs font-semibold text-ink-3">
              <th scope="col" className="border-b border-line py-2.5 text-left">Bulan</th>
              <th scope="col" className="border-b border-line py-2.5 text-right">Penjualan</th>
            </tr>
          </thead>
          <tbody>
            {[...points].reverse().map((point) => (
              <tr key={point.month} className={point.running ? "font-bold" : ""}>
                <td className="border-b border-line py-2.5">
                  {point.label}
                  {point.running ? " (berjalan)" : ""}
                </td>
                <td className="tabular border-b border-line py-2.5 text-right">{point.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-2">
        <li className="inline-flex items-center gap-1.5"><i className="size-3 rounded-[3px] bg-brand-amber" />Bulan selesai</li>
        <li className="inline-flex items-center gap-1.5"><i className="hatch-now size-3 rounded-[3px]" />Bulan berjalan, belum lengkap</li>
      </ul>
    </div>
  );
}
