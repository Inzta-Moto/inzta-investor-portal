---
id: F-001
title: "Fondasi proyek"
type: design
status: implemented
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# Design: Fondasi proyek

Memetakan FR-001 sampai FR-004 ke repositori.

## Changed files

| Path | Change | FR |
|---|---|---|
| `package.json`, `package-lock.json` | skrip dan dependency Next.js, React, Tailwind, ESLint, Firebase; skrip SDD dipertahankan (`test:sdd`, `sdd:init`) | semua |
| `tsconfig.json`, `eslint.config.mjs` | sama dengan `fluxa-web` | semua |
| `next.config.ts` | `agentRules: false`, Tailwind lewat Turbopack, header `X-Frame-Options`, `X-Robots-Tag`, `Referrer-Policy` | FR-001, FR-004 |
| `.gitignore`, `.env.example` | pola Next.js dan rahasia; nama variabel tanpa nilai | FR-002 |
| `src/app/layout.tsx`, `src/app/page.tsx` | layout `lang="id"`, meta robots, halaman placeholder | FR-001 |
| `src/app/globals.css` | token sementara, `@media print` menyembunyikan `body`, utilitas `tabular` | FR-004 |
| `src/lib/firebase/config.ts` (+ test) | `readFirebaseConfig(env)` murni | FR-002 |
| `src/lib/firebase/client.ts` | `getFirebaseApp()` lazy, satu-satunya pengimpor `firebase` | FR-002 |
| `src/lib/money/rupiah.ts` (+ test) | `formatRupiah`, `isRupiah` | FR-003 |

## Decisions

- `readFirebaseConfig` menerima objek env eksplisit karena Next.js hanya meng-inline `NEXT_PUBLIC_*` yang ditulis literal; ini juga membuatnya teruji tanpa `process.env`.
- `getFirebaseApp` tidak dipanggil dari mana pun di F-001, sehingga build dan halaman tidak membuka koneksi (BR-001).
- Font sistem dipakai sementara; `next/font/google` butuh jaringan saat build dan arah visual belum diputuskan.
- `gsap` dan `lenis` dari proyek acuan tidak dipasang: portal laporan tidak butuh motion.

## Error handling

`getFirebaseApp` melempar Error berbahasa Indonesia yang menyebut variabel kosong; fitur pemanggil (F-002) menampilkan pesan ramah.

## Test plan

- Unit: `src/lib/firebase/config.test.ts` (AC-003, AC-004), `src/lib/money/rupiah.test.ts` (AC-005).
- Build: `npm run build` (AC-001).
- Runtime: header dan meta diperiksa pada `npm run dev` (AC-002, AC-006); CSS cetak diperiksa di stylesheet (AC-007).
