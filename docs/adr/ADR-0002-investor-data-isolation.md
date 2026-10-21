---
id: ADR-0002
title: Isolasi data investor di database bersama
type: adr
status: review
tier: full
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# ADR-0002: Isolasi data investor di database bersama

Status `review`: usulan, belum diputuskan. Menunggu A-002, A-003, A-004, A-008.

## Context

ADR-0001 menetapkan portal membaca Firestore yang sama dengan dasbor internal. Dokumen `sales` memuat field yang bukan untuk investor: `customer`, `city`, `district`, `resellerName`, `costPrice`, `modal`, `notes`. Security Rules Firestore mengizinkan atau menolak satu dokumen utuh; rules tidak bisa menyembunyikan sebagian field. VN Raja meminta investor hanya melihat, tanpa data mentah; investor juga terikat kewajiban kerahasiaan di perjanjian.

## Decision drivers

1. Investor tidak bisa membaca field di luar yang ditampilkan, termasuk lewat devtools.
2. Tetap realtime (ADR-0001).
3. Tidak mengubah perilaku dasbor internal di luar yang perlu.
4. Tidak menambah biaya atau kredensial baru tanpa persetujuan.

## Options

### Option A — Koleksi ringkasan khusus investor, diperbarui oleh Cloud Function

- Trigger `onDocumentWritten` pada `sales` menghitung ulang `investor_monthly_sales/{YYYY-MM}`. Rules: role `investor` hanya membaca koleksi `investor_*`.
- Advantages: investor tidak pernah menyentuh `sales`; realtime dalam hitungan detik; dasbor internal tidak berubah.
- Disadvantages: butuh paket Blaze dan deploy Functions (aksi produksi); kode `functions/` baru.

### Option B — Ringkasan ditulis oleh dasbor internal saat penjualan disimpan

- Advantages: tanpa Cloud Functions.
- Disadvantages: mengubah kode dasbor internal (repo lain, `app-runtime.js`); ringkasan bisa melenceng bila ada jalur tulis lain (impor skrip, edit, hapus).

### Option C — Route handler Next.js dengan Admin SDK menghitung ringkasan di server

- Advantages: rules untuk `sales` tidak perlu dibuka ke investor.
- Disadvantages: bukan push realtime (polling atau revalidate); butuh service account di hosting dan dependency `firebase-admin`; sesi investor harus diverifikasi di server.

### Option D — Rules memberi investor akses baca langsung ke `sales`

- Advantages: paling cepat dibuat.
- Disadvantages: melanggar driver 1. Tidak direkomendasikan.

## Decision

Belum diputuskan. Rekomendasi awal: Option A, dengan Option B sebagai cadangan bila paket Blaze tidak disetujui.

## Rationale

Option A satu-satunya yang memenuhi driver 1 dan 2 tanpa mengubah dasbor internal. Biaya dan deploy Functions perlu persetujuan pemilik project.

## Consequences

- Positive: permukaan data investor terbatas pada koleksi `investor_*`.
- Negative or cost: satu komponen backend baru yang harus dipantau.
- Operational: perlu skrip backfill ringkasan untuk penjualan lama, dijalankan sekali dengan persetujuan.

## Risks

| Risk | Impact | Mitigation or verification |
|---|---|---|
| Ringkasan tidak sama dengan perhitungan dasbor internal | angka investor berbeda | uji fungsi agregasi dengan fixture yang meniru `getSaleRevenue` dan `getSaleProfit` |
| Rules role investor salah | kebocoran atau portal kosong | uji rules di emulator (`firebase emulators:exec`) sebelum deploy |

## Follow-up

Setelah diputuskan: `docs/architecture/security.md`, `firestore.rules` di repo, spec F-002 sampai F-004.

## Revisit when

- Pertanyaan A-002, A-003, A-004, atau A-008 terjawab.
