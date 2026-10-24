---
id: F-009
title: "Penggunaan dana investasi"
type: requirements
status: verification
tier: lite
owner: "VXerys"
created: 2026-10-22
last_updated: 2026-10-24
last_verified: 2026-10-23
supersedes: null
---

# Requirements: Penggunaan dana investasi

## Problem

Klien meminta investor bisa melihat ke mana dana investasi dipakai saat Inzta berbelanja, hanya berupa daftar, tanpa total belanja (permintaan klien lewat Sehan 2026-10-22). Keputusan desain dari sesi grilling 2026-10-22 (Q1 sampai Q14) dicatat di bawah. Revisi 2026-10-23 (permintaan Raja Purnama): belanja investor dicatat di menu ERP sendiri dan tidak dicampur ke tab atau kartu yang sudah ada, karena investor sifatnya sementara (ADR-0008 menggantikan ADR-0007).

## Goal

Admin Inzta mencatat belanja yang dibayar dana investasi di menu Belanja Investasi ERP, dan investor melihat daftarnya di portal sekitar satu menit kemudian.

## Non-goals

- Rincian per barang di portal (dicabut klien 2026-10-24), sisa dana, atau grafik penggunaan dana.
- Menghitung Belanja Investasi di Belanja Produksi, Laporan, atau Dashboard ERP; pembagian nominal satu belanja (Q2).
- Merapikan atau menyeragamkan kategori belanja (Q12).
- Form isi perjanjian (F-010) dan banyak investor (F-011).

## Functional requirements

### FR-001 — Menu Belanja Investasi di ERP

- AC-001: Given owner atau admin, then sidebar ERP punya menu "Belanja Investasi" untuk menambah, mengubah, dan menghapus belanja di koleksi `investor_purchases`; role lain tidak melihat menu itu dan dialihkan bila membuka halamannya (Q9, revisi 2026-10-23).
- AC-002: Given menu Belanja Investasi, then admin memilih periode Hari, Minggu, Bulan, atau Semua dengan tanggal acuan, mencari barang, dan melihat total serta jumlah transaksi periode itu; total hanya ada di ERP (revisi 2026-10-23).
- AC-003: Given belanja bertanggal sebelum Tanggal Efektif, then ERP tetap menyimpan dan menampilkan peringatan (Q5).
- AC-004: Given Belanja Produksi dan halaman Investor, then keduanya tidak punya centang, label, kartu, atau peringatan dana investasi, dan Belanja Investasi tidak muncul di Belanja Produksi (revisi 2026-10-23).

### FR-002 — Daftar di portal

- AC-005: Given Belanja Investasi, then halaman "Penggunaan Dana Investasi" menampilkan satu angka: total seluruh belanja, dengan jumlah belanja dan rentang bulannya, di samping Dana Investasi dari perjanjian (revisi klien 2026-10-24: "jangan pake rincian, global aja, total dana terpakai berapa").
- AC-006: Given halaman itu, then tidak ada rincian per barang, sisa dana, harga satuan, catatan, atau status minggu. Rincian per barang tetap dicatat di ERP.
- AC-007: Given belanja ditambah, diedit, atau dihapus di menu Belanja Investasi, then portal menampilkan keadaan terbaru setelah cache 25 detik (Q4, Q10).
- AC-008: Given tidak ada Belanja Investasi, then total Rp0 dengan keterangan "Belum ada belanja yang dibayar dari dana investasi."

### FR-003 — Batas data

- AC-009: Given dokumen Belanja Investasi dengan harga satuan, catatan, dan field lain, then server portal hanya menerima enam kolom ADR-0008, dan tidak pernah membaca `production_purchases`.
- AC-010: Given dokumen Belanja Investasi yang rusak, then dokumen itu dilewati dan investor melihat kalimat biasa.
