---
inclusion: always          # always | fileMatch | manual
---

# Product

Short, always-loaded product context. The full product requirements live in `docs/product/prd.md`; this file must agree with it and stays under 120 lines.

## Vision

Inzta Investor Portal adalah portal daring hanya-baca untuk investor PT Inzta Gear Indonesia yang menampilkan laporan penjualan bulanan, rekap komisi, dan progres pengembalian dana investasi selama 24 bulan masa perjanjian.

Portal memberi investor akses tambahan ke hasil penjualan bulanan serta rekap Komisi dan pengembalian Dana Investasi, dengan akun khusus, hanya untuk melihat. Perjanjian tidak lagi mewajibkan dasbor (keputusan Sehan 2026-10-21); portal adalah akses tambahan bagi investor di luar kewajiban kontrak. "Berhasil" berarti investor melihat angka yang sama dengan catatan Inzta, realtime, tanpa bisa membuka dasbor internal atau data per transaksi. Project content (specs, product docs, UI copy) is written in Indonesian; the framework text stays English.

## Personas

- Investor (Pihak Pertama): satu akun, membuka portal dari ponsel atau laptop untuk memantau penjualan bulanan, Komisi, dan sisa dana yang belum kembali. Tidak punya hak instruksi atas usaha (Pasal 8).
- Admin Inzta: mencatat penjualan di dasbor internal dan pembayaran Komisi serta pengembalian (lokasi pencatatan: A-008). Bukan pengguna portal di M1.

## Core use cases

- UC-001: Investor login, melihat hasil penjualan bulan berjalan dan riwayat per bulan selama 24 bulan.
- UC-002: Investor melihat Komisi Rp6.400.000 per bulan (flat, 24 bulan) dan status bayar tanggal 25 sampai 26.
- UC-003: Investor melihat jadwal pengembalian bulan ke-16, 20, 24 dengan nominal yang diinput admin, total dana yang sudah kembali, dan sisanya.

## Non-goals

- Unduh, ekspor, cetak, atau PDF.
- Akses ke dasbor internal, data per transaksi, data pelanggan, reseller, atau harga modal.
- Investor mengubah data apa pun; lebih dari satu akun investor.

## Success signals

| Signal | What it tells us | Source |
|---|---|---|
| Investor membuka portal minimal sebulan sekali | portal berguna sebagai akses tambahan | konfirmasi Inzta |
| Angka bulanan portal sama dengan dasbor internal | agregasi benar | uji agregasi, pengecekan admin |

## Constraints that shape product decisions

- Satu database Firestore dengan dasbor internal, realtime (ADR-0001).
- Investor tidak boleh membaca data mentah. Server portal membaca `sales` hanya empat kolom (tanggal, revenue, harga jual, jumlah) dan mengirim total bulanan ke browser; investor tidak punya akun Firebase (ADR-0006).
- Nilai yang belum ditetapkan perjanjian tampil "belum ditetapkan", tidak ditebak.
- Bukti dan rincian kebutuhan: `docs/product/prd.md`, pertanyaan terbuka: `docs/context/ASSUMPTIONS.md`.
