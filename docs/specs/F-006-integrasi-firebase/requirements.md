---
id: F-006
title: "Integrasi Firestore lewat server"
type: requirements
status: verification
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# Requirements: Integrasi Firestore lewat server

## Problem

Portal harus menampilkan angka Inzta yang sama dengan dasbor internal dari Firestore bersama (ADR-0001), tanpa mengirim data per transaksi ke investor, tanpa Blaze, dan tanpa mengubah rules atau dasbor internal (ADR-0006). Mock dihapus atas permintaan Sehan 2026-10-21 ("pastikan tidak ada data mock lagi, pastikan itu realtime").

## Goal

Setiap halaman portal dirender di server dari Firestore asli dan memperbarui diri sendiri tanpa muat ulang.

## Non-goals

- Cloud Function, koleksi ringkasan, perubahan Security Rules (ADR-0002, ADR-0005 superseded).
- Halaman input admin; admin memakai Firebase Console (A-008).

## Functional requirements

### FR-001 — Baca sales dengan proyeksi kolom

The system shall membaca `sales` hanya dengan kolom `date`, `revenue`, `sellingPrice`, `quantity`, dan menjumlahkan per bulan kalender dengan aturan A-007.

- AC-001: Given dokumen `sales` berisi pelanggan, kota, reseller, harga modal, when portal membaca, then hanya empat kolom itu yang diterima server dan HTML maupun payload RSC tidak memuat kolom lain.
- AC-002: Given dokumen lama tanpa `revenue`, then dihitung `sellingPrice * quantity`.

### FR-002 — Perjanjian dan pembayaran dari Firestore

- AC-003: Given `investor_agreement/current` dan `investor_payments`, then Ringkasan, Komisi, dan Pengembalian memakai nilainya; dokumen pembayaran yang rusak menjadi peringatan, perjanjian yang hilang atau rusak menjadi pesan yang bisa dibaca.

### FR-003 — Pembaruan otomatis dengan anggaran baca

- AC-004: Given penjualan baru bertanggal hari ini atau pembayaran baru, when halaman terbuka, then angka berubah dalam 60 detik tanpa muat ulang.
- AC-005: Given halaman tidak dipakai 15 menit atau tab tersembunyi, then tidak ada refresh; sentuhan berikutnya langsung memperbarui.
- AC-006: Given tanggal 1, then penjualan bertanggal kemarin tetap masuk bulan sebelumnya.

### FR-004 — Login milik portal

- AC-007: Given `INVESTOR_USERNAME` dan `INVESTOR_PASSWORD_HASH` (scrypt), then hanya pasangan yang cocok yang masuk; hash rusak ditolak sebagai kesalahan konfigurasi; investor tidak punya akun Firebase.
- AC-008: Given kata sandi diganti di env, then cookie lama tidak berlaku.
- AC-009: Given banyak percobaan gagal, then dibatasi 5 per klien dan 50 total per 15 menit.

### FR-005 — Tanpa data mock

- AC-010: Given aplikasi dibangun, then tidak ada adaptor mock, label "Data contoh", atau akun demo di build produksi; data contoh hanya ada di skrip emulator.

## Open questions

- A-016: kunci service account, env produksi, dan dokumen perjanjian di produksi. blocking: yes (hanya T-006).
