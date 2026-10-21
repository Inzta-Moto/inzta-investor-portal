---
id: F-003
title: "Tampilan portal investor"
type: requirements
status: implemented
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# Requirements: Tampilan portal investor

## Problem

Investor membuka portal terutama dari HP. Layar harus menjawab "komisi bulan ini sudah dibayar?" lebih dulu, lalu penjualan dan pengembalian, mengikuti `docs/design/design-system.html` dan `docs/design/dashboard-desktop.html`.

## Goal

Empat halaman (Ringkasan, Penjualan, Komisi, Pengembalian) tampil benar dari 360 px sampai desktop dari `Portfolio` (F-002), tanpa scroll horizontal.

## Non-goals

- Login dan sesi (F-004), Firestore (F-006), margin (A-006), halaman admin (A-008).

## Functional requirements

### FR-001 — Kerangka aplikasi

The system shall menampilkan sidebar berlogo Inzta di ≥ 1024 px dan bar atas plus navigasi bawah di bawahnya, dengan penanda "Data contoh" selama sumber data mock.

- AC-001: Given lebar 1366 px, then sidebar dengan 4 menu dan menu aktif charcoal tampil; navigasi bawah tersembunyi.
- AC-002: Given lebar 360 px, then navigasi bawah 4 tujuan berlabel tampil dan tidak ada scroll horizontal.
- AC-003: Given sumber data mock, then label "Data contoh" terlihat di bar atas.

### FR-002 — Ringkasan

The system shall menampilkan kartu komisi bulan berjalan, dana kembali, komisi diterima, garis waktu 24 bulan, grafik penjualan 12 bulan, dan jadwal terdekat.

- AC-004: Given bulan berjalan ke-3, then kartu utama menampilkan Rp6.400.000 dan chip sesuai status dari F-002.
- AC-005: Given perjanjian belum ditandatangani, belum mulai, atau selesai, then kartu utama menjelaskan fase itu.

### FR-003 — Penjualan

The system shall menampilkan bulan berjalan, bulan lengkap terakhir dengan perubahannya, rata-rata bulan lengkap, serta grafik dan tabel 12 bulan.

- AC-006: Given bulan berjalan, then batangnya diarsir oranye dan bertanda "berjalan" di tooltip dan tabel.
- AC-007: Given tombol Tabel, then grafik diganti tabel 12 nilai Rupiah lengkap.

### FR-004 — Komisi

- AC-008: Given 24 bulan, then daftar (HP) atau tabel (desktop) menampilkan bulan, periode, jatuh tempo, nominal, status, dan catatan pengembalian.

### FR-005 — Pengembalian

- AC-009: Given persentase belum diisi, then ketiga kartu menampilkan "Belum ditetapkan" dan sisa dana Rp200.000.000.
- AC-010: Given persentase tidak berjumlah 100%, then peringatan dari F-002 tampil.

### FR-006 — Hanya lihat dan kondisi layar

- AC-011: Given halaman portal, then tidak ada tombol unduh, ekspor, atau cetak, dan CSS print menyembunyikan isi.
- AC-012: Given data gagal dimuat, then layar kesalahan berbahasa Indonesia dengan tombol Coba lagi tampil; saat memuat, teks "Memuat data…" tampil.

### FR-007 — Kartu dana sudah masuk

The system shall menampilkan kartu "Komisi sudah masuk" dan "Pengembalian dana sudah masuk" di Ringkasan, Komisi, dan Pengembalian, serta tabel pengembalian seperti Pasal 5 (permintaan Sehan 2026-10-21).

- AC-013: Given pembayaran tercatat, then kartu menampilkan nominal masuk, dari total berapa, jumlah bulan atau kali, dan rincian ke-1 sampai ke-3.
- AC-014: Given halaman Pengembalian di desktop, then tabel berkolom Pengembalian, Jatuh tempo, Persentase, Jumlah, Sudah masuk, Status dengan baris Jumlah 100% dan Rp200.000.000.

## Dependencies and constraints

- Token sistem desain v0.1 (latar putih, oranye Inzta sebagai aksen, tanpa kuning muda); tanpa dependency baru, grafik SVG buatan sendiri.

## Open questions

Tidak ada yang memblokir.
