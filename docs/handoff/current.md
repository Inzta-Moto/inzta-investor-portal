---
status: active
owner: "VXerys"
session_date: "2026-10-21"
branch: "main"
base_commit: "5d6ab26"
current_commit: "fad9e3c"
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

- F-006: server membaca Firestore `database-inzta` (dasbor ERP) dengan proyeksi empat kolom; portal jalan tanpa dokumen perjanjian memakai ketentuan draf (T-007); `npm run env:setup` mengisi `.env.local` dari berkas kunci tanpa menampilkan nilai.
- F-003: semua garis warna dekoratif diganti; skala teks HP lebih kecil; bug sidebar terpotong (tabel sr-only), grafik melebar setelah resize, kartu Pengembalian meluber di 320 px, dan kartu Penjualan tidak sejajar diperbaiki (T-007).
- Dua audit code-review: 10 dan 8 temuan, semuanya diperbaiki.

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

A-016: dokumen `investor_agreement/current` dan `investor_payments` setelah Tahap I, env hosting (Angkasa, A-011), kata sandi kuat, cabut kunci `inzta-5244e` dan `inzta-dev`. Pertanyaan terbuka: apakah pesanan website (`orders`) ikut dihitung (A-017).

## Decisions made during session

ADR-0006 (Sehan: "pakai jalan tengah"). Username investor `investor@inzta.id` (Sehan). Cache dan jeda refresh dipilih agen untuk menjaga kuota Spark bersama.

## Context updates

`docs/context/ASSUMPTIONS.md`, `docs/adr/ADR-0006-server-read-field-projection.md`, `docs/specs/_index.md`, `docs/steering/{tech,structure,product}.md`.

## Exact next step

Total bulanan sudah cocok dengan dasbor ERP (Sehan, EV-007). Setelah Tahap I diterima, admin mengisi Tanggal Efektif dan persentase pengembalian di `investor_agreement/current`. Angkasa menyiapkan hosting dengan env yang sama. Verifikasi: `npm run context:validate`.

## Do not do next

Jangan menulis ke Firestore produksi, mengubah Security Rules, atau deploy tanpa persetujuan Sehan. Jangan menjalankan `emulator:seed` atau tes emulator tanpa `FIRESTORE_EMULATOR_HOST`.

## Validity

Berlaku sampai 2026-11-04 atau sampai T-006 dimulai.
