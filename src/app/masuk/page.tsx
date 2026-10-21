import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LogoMark } from "@/components/portal/logo-mark";
import { demoAuthConfig, hasValidSession } from "@/lib/auth/session";

import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Masuk" };

export default async function MasukPage() {
  if (await hasValidSession()) redirect("/ringkasan");
  const config = demoAuthConfig();

  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-4 py-6">
      <div className="brand-stripe grid w-full max-w-[420px] gap-6 overflow-hidden rounded-2xl border border-line bg-surface px-5 pt-8 pb-7 shadow-[0_6px_16px_rgb(28_25_23/0.06)] sm:px-7">
        <div className="grid gap-2.5">
          <LogoMark size={48} />
          <h1 className="text-2xl font-bold tracking-[-0.015em]">Masuk ke Portal Investor</h1>
          <p className="text-sm text-ink-3">PT Inzta Gear Indonesia. Gunakan akun khusus investor yang diberikan admin Inzta.</p>
        </div>
        <LoginForm configError={config.ok ? null : config.reason} />
        {config.ok && config.usingDevDefaults ? (
          <p className="rounded-[10px] border border-dashed border-line-strong px-3.5 py-3 text-[13px] text-ink-2">
            Mode pengembangan: username <b>investor</b>, kata sandi <b>inzta-demo-2026</b>. Akun ini tidak berlaku di build produksi.
          </p>
        ) : null}
        <p className="text-[13px] text-ink-3">Lupa kata sandi? Hubungi admin Inzta. Akses hanya untuk melihat; laporan bersifat rahasia.</p>
      </div>
    </main>
  );
}
