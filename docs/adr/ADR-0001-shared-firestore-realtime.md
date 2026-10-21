---
id: ADR-0001
title: Satu database Firestore untuk dasbor internal dan portal investor, dibaca realtime
type: adr
status: approved
tier: full
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# ADR-0001: Satu database Firestore untuk dua aplikasi web, dibaca realtime

## Context

PT Inzta Gear Indonesia mencatat penjualan di dasbor internal `inztamoto-erp-dashboard` (Next.js 14, Firebase 10 compat, Firestore). Inzta menyediakan dasbor investor sebagai akses tambahan di luar kewajiban kontrak (perjanjian tidak lagi menyebut dasbor, revisi 2026-10-21). VN Raja Purnama 2026-10-20 meminta aplikasi terpisah dari dasbor internal yang "ambil database penjualan dari dashboard Inzta".

## Decision drivers

1. Angka yang dilihat investor sama dengan angka yang dicatat admin, tanpa sinkronisasi manual.
2. Perubahan penjualan terlihat di portal tanpa jeda batch.
3. Investor tidak memakai dan tidak bisa membuka dasbor internal.
4. Waktu pengerjaan singkat.

## Options

### Option A — Project Firestore yang sama, Firebase client SDK, listener realtime

- Advantages: satu sumber data, realtime lewat `onSnapshot`, tidak ada pipeline ekspor.
- Disadvantages: isolasi data bergantung penuh pada Security Rules dan pada gerbang login dasbor internal (lihat ADR-0002, A-002 sampai A-004).

### Option B — Database terpisah yang diisi lewat ekspor berkala

- Advantages: isolasi fisik.
- Disadvantages: tidak realtime, butuh job sinkronisasi dan pemantauannya, dua sumber angka.

## Decision

We will memakai project Firebase dan database Firestore yang sama dengan dasbor internal, dibaca lewat Firebase JS SDK modular di browser dengan listener realtime. Portal tidak menulis ke koleksi milik dasbor internal.

Applies to: seluruh data portal. Does not apply to: cara data penjualan diringkas sebelum dibaca investor (ADR-0002).

## Rationale

Dikonfirmasi Sehan pada 2026-10-21: "1 database 2 web agar itu realtime". Option A memenuhi driver 1, 2, dan 4; driver 3 dipenuhi oleh aplikasi terpisah ditambah kontrol di ADR-0002.

## Consequences

- Positive: tidak ada salinan data; angka portal mengikuti input admin secara langsung.
- Negative or cost: perubahan Security Rules memengaruhi dua aplikasi sekaligus dan menjadi aksi produksi.
- Operational: kuota baca Firestore dipakai bersama; listener portal dibatasi pada dokumen yang dibutuhkan.

## Risks

| Risk | Impact | Mitigation or verification |
|---|---|---|
| Rules saat ini membuka koleksi untuk semua pengguna login | investor membaca data mentah | A-003: ekspor rules ke repo, uji di emulator sebelum diubah |
| Akun investor diterima dasbor internal | investor membuka dasbor internal | A-004: gerbang role di dasbor internal |

## Follow-up

ADR-0002 (isolasi data investor), `docs/architecture/security.md`, `docs/architecture/data-model.md`.

## Revisit when

- Inzta memindahkan dasbor internal ke backend lain, atau volume baca membuat biaya listener tidak wajar.
