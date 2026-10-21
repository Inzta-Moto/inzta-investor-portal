export default function Loading() {
  return (
    <div role="status" className="grid gap-3 rounded-xl border border-line bg-surface p-5">
      <p className="font-bold">Memuat data…</p>
      <div className="grid gap-2" aria-hidden="true">
        <i className="block h-3 w-4/5 rounded bg-surface-sunk" />
        <i className="block h-3 w-3/5 rounded bg-surface-sunk" />
        <i className="block h-3 w-2/3 rounded bg-surface-sunk" />
      </div>
    </div>
  );
}
