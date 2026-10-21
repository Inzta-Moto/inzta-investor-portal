---
id: F-006
title: "Integrasi Firebase (ditahan)"
type: requirements
status: draft
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# Requirements: Integrasi Firebase (ditahan)

## Problem

Portal memakai data mock atas permintaan klien (A-014). Saat diaktifkan, portal harus membaca data nyata dari Firestore bersama (ADR-0001) tanpa membuka data mentah `sales` (ADR-0002) dan tanpa memberi akun investor akses ke dasbor internal (A-004).

## Goal

`INVESTOR_DATA_SOURCE=firestore` menampilkan angka Inzta yang sama dengan dasbor internal, realtime, dengan akun investor Firebase Auth.

## Functional requirements

### FR-001 — Adaptor Firestore

The system shall mengimplementasikan `InvestorDataSource` (ADR-0003) dari koleksi `investor_agreement`, `investor_payments`, `investor_monthly_sales`.

- AC-001: Given data ringkasan di emulator, then `InvestorSnapshot` sama bentuknya dengan mock dan seluruh test domain tetap hijau.

### FR-002 — Ringkasan penjualan oleh Cloud Function

- AC-002: Given penjualan ditambah, diubah, atau dihapus di `sales`, then `investor_monthly_sales` bulan itu dihitung ulang dengan `aggregateMonthlySales` (A-007).

### FR-003 — Security Rules

- AC-003: Given akun role `investor`, then baca `investor_*` diizinkan; baca `sales`, `users`, `products` dan semua tulis ditolak, diuji di emulator.

### FR-004 — Firebase Auth menggantikan login demo

- AC-004: Given akun investor Firebase Auth, then layar masuk memakai Firebase Auth dan login demo (ADR-0004) dihapus.

### FR-005 — Gerbang dasbor internal

- AC-005: Given akun investor, when login di dasbor internal, then ditolak (perubahan di repo `inztamoto-erp-dashboard`).

## Open questions

- A-003: rules aktif dan akses Owner project. blocking: yes.
- A-004: perbaikan gerbang dasbor internal masuk lingkup atau tidak. blocking: yes.
- Paket Blaze untuk Cloud Functions (ADR-0002). blocking: yes.
