---
id: F-011
title: "Banyak investor"
type: requirements
status: draft
tier: lite
owner: "VXerys"
created: 2026-10-22
last_updated: 2026-10-22
last_verified: 2026-10-22
supersedes: null
---

# Requirements: Banyak investor

Status: **ditahan, hanya spec** (keputusan Sehan 2026-10-22, Q7). Dikerjakan sebagai update berbiaya terpisah setelah ada investor kedua yang pasti.

## Problem

Portal dirancang untuk satu investor: satu akun di env server, satu dokumen `investor_agreement/current`, pembayaran dan penggunaan dana tanpa penanda pemilik. Inzta mungkin menerima investor baru dengan nominal dan isi perjanjian berbeda, misalnya Rp500.000.000.

## Goal

Setiap investor login dengan akunnya sendiri dan hanya melihat perjanjian, Komisi, pengembalian, dan penggunaan dana miliknya; admin mengelola semua investor dari ERP.

## Non-goals

- Investor mendaftar sendiri, lupa kata sandi mandiri, atau mengubah data.

## Functional requirements

### FR-001 — Akun per investor

- AC-001: Given dua investor, then masing-masing login dengan akunnya sendiri dan tidak bisa membuka data investor lain lewat URL atau parameter apa pun.
- AC-002: Given admin ERP, then admin menambah, menonaktifkan, dan mengganti kata sandi investor tanpa mengubah env server.

### FR-002 — Data per investor

- AC-003: Given perjanjian per investor (`investor_agreements/{agreementId}`), then Komisi, masa, dan jadwal pengembalian dihitung dari perjanjian investor yang login.
- AC-004: Given pembayaran dan belanja bertanda, then keduanya membawa id perjanjian dan hanya muncul untuk investor pemiliknya.
- AC-005: Given data dari masa satu investor, then dokumen `current`, pembayaran tanpa id perjanjian, dan belanja bertanda `"current"` tetap milik investor pertama setelah migrasi.

### FR-003 — ERP

- AC-006: Given halaman Investor ERP, then admin melihat daftar investor, lalu detail per investor (Tanggal Efektif, isi perjanjian F-010, pembayaran, penggunaan dana); menandai belanja berarti memilih investor yang membiayainya.
