---
id: F-006
title: "Integrasi Firestore lewat server"
type: verification
status: verification
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
requirements: [FR-001, FR-002, FR-003, FR-004, FR-005]
supersedes: null
---

# Verification: Integrasi Firestore lewat server

## Evidence

### EV-001 — Lint, typecheck, unit test, build
- command: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`
- output:
  ```text
  eslint 0 masalah; tsc 0 error; tests 44 pass 0 fail (scrypt, hash rusak ditolak, kunci sesi ikut kata sandi, pembatas global); build sukses tanpa adaptor mock dan label "Data contoh"
  ```
- date: 2026-10-21
- commit: 5c4d4f6
- covers: [AC-007, AC-008, AC-009, AC-010]

### EV-002 — Integrasi Firestore di emulator
- command: `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node --test "src/**/*.itest.ts"` (isi yang sama dengan `npm run test:emulator`)
- output:
  ```text
  ✔ only date, revenue, sellingPrice, quantity; ✔ monthly totals incl. legacy documents; ✔ yesterday on the 1st counts in the previous month
  ✔ backdated sale within the 1-hour cache; ✔ today's sale after 25 s; ✔ payment after 25 s; ✔ missing agreement is readable — tests 7, pass 7
  ```
- date: 2026-10-21
- commit: 5c4d4f6
- covers: [AC-001, AC-002, AC-003, AC-006]

### EV-003 — Pembaruan otomatis dan login di HP 360 px
- command: `next start` dengan emulator, browser pane 360x780; tulis pembayaran dan penjualan baru ke emulator tanpa muat ulang halaman
- output:
  ```text
  investor@inzta.id: sandi salah ditolak, benar → /ringkasan; Komisi sudah masuk Rp12,8 jt → Rp19,2 jt dalam 16 detik tanpa reload
  Penjualan Oktober Rp1.050.000 → Rp2.050.000 dalam 18 detik; Keluar → /masuk; tanpa sesi → redirect; scrollWidth 360
  ```
- date: 2026-10-21
- commit: 5c4d4f6
- covers: [AC-004, AC-007]

### EV-004 — Tidak ada kolom sensitif di halaman
- command: periksa HTML `/penjualan` dan payload RSC (`RSC: 1`) dengan data emulator yang berisi pelanggan, kota, reseller, harga modal
- output:
  ```text
  HTML dan RSC 14.192 byte: tidak ada "Pelanggan", "Bandung", "Reseller", "costPrice", "customer"; HTML juga tanpa "sellingPrice"
  ```
- date: 2026-10-21
- commit: 5c4d4f6
- covers: [AC-001, AC-010]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-001, AC-010 | EV-001, EV-002, EV-004 | pass |
| AC-002, AC-003, AC-006 | EV-002 | pass |
| AC-004 | EV-003 | pass |
| AC-005 | | not_run |
| AC-007 sampai AC-009 | EV-001, EV-003 | pass |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| AC-005 jeda 15 menit | tidak ditunggu 15 menit di browser; logika dibaca ulang dan lint bersih | halaman bisa terus refresh atau tidak pulih setelah jeda; dicek saat uji terima |
| Firestore produksi `inzta-5244e` | butuh kunci service account dan dokumen perjanjian (A-016); agen tidak menyentuh produksi | dokumen `sales` yang menyimpang (mis. `date` bukan string) tidak terhitung; volume harian belum diketahui, kuota Spark bersama bisa menipis |

## Result
Lulus di emulator. T-006 (penyambungan produksi) menunggu A-016.
