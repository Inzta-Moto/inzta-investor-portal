---
inclusion: always          # always | fileMatch | manual
---

# Product

Short, always-loaded product context. The full product requirements live in `docs/product/prd.md`; this file must agree with it and stays under 120 lines.

## Vision

Inzta Investor Portal adalah portal daring hanya-baca untuk investor PT Inzta Gear Indonesia yang menampilkan laporan penjualan bulanan, rekap komisi, dan progres pengembalian dana investasi selama 24 bulan masa perjanjian.

Dasbor ini memenuhi Pasal 7 ayat 3 draf Perjanjian Kerja Sama Investasi: laporan hasil penjualan bulanan serta rekap Komisi dan pengembalian Dana Investasi, diakses investor dengan akun khusus, hanya untuk melihat. "Berhasil" berarti investor melihat angka yang sama dengan catatan Inzta, realtime, tanpa bisa membuka dasbor internal atau data per transaksi. Project content (specs, product docs, UI copy) is written in Indonesian; the framework text stays English.

## Personas

- Investor (Pihak Pertama): satu akun, membuka portal dari ponsel atau laptop untuk memantau penjualan bulanan, Komisi, dan sisa dana yang belum kembali. Tidak punya hak instruksi atas usaha (Pasal 8).
- Admin Inzta: mencatat penjualan di dasbor internal dan pembayaran Komisi serta pengembalian (lokasi pencatatan: A-008). Bukan pengguna portal di M1.

## Core use cases

- UC-001: Investor login, melihat hasil penjualan bulan berjalan dan riwayat per bulan selama 24 bulan.
- UC-002: Investor melihat Komisi per bulan (Rp4.800.000, lalu Rp6.400.000 setelah Tahap II) dan status bayar tanggal 25 sampai 26.
- UC-003: Investor melihat jadwal pengembalian bulan ke-16, 20, 24, total dana yang sudah kembali, dan sisanya.

## Non-goals

- Unduh, ekspor, cetak, atau PDF.
- Akses ke dasbor internal, data per transaksi, data pelanggan, reseller, atau harga modal.
- Investor mengubah data apa pun; lebih dari satu akun investor.

## Success signals

| Signal | What it tells us | Source |
|---|---|---|
| Laporan manual (Pasal 7 ayat 4) berhenti setelah rilis | portal cukup sebagai laporan resmi | konfirmasi Inzta |
| Angka bulanan portal sama dengan dasbor internal | agregasi benar | uji agregasi, pengecekan admin |

## Constraints that shape product decisions

- Satu database Firestore dengan dasbor internal, realtime (ADR-0001).
- Investor tidak boleh membaca data mentah; Security Rules tidak bisa menyaring field (ADR-0002, belum diputuskan).
- Nilai yang belum ditetapkan perjanjian tampil "belum ditetapkan", tidak ditebak.
- Bukti dan rincian kebutuhan: `docs/product/prd.md`, pertanyaan terbuka: `docs/context/ASSUMPTIONS.md`.
