"use client";

import { AlertIcon } from "@/components/icons";

export default function PortalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div role="alert" className="grid justify-items-start gap-2.5 rounded-xl border border-line bg-surface p-5">
      <span className="grid size-10 place-items-center rounded-[10px] bg-bad-soft text-bad">
        <AlertIcon />
      </span>
      <p className="font-bold">Data tidak bisa dimuat</p>
      <p className="text-sm text-ink-2">Coba lagi beberapa saat. Bila masalah berlanjut, hubungi admin Inzta.</p>
      <button
        type="button"
        onClick={() => retry()}
        className="inline-flex min-h-12 items-center justify-center rounded-[10px] border border-line-strong bg-surface px-5 text-[15px] font-bold hover:bg-surface-sunk"
      >
        Coba lagi
      </button>
    </div>
  );
}
