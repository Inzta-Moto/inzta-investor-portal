---
id: F-007
title: "Filter bulan dan tahun di Penjualan"
type: verification
status: implemented
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
requirements: [FR-001, FR-002, FR-003]
supersedes: null
---

# Verification: Filter bulan dan tahun di Penjualan

## Evidence

### EV-001 — Unit dan emulator
- command: `npm test`, `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node --test "src/**/*.itest.ts"`
- output:
  ```text
  tests 54 pass: tahun dari penjualan pertama; URL tidak valid dan bulan depan ditolak; Januari dibanding Desember tahun lalu
  emulator 8 pass: getFirstSaleMonth; getMonths sama dengan tampilan 12 bulan; bulan kosong = 0
  ```
- date: 2026-10-21
- commit: 775af38
- covers: [AC-002, AC-003, AC-004, AC-005]

### EV-002 — Browser 320, 360, 1440 px
- command: `next start` dengan emulator; ganti pilihan Tahun dan Bulan lewat event change
- output:
  ```text
  2026: Jan sampai Okt, Nov dan Des tidak bisa dipilih; 2026 + Agustus: 2 batang lain dipudarkan, ringkasan Rp485.000
  2026 + September: "14,43% dibanding Agustus 2026 (Rp485.000)"; 2025 + Desember: Jan sampai Des 2025; tanpa overflow
  ```
- date: 2026-10-21
- commit: 775af38
- covers: [AC-001, AC-003, AC-004]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-001 | EV-002 | pass |
| AC-002, AC-005 | EV-001 | pass |
| AC-003, AC-004 | EV-001, EV-002 | pass |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Filter dengan data produksi | pemeriksaan visual memakai emulator | rendah; angka memakai fungsi yang sama dengan EV-006 F-006 |

## Result
Lulus.
