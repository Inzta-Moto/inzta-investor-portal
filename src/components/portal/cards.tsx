import type { ReactNode } from "react";

export function Card({ children, className = "", flush = false }: { children: ReactNode; className?: string; flush?: boolean }) {
  return (
    <section className={`min-w-0 rounded-xl border border-line bg-surface ${flush ? "overflow-hidden" : "p-4 lg:p-5"} ${className}`}>
      {children}
    </section>
  );
}

export function CardLabel({ children }: { children: ReactNode }) {
  return <p className="text-[13px] font-semibold text-ink-3">{children}</p>;
}

export function StatCard({
  label,
  value,
  children,
  className = "",
  pending = false,
}: {
  label: string;
  value: ReactNode;
  children?: ReactNode;
  className?: string;
  pending?: boolean;
}) {
  return (
    <Card className={`grid content-start gap-1.5 ${pending ? "border-dashed" : ""} ${className}`}>
      <CardLabel>{label}</CardLabel>
      <p className="text-2xl leading-tight font-bold tracking-[-0.015em] lg:text-[28px]">{value}</p>
      {children}
    </Card>
  );
}

/** Progress bar; the fill is Inzta amber, the track one step off the surface. */
export function Meter({ ratio, left, right, label }: { ratio: number; left: ReactNode; right: ReactNode; label: string }) {
  const percent = Math.max(0, Math.min(1, ratio)) * 100;
  return (
    <div className="grid gap-2">
      <div
        className="h-2 overflow-hidden rounded bg-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
      >
        <div className="h-full rounded bg-brand-amber" style={{ width: `${percent}%` }} />
      </div>
      <div className="flex justify-between gap-2 text-[13px] text-ink-3">
        <span>{left}</span>
        <span className="text-right">{right}</span>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: ReactNode }) {
  return (
    <header className="mb-1 grid gap-1">
      <h1 className="text-2xl font-bold tracking-[-0.015em] lg:text-[28px]">{title}</h1>
      <p className="text-sm text-ink-3">{subtitle}</p>
    </header>
  );
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warn" }) {
  return (
    <div
      role={tone === "warn" ? "alert" : undefined}
      className={`flex items-start gap-2.5 rounded-[10px] border px-3.5 py-3 text-[13px] ${
        tone === "warn" ? "border-warn/30 bg-warn-soft text-ink" : "border-line bg-surface text-ink-2"
      }`}
    >
      {children}
    </div>
  );
}
