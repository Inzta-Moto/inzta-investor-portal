---
id: F-010
title: "Form isi perjanjian di ERP"
type: requirements
status: draft
tier: lite
owner: "VXerys"
created: 2026-10-22
last_updated: 2026-10-22
last_verified: 2026-10-22
supersedes: null
---

# Requirements: Form isi perjanjian di ERP

Status: **ditahan, hanya spec** (keputusan Sehan 2026-10-22, Q8). Isi perjanjian sensitif karena sudah ada perjanjian di atas kertas; jangan dieksekusi sebelum Sehan menyetujui.

## Problem

Angka perjanjian di portal berasal dari draf (`src/lib/investment/contract-terms.ts`): Dana Investasi Rp200.000.000, Komisi 3,2%, 24 bulan, Tahap I/II, pengembalian bulan ke-16, 20, 24. `investor_agreement/current` bisa menimpa setiap nilai, tetapi halaman Investor ERP baru punya isian Tanggal Efektif, jadi nilai lain hanya bisa diubah lewat Firebase Console.

## Goal

Owner atau admin mengisi dan mengubah isi perjanjian dari halaman Investor ERP dengan validasi yang sama dengan portal.

## Non-goals

- Banyak investor (F-011). Riwayat versi perjanjian.

## Functional requirements

### FR-001 — Isian perjanjian

- AC-001: Given halaman Investor ERP, then owner atau admin bisa mengubah Dana Investasi, persen Komisi, masa perjanjian (bulan), nominal dan tanggal terima Tahap I/II, serta bulan dan persentase pengembalian ke-1/2/3.
- AC-002: Given isian, then validasinya sama dengan `toAgreement` portal: Rupiah bulat, persen dalam basis poin 0 sampai 10.000, bulan pengembalian naik dan tidak melewati masa, jumlah persentase pengembalian 100% setelah ketiganya diisi.
- AC-003: Given perubahan Dana Investasi atau persen Komisi, then ERP menampilkan Komisi per bulan yang baru dan meminta konfirmasi sebelum menyimpan.
- AC-004: Given simpan, then dokumen mencatat `updatedAt` dan `updatedBy`, dan portal menampilkan angka baru dalam sekitar satu menit.
