---
status: active
owner: "VXerys"
session_date: "2026-10-21"
branch: "main"
base_commit: "5d6ab26"
current_commit: "5c4d4f6"
feature_id: "F-006"
task_id: "T-006"
expires_after: "2026-11-04"
---

# Session Handoff

## Session objective

Mengganti data mock dengan Firestore asli dan membuatnya terasa langsung, lalu mengaudit kode dan memvalidasi tampilan HP. Sehan memilih "jalan tengah" (ADR-0006): server membaca `sales` empat kolom, investor tanpa akun Firebase.

## Context used

ADR-0001, ADR-0003, ADR-0004, ADR-0006; aturan `getSaleRevenue` dan format tanggal `sales` di `inztamoto-erp-dashboard/public/legacy/app-runtime.js`; emulator Firestore project `demo-inzta`.

## Completed

- F-006 T-001 sampai T-005: Admin SDK di server, proyeksi kolom `sales`, cache dua jendela (kemarin ke atas 25 detik, sisanya 1 jam), refresh 30 detik dengan jeda 15 menit, login scrypt milik portal, mock dan akun demo dihapus.
- Audit code-review (10 temuan) diperbaiki: kuota baca, polling tanpa batas, pembatas login yang bisa dipalsukan, scrypt sinkron, hash rusak, kunci sesi tidak terikat kata sandi, kode mati, dokumen steering yang bertentangan.
- F-003 T-006: pagination jadwal komisi (6 baris di HP, 12 di desktop) dan kartu komisi dua kolom di HP.
- ADR-0006; ADR-0002 dan ADR-0005 superseded; A-003, A-004 tidak lagi memblokir; A-014, A-015 rejected; A-016 baru.

## Requirement coverage

F-006 AC-001 sampai AC-004, AC-006 sampai AC-010 pass; AC-005 (jeda 15 menit) not_run. F-003 AC-008 diperbarui (EV-004).

## Changed files

`src/lib/data/`, `src/lib/auth/`, `src/app/(portal)/`, `src/app/masuk/`, `src/components/portal/`, `scripts/emulator/`, `scripts/auth/`, `firebase.json`, `package.json`, `docs/adr/`, `docs/specs/F-00{2,3,4,6}/`, `docs/steering/`, `docs/product/`, `docs/context/ASSUMPTIONS.md`, `README.md`, `.env.example`.

## Commands executed

`npm run lint` (bersih), `npm run typecheck` (0 error), `npm test` (44 pass), `npm run build` (sukses), tes emulator (7 pass), `npm run test:sdd` (34 pass), `npm run context:validate`. Validasi runtime di browser pane 360 px dan 1280 px.

## Current implementation state

Lokal: `npm run emulator:start`, lalu `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run emulator:seed` dan `npm run dev`. Emulator butuh Java 21 (`JAVA_HOME`).

## Uncommitted work

None.

## Blockers

A-016: kunci service account `inzta-5244e`, env login produksi, dokumen `investor_agreement/current` dan `investor_payments` di produksi. A-011: hosting dan DNS untuk F-005.

## Decisions made during session

ADR-0006 (Sehan: "pakai jalan tengah"). Username investor `investor@inzta.id` (Sehan). Cache dan jeda refresh dipilih agen untuk menjaga kuota Spark bersama.

## Context updates

`docs/context/ASSUMPTIONS.md`, `docs/adr/ADR-0006-server-read-field-projection.md`, `docs/specs/_index.md`, `docs/steering/{tech,structure,product}.md`.

## Exact next step

Sehan membuat kunci service account di Firebase Console (Project settings, Service accounts), mengisi env sesuai README, dan meminta admin membuat dokumen perjanjian; lalu F-006 T-006: jalankan portal terhadap produksi dan bandingkan total bulanan dengan dasbor internal. Verifikasi: `npm run context:validate`.

## Do not do next

Jangan menulis ke Firestore produksi, mengubah Security Rules, atau deploy tanpa persetujuan Sehan. Jangan menjalankan `emulator:seed` atau tes emulator tanpa `FIRESTORE_EMULATOR_HOST`.

## Validity

Berlaku sampai 2026-11-04 atau sampai T-006 dimulai.
