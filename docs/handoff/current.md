---
status: active
owner: "VXerys"
session_date: "2026-10-23"
branch: "feat/F-009-belanja-investasi"
base_commit: "c2a60ac"
current_commit: "c2a60ac"
feature_id: "F-009"
task_id: "T-004"
expires_after: "2026-11-06"
---

# Session Handoff

## Session objective

Revisi F-009 atas permintaan klien (Raja Purnama, 2026-10-23): belanja dari dana investasi dicatat di menu ERP sendiri, tidak dicampur ke Belanja Produksi atau kartu yang sudah ada, karena investor sifatnya sementara.

## Context used

ADR-0006, ADR-0007, ADR-0008; ERP `inztamoto-erp-dashboard/public/legacy/app-runtime.js` dan `src/components/InztamotoApp.jsx`; emulator Firestore dan Auth `demo-inzta`.

## Completed

- ERP (branch `feat/belanja-investasi`, commit 1b0dcac): menu Belanja Investasi (owner dan admin), koleksi `investor_purchases`, tambah, ubah, hapus, filter Hari/Minggu/Bulan/Semua, cari, total periode untuk admin. Centang, label, peringatan, dan kartu dana investasi dicabut dari Belanja Produksi dan halaman Investor.
- Portal: Penggunaan Dana membaca `investor_purchases` (ADR-0008 menggantikan ADR-0007); fixture, seed, dan tes emulator disesuaikan.

## Requirement coverage

F-009 AC-001 sampai AC-010 pass di emulator (EV-004); alur produksi belum diuji.

## Changed files

Portal: `src/lib/data/{firestore-source,firestore-mapping,load,source}.ts`, `src/lib/data/*.test.ts`, `src/lib/data/firestore-source.itest.ts`, `src/lib/investment/{types.ts,fund-usage.test.ts}`, `scripts/emulator/{fixtures,seed}.mjs`, `docs/adr/ADR-0007*`, `docs/adr/ADR-0008*`, `docs/adr/README.md`, `docs/specs/F-009-penggunaan-dana/`. ERP: `public/legacy/app-runtime.js`, `src/components/InztamotoApp.jsx`.

## Commands executed

Portal: `npm test` (59 pass), tes emulator (10 pass), `npm run typecheck` (0 error), `npm run lint` (bersih), `npm run build` (sukses). ERP: `npm run build` (sukses), uji manual di ERP lokal ke emulator.

## Current implementation state

Kedua repo di branch fitur, belum di-push. Belanja Produksi yang ditandai dengan cara lama tidak tampil lagi di portal.

## Uncommitted work

None setelah commit sesi ini.

## Blockers

Push dan merge menunggu izin Sehan. Security Rules produksi untuk `investor_purchases` belum terbukti.

## Decisions made during session

Sehan 2026-10-23: koleksi sendiri `investor_purchases`, nama menu Belanja Investasi, semua jejak di Belanja Produksi dan halaman Investor dicabut.

## Context updates

`docs/adr/README.md`, F-009 requirements, design, tasks, verification.

## Exact next step

Setelah merge dan deploy ERP serta portal, owner mencatat satu belanja di menu Belanja Investasi lalu membuka `capital.inzta.id/penggunaan-dana`; catat hasilnya sebagai bukti produksi F-009. Belanja lama yang pernah ditandai dicatat ulang di menu baru bila perlu.

## Do not do next

Jangan mengerjakan F-010 atau F-011 tanpa persetujuan Sehan. Jangan menulis ke Firestore produksi, mengubah Security Rules, atau menyarankan Blaze.

## Validity

Berlaku sampai 2026-11-06 atau sampai F-010 atau F-011 dimulai.
