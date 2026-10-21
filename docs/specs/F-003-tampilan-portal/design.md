---
id: F-003
title: "Tampilan portal investor"
type: design
status: implementing
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# Design: Tampilan portal investor

## Routes

| Path | Isi |
|---|---|
| `src/app/page.tsx` | redirect ke `/ringkasan` |
| `src/app/(portal)/layout.tsx` | gerbang sesi (F-004) dan kerangka |
| `src/app/(portal)/{ringkasan,penjualan,komisi,pengembalian}/page.tsx` | Server Component: `loadPortfolio()` lalu komponen |
| `src/app/(portal)/loading.tsx`, `error.tsx` | kondisi memuat dan gagal |

## Components (`src/components/portal/`)

| Komponen | Jenis | Isi |
|---|---|---|
| `app-shell.tsx` | server | sidebar, bar atas, navigasi bawah, penanda sumber data |
| `nav-links.tsx` | client | menu aktif dari `usePathname` |
| `logo-mark.tsx` | server | `public/brand/inzta-mark.png` lewat `next/image` |
| `commission-hero.tsx`, `stat-card.tsx`, `meter.tsx` | server | kartu utama dan stat |
| `contract-timeline.tsx` | server | 24 sel, arsir bulan berjalan |
| `sales-chart.tsx` | client | SVG, tooltip, tombol Grafik/Tabel |
| `commission-schedule.tsx`, `repayment-list.tsx`, `status-chip.tsx` | server | jadwal dan status |
| `src/lib/format/dates.ts` | murni | label bulan dan tanggal Indonesia |
| `src/lib/data/load.ts` | server | `loadPortfolio()`: sumber data dari env, `todayInJakarta()`, `buildPortfolio()` |

## Decisions

- Token sistem desain dipindah ke `@theme` di `globals.css`; utilitas mengikuti nama token (`bg-surface`, `text-ink-3`, `bg-brand-amber`).
- Plus Jakarta Sans lewat `next/font/google`, sama dengan dasbor internal.
- Grafik memakai `viewBox` tetap dan lebar 100% sehingga tidak perlu mengukur DOM; batang maks 24 px dalam koordinat viewBox.
- `loadPortfolio` dibungkus `cache()` React agar satu permintaan hanya memanggil sumber data sekali.

## Test plan

- Unit: `dates.test.ts`. Domain sudah diuji di F-002.
- Runtime: 360 px dan 1366 px di browser pane, tema terang dan gelap, tanpa error console.
