---
id: F-007
title: "Filter bulan dan tahun di Penjualan"
type: requirements
status: implemented
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# Requirements: Filter bulan dan tahun di Penjualan

## Problem

Klien meminta grafik dan tabel penjualan bisa disaring per bulan dan tahun (pesan WhatsApp 2026-10-21, "kasih filter yah, bulan n tahun"). Sebelumnya hanya 12 bulan terakhir.

## Goal

Investor memilih tahun dan bulan di halaman Penjualan dan melihat total yang sama dengan dasbor ERP untuk periode itu.

## Non-goals

- Rentang tanggal bebas, filter per kanal, ekspor.

## Functional requirements

### FR-001 — Pilih tahun

- AC-001: Given tahun dipilih, then grafik dan tabel menampilkan Januari sampai Desember tahun itu, atau sampai bulan ini untuk tahun berjalan; judul menyebut tahunnya.
- AC-002: Given pilihan tahun, then daftar tahun dimulai dari bulan penjualan pertama sampai tahun ini; tanpa filter tetap 12 bulan terakhir.

### FR-002 — Pilih bulan

- AC-003: Given bulan dipilih, then bulan itu disorot, batang lain dipudarkan, dan ringkasan menampilkan total bulan itu serta perbandingan dengan bulan sebelumnya (Januari dibanding Desember tahun lalu).
- AC-004: Given bulan yang belum terjadi, then bulan itu tidak bisa dipilih; parameter URL yang tidak valid kembali ke tampilan bawaan.

### FR-003 — Angka konsisten

- AC-005: Given periode apa pun, then total per bulan sama dengan tampilan 12 bulan dan aturan `getSaleRevenue` dasbor (F-006).
