---
id: ADR-0003
title: Lapisan data portal lewat kontrak InvestorSnapshot, adaptor mock dulu
type: adr
status: approved
tier: full
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# ADR-0003: Lapisan data lewat kontrak InvestorSnapshot, adaptor mock dulu

## Context

Klien meminta data mock dulu dan integrasi Firebase ditahan (A-014). Portal tetap harus siap tersambung ke Firestore bersama (ADR-0001) dengan model ringkasan (ADR-0002) tanpa menulis ulang layar.

## Decision drivers

1. Layar tidak tahu sumber data.
2. Perhitungan komisi dan pengembalian bisa diuji tanpa Firestore.
3. Mengganti mock ke Firestore menyentuh satu modul.

## Options

### Option A — Antarmuka `InvestorDataSource` yang mengembalikan `InvestorSnapshot`

- Advantages: satu titik ganti; domain murni teruji dengan `node --test`.
- Disadvantages: satu lapisan tambahan.

### Option B — Layar memanggil Firestore langsung, mock lewat emulator

- Advantages: tanpa abstraksi.
- Disadvantages: butuh Firebase CLI dan emulator sekarang, bertentangan dengan permintaan klien.

## Decision

We will memakai Option A. `src/lib/data/source.ts` mendefinisikan `InvestorDataSource.getSnapshot(now)`; `src/lib/data/mock.ts` adalah satu-satunya implementasi sampai F-006. `InvestorSnapshot` hanya berisi bentuk ringkasan: perjanjian, pembayaran, dan penjualan per bulan.

Applies to: semua halaman portal. Does not apply to: autentikasi (ADR-0004).

## Rationale

Domain (`src/lib/investment/`) menerima data biasa sehingga aturan Pasal 4 dan 5 teruji tanpa jaringan; adaptor Firestore cukup memetakan dokumen `investor_*` ke kontrak yang sama.

## Consequences

- Positive: mode mock dan Firestore memakai layar dan test yang sama.
- Negative or cost: data mock harus dijaga agar tidak disangka data Inzta; setiap layar menampilkan penanda "Data contoh" selama mode mock.
- Operational: variabel `INVESTOR_DATA_SOURCE` memilih adaptor; nilai selain `mock` ditolak sampai F-006.

## Revisit when

- F-006 dimulai, atau klien meminta sumber data lain.
