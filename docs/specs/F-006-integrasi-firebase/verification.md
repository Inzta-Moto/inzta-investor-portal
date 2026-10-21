---
id: F-006
title: "Integrasi Firestore lewat server"
type: verification
status: verification
tier: full
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

### EV-005 — Tanpa dokumen perjanjian dan field rusak
- command: `npm test`, `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node --test "src/**/*.itest.ts"`
- output:
  ```text
  tests 48 pass 0 fail: tanpa dokumen = CONTRACT_TERMS; hanya effectiveDate diisi = sisa kontrak; field rusak dan urutan dueMonth terbalik kembali ke kontrak
  emulator 7 pass: tanpa perjanjian fase "unsigned", Rp6.400.000 per bulan, penjualan sama persis dengan snapshot saat dokumen ada
  ```
- date: 2026-10-21
- commit: fad9e3c
- covers: [AC-003]

### EV-006 — Pembacaan hanya-hitung Firestore produksi
- command: skrip sementara dengan Admin SDK dan `.env.local` (izin Sehan "boleh baca produksi", "silahkan cek"), hanya `count()` dan `select()` empat kolom
- output:
  ```text
  project database-inzta: sales 1523, semuanya date YYYY-MM-DD dan revenue bulat; investor_agreement belum ada, investor_payments 0
  Mei 11.365.000 | Jun 79.644.131 | Jul 105.080.710 | Agu 97.330.669 | Sep 111.244.737 | Okt (berjalan) 44.575.650
  ```
- date: 2026-10-21
- commit: a303fbd
- covers: [AC-001, AC-002]

### EV-007 — Total bulanan cocok dengan dasbor ERP
- command: pembandingan manual oleh Sehan antara halaman Penjualan portal dan laporan bulanan dasbor ERP (`database-inzta`)
- output:
  ```text
  Sehan 2026-10-21: "udah cocok kok data penjualan nya" (Mei sampai Sep 2026, angka EV-006)
  ```
- date: 2026-10-21
- commit: dfd84a6
- covers: [AC-001, AC-002]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-001, AC-010 | EV-001, EV-002, EV-004, EV-007 | pass |
| AC-002, AC-006 | EV-002, EV-006, EV-007 | pass |
| AC-003 | EV-002, EV-005 | pass |
| AC-004 | EV-003 | pass |
| AC-005 | | not_run |
| AC-007 sampai AC-009 | EV-001, EV-003 | pass |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| AC-005 jeda 15 menit | tidak ditunggu 15 menit di browser; logika dibaca ulang dan lint bersih | halaman bisa terus refresh atau tidak pulih setelah jeda; dicek saat uji terima |

## Result
Lulus di emulator dan tersambung ke `database-inzta` (hanya baca). T-006 menunggu A-016: dokumen perjanjian, env hosting, kata sandi kuat.
