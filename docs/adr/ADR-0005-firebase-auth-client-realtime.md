---
id: ADR-0005
title: Firebase Auth di browser, akses investor lewat dokumen investor_access, data realtime di klien
type: adr
status: superseded
tier: full
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: ADR-0004
---

# ADR-0005: Firebase Auth di browser dan data realtime di klien

> Superseded oleh ADR-0006 (2026-10-21): server portal membaca `sales` dengan proyeksi empat kolom; tanpa Cloud Function dan tanpa akun Firebase untuk investor.

Sehan membuka integrasi Firebase pada 2026-10-21 ("integrasikan saja langsung"). Menggantikan login demo ADR-0004 saat `INVESTOR_DATA_SOURCE=firestore`; mode mock tetap memakai ADR-0004.

## Context

Dasbor internal membaca Firestore langsung dari browser dengan Firebase Auth; tidak ada server yang memegang kredensial Admin. ADR-0001 meminta data realtime; ADR-0002 memilih koleksi ringkasan `investor_*`.

## Decision drivers

1. Tanpa service account di hosting portal.
2. Realtime lewat `onSnapshot`.
3. Otorisasi ditegakkan Security Rules, bukan UI.
4. Akun investor tidak menambah hak di koleksi milik dasbor internal.

## Options

### Option A — Firebase Auth di browser, rules memeriksa `investor_access/{uid}`, listener di klien

- Advantages: sama dengan pola dasbor internal; tanpa Admin SDK; admin cukup membuat satu dokumen di Console.
- Disadvantages: halaman portal dirender di klien; gerbang halaman di klien hanya untuk UX, keamanan sepenuhnya di rules.

### Option B — Server memverifikasi ID token dan membaca dengan Admin SDK

- Disadvantages: butuh service account dan dependency `firebase-admin` di portal; bukan push realtime.

## Decision

We will memakai Option A. Login memakai email dan kata sandi Firebase Auth (A-005 diperbarui). Seorang pengguna adalah investor bila dokumen `investor_access/{uid}` ada. Rules portal hanya menambah blok untuk `investor_*` dan `investor_access` dan tidak boleh melonggarkan blok yang sudah ada.

## Consequences

- Positive: tanpa kredensial server; realtime; satu titik otorisasi.
- Negative or cost: bila rules aktif saat ini mengizinkan semua pengguna login membaca semua koleksi (A-003), akun investor ikut bisa membaca `sales`; rules lama harus diperketat sebelum akun investor dibuat (F-006 T-001, T-005).
- Operational: deploy rules adalah aksi produksi yang memengaruhi dasbor internal; selalu digabung dengan rules aktif, diuji di emulator, dan disetujui Sehan.

## Revisit when

- Inzta menambah backend server, atau investor lebih dari satu.
