# Portal Investor Inzta Gear

Portal web hanya-baca untuk investor PT Inzta Gear Indonesia: hasil penjualan bulanan InztaMoto, rekap komisi (Rp6.400.000 per bulan selama 24 bulan), dan progres pengembalian dana (bulan ke-16, 20, 24). Rencana domain `capital.inzta.id`. Dirancang untuk HP terlebih dulu.

Status: **data mock** atas permintaan klien; integrasi Firebase ditahan (F-006). Setiap halaman memberi label "Data contoh".

## Menjalankan

```bash
npm ci
npm run dev
```

Buka http://localhost:3300. Di `npm run dev`, bila `.env.local` tidak mengisi variabel login, akun demo berikut berlaku (hanya di mode pengembangan):

| Username | Kata sandi |
|---|---|
| `investor` | `inzta-demo-2026` |

Di halaman portal ada pemilih skenario data contoh: **Awal kontrak** (bulan ke-3, persentase pengembalian belum diisi) dan **Tahun ke-2** (bulan ke-21, pengembalian 25/25/50%, dua pengembalian sudah masuk). Bisa juga lewat URL, misalnya `/ringkasan?skenario=tahun-kedua`.

## Variabel lingkungan

Lihat `.env.example`. Untuk `npm run build` dan `npm start`, isi `DEMO_INVESTOR_USERNAME`, `DEMO_INVESTOR_PASSWORD`, dan `SESSION_SECRET` (minimal 32 karakter); tanpa itu login menolak semua percobaan.

## Perintah

| Tujuan | Perintah |
|---|---|
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Test | `npm test` |
| Build | `npm run build` |
| Validasi konteks SDD | `npm run context:validate` |
| Test tooling SDD | `npm run test:sdd` |

## Struktur

| Path | Isi |
|---|---|
| `src/app/(portal)/` | Ringkasan, Penjualan, Komisi, Pengembalian; gerbang sesi di `layout.tsx` |
| `src/app/masuk/` | layar masuk dan server action |
| `src/components/portal/` | kerangka, kartu, grafik, jadwal |
| `src/lib/investment/` | aturan komisi, pengembalian, penjualan (murni, teruji) |
| `src/lib/data/` | kontrak `InvestorDataSource` dan adaptor mock |
| `src/lib/auth/` | sesi demo bertanda tangan |
| `docs/design/` | sistem desain dan prototipe HTML |
| `docs/` | PRD, spec F-001 sampai F-006, ADR, asumsi; mulai dari `docs/context/BRIEF.md` |

## Cara kerja dokumen

Proyek memakai template spec-driven development v2.0.0: aturan di `docs/steering/`, spec per fitur di `docs/specs/`, status tugas di `tasks.md`, tampilan konteks dirender dengan `npm run context:render`. Penjelasan lengkap: `docs/automation/README.md` dan `docs/context/CONTEXT_SYSTEM.md`.
