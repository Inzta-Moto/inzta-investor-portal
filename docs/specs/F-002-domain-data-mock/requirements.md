---
id: F-002
title: "Domain investasi dan data mock"
type: requirements
status: implementing
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# Requirements: Domain investasi dan data mock

## Problem

Portal harus menghitung jadwal komisi, pengembalian, dan penjualan bulanan sesuai perjanjian, tetapi Firebase ditahan (A-014). Aturan uang harus teruji tanpa jaringan dan siap diberi data Firestore nanti (ADR-0003).

## Goal

Satu `InvestorSnapshot` dari adaptor mock menghasilkan jadwal yang sama persis dengan Pasal 4 dan 5, terbukti oleh `npm test`.

## Non-goals

- Adaptor Firestore, Security Rules, Cloud Function (F-006).
- Tampilan (F-003).

## Functional requirements

### FR-001 — Jadwal komisi 24 bulan

The system shall menghitung komisi 3,2% dari total Dana Investasi untuk bulan 1 sampai 24, jatuh tempo tanggal 25 sampai 26 bulan ke-n setelah bulan Tanggal Efektif (A-013), dengan status Dibayar, Jatuh tempo, Terlambat, atau Akan datang.

- AC-001: Given Dana Investasi Rp200.000.000 dan tarif 320 basis poin, then komisi per bulan Rp6.400.000 dan total Rp153.600.000.
- AC-002: Given Tanggal Efektif 2026-11-10, then komisi bulan ke-1 jatuh tempo 2026-12-25 sampai 2026-12-26 dan bulan ke-24 pada 2028-11-25.
- AC-003: Given tanggal hari ini dan pembayaran tercatat, then status bulan dengan pembayaran = Dibayar; bulan berjalan sebelum tanggal 27 tanpa pembayaran = Jatuh tempo; lewat tanggal 26 = Terlambat; bulan setelahnya = Akan datang.
- AC-004: Given Tanggal Efektif kosong, then jadwal tetap 24 baris tanpa tanggal dan semua berstatus Akan datang.

### FR-002 — Jadwal tiga pengembalian

The system shall membentuk pengembalian ke-1, 2, 3 pada bulan ke-16, 20, 24, dengan nominal dari persentase yang diinput admin.

- AC-005: Given persentase 2500, 2500, 5000, then nominal Rp50.000.000, Rp50.000.000, Rp100.000.000.
- AC-006: Given persentase kosong, then nominal kosong (Belum ditetapkan), bukan nol.
- AC-007: Given ketiga persentase terisi dengan jumlah selain 10000, then snapshot ditandai tidak valid dengan alasan yang bisa ditampilkan.
- AC-008: Given pembayaran pengembalian tercatat, then total kembali dan sisa dihitung dari pembayaran, bukan dari jadwal.

### FR-003 — Bulan perjanjian berjalan

The system shall menentukan bulan perjanjian berjalan dari Tanggal Efektif dan tanggal hari ini.

- AC-009: Given Tanggal Efektif 2026-11-10 dan hari ini 2027-01-14, then bulan berjalan = 2; sebelum Desember 2026 = 0; setelah November 2028 = selesai.

### FR-004 — Penjualan bulanan

The system shall menjumlahkan penjualan per bulan kalender seperti `getSaleRevenue` dasbor internal dan menyajikan 12 bulan terakhir dengan bulan berjalan ditandai belum lengkap (A-007).

- AC-010: Given transaksi dengan `revenue`, tanpa `revenue`, dan `revenue` bukan angka, then dipakai `revenue`, lalu `sellingPrice * quantity`, lalu 0.
- AC-011: Given ringkasan bulanan, then deret berisi 12 bulan berurutan berakhir di bulan hari ini, bulan tanpa data bernilai 0, bulan terakhir bertanda berjalan.

### FR-005 — Kontrak sumber data dan adaptor mock

The system shall menyediakan `InvestorDataSource` dengan adaptor mock yang deterministik terhadap tanggal hari ini.

- AC-012: Given tanggal apa pun, then mock menghasilkan bulan perjanjian ke-3 dengan komisi bulan 1 dan 2 sudah dibayar, persentase pengembalian kosong.
- AC-013: Given `INVESTOR_DATA_SOURCE` selain `mock`, then pembuatan sumber data gagal dengan pesan yang menyebut F-006.

### FR-006 — Format Rupiah ringkas

- AC-014: Given 6400000, 153600000, 1200000000, then "Rp6,4 jt", "Rp153,6 jt", "Rp1,2 M".

## Out of scope

- Halaman input admin (A-008), status Ditangguhkan (A-012).

## Open questions

- Tidak ada yang memblokir; A-007, A-009, A-012, A-013 sudah diputuskan [delegasi].
