---
id: F-009
title: "Penggunaan dana investasi"
type: requirements
status: implementing
tier: lite
owner: "VXerys"
created: 2026-10-22
last_updated: 2026-10-22
last_verified: 2026-10-22
supersedes: null
---

# Requirements: Penggunaan dana investasi

## Problem

Klien meminta investor bisa melihat ke mana dana investasi dipakai saat Inzta berbelanja, hanya berupa daftar, tanpa total belanja (permintaan klien lewat Sehan 2026-10-22). Keputusan desain dari sesi grilling 2026-10-22 (Q1 sampai Q14) dicatat di bawah.

## Goal

Admin Inzta menandai belanja di ERP yang dibayar dana investasi, dan investor melihat daftarnya di portal sekitar satu menit kemudian.

## Non-goals

- Total, sisa dana, ringkasan angka, atau grafik penggunaan dana.
- Pengeluaran di luar Belanja Produksi (Q1), pembagian nominal satu belanja (Q2).
- Merapikan atau menyeragamkan kategori belanja (Q12).
- Form isi perjanjian (F-010) dan banyak investor (F-011).

## Functional requirements

### FR-001 — Menandai di ERP

- AC-001: Given owner atau admin, then form Tambah dan Edit Belanja Produksi punya centang "Dibayar dari dana investasi"; role lain tidak melihat centang itu (Q9).
- AC-002: Given halaman Investor ERP, then owner atau admin melihat Belanja Produksi per bulan dan bisa menandai atau membatalkan tanda per barang, termasuk belanja yang sudah closed; hanya tandanya yang berubah (Q9, Q10).
- AC-003: Given belanja bertanggal sebelum Tanggal Efektif, then ERP tetap menandai dan menampilkan peringatan (Q5).
- AC-004: Given belanja bertanda dihapus, then ERP memperingatkan bahwa belanja itu tampil di portal investor (Q10).

### FR-002 — Daftar di portal

- AC-005: Given belanja bertanda, then halaman "Penggunaan Dana Investasi" menampilkan tanggal, nama barang, kategori seperti diketik admin, jumlah dengan satuan, dan nominal per barang, terbaru di atas, dikelompokkan per bulan (Q3, Q12).
- AC-006: Given halaman itu, then tidak ada total, sisa dana, harga satuan, catatan, atau status minggu (Q3).
- AC-007: Given belanja diedit, ditandai, atau tandanya dibatalkan di ERP, then portal menampilkan keadaan terbaru tanpa menunggu minggu ditutup (Q4, Q10).
- AC-008: Given tidak ada belanja bertanda, then halaman menampilkan "Belum ada belanja yang dibayar dari dana investasi."

### FR-003 — Batas data

- AC-009: Given dokumen belanja dengan harga satuan, catatan, status, dan field lain, then server portal hanya menerima enam kolom ADR-0007 dan hanya untuk belanja bertanda.
- AC-010: Given dokumen bertanda yang rusak, then dokumen itu dilewati dan investor melihat kalimat biasa.
