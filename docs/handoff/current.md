---
status: active
owner: "VXerys"
session_date: "2026-10-22"
branch: "main"
base_commit: "0bb1609"
current_commit: "215394e"
feature_id: "F-009"
task_id: "T-003"
expires_after: "2026-11-05"
---

# Session Handoff

## Session objective

Menampilkan ke mana dana investasi dipakai, sesuai permintaan klien ("cukup list pemakaian uangnya, tanpa total"). Keputusan dari sesi grilling Q1 sampai Q14 dicatat di F-009 dan ADR-0007.

## Context used

ADR-0006, ADR-0007; Belanja Produksi di `inztamoto-erp-dashboard/public/legacy/app-runtime.js` (`production_purchases`, status open/closed, tim tidak pernah menutup minggu); emulator Firestore `demo-inzta`.

## Completed

- F-009: ERP menandai belanja (`investorAgreementId: "current"`) lewat centang di form Belanja Produksi dan kartu di halaman Investor (owner dan admin); portal membaca belanja bertanda dengan enam kolom dan menampilkannya per bulan di halaman Penggunaan Dana, tanpa total.
- Spec ditahan: F-010 form isi perjanjian (Q8), F-011 banyak investor (Q7).
- Fallback salinan data 21 Okt dicabut (0bb1609); total bulanan memakai agregasi `sum()` (019abb1).

## Requirement coverage

F-009 AC-001 sampai AC-010 pass di emulator dan halaman uji (EV-001 sampai EV-003); alur produksi belum diuji.

## Changed files

`src/lib/data/`, `src/lib/investment/fund-usage*.ts`, `src/app/(portal)/penggunaan-dana/`, `src/components/portal/{views,nav-links}.tsx`, `src/components/icons.tsx`, `scripts/emulator/`, `docs/adr/ADR-0007-fund-usage-from-purchases.md`, `docs/specs/F-009-penggunaan-dana/`, `docs/specs/F-010-form-perjanjian/`, `docs/specs/F-011-multi-investor/`.

## Commands executed

`npm test` (58 pass), tes emulator (10 pass), `npm run typecheck` (0 error), `npm run lint` (bersih), `npm run build` (sukses), `npm run context:validate` (lolos, 1 warning lama F-003). ERP: `npm run build` sukses.

## Current implementation state

Lokal: `npm run emulator:start`, lalu `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run emulator:seed`; seed kini berisi 3 belanja (2 bertanda).

## Uncommitted work

None.

## Blockers

Deploy ERP Vercel tidak otomatis dari `feat/nextjs-migration`; terakhir dipicu dengan commit kosong. A-016 tetap terbuka.

## Decisions made during session

Q1 sampai Q14 di F-009 `requirements.md`; ADR-0007. Sehan: tanpa Blaze, F-010 dan F-011 hanya spec.

## Context updates

`docs/adr/README.md`, `docs/specs/_index.md`.

## Exact next step

Setelah deploy portal dan ERP, owner menandai satu belanja di dasbor asli lalu membuka `capital.inzta.id/penggunaan-dana`; catat hasilnya sebagai bukti produksi F-009.

## Do not do next

Jangan mengerjakan F-010 atau F-011 tanpa persetujuan Sehan. Jangan menulis ke Firestore produksi, mengubah Security Rules, atau menyarankan Blaze.

## Validity

Berlaku sampai 2026-11-05 atau sampai F-010 atau F-011 dimulai.
