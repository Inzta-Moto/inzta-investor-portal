// Placeholder until the login and dashboard features land; it renders no data and touches no data store.
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-4 px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-text-muted uppercase">PT Inzta Gear Indonesia</p>
      <h1 className="text-3xl font-semibold text-balance">Portal Investor</h1>
      <p className="text-text-muted">
        Laporan hasil penjualan bulanan, rekap pembayaran komisi, dan progres pengembalian dana investasi. Akses
        hanya untuk melihat dan memerlukan akun khusus investor.
      </p>
      <p className="border-t border-rule pt-4 text-sm text-text-muted">Portal sedang disiapkan.</p>
    </main>
  );
}
