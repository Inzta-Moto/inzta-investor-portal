---
id: F-001
title: "Fondasi proyek"
type: requirements
status: implementing
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# Requirements: Fondasi proyek

## Problem

Portal investor butuh kerangka aplikasi yang sama dengan proyek web Sehan lainnya, terhubung ke Firebase tanpa menyentuh data produksi, sebelum fitur login dan laporan dibangun. Tanpa fondasi yang terverifikasi, fitur berikutnya mewarisi konfigurasi yang belum teruji.

## Goal

`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, dan `npm run context:validate` hijau pada aplikasi Next.js kosong yang siap menerima fitur F-002 sampai F-004.

## Non-goals

- Login, pembacaan data Firestore, dan tampilan laporan (F-002 sampai F-004).
- Arah visual final dan deploy (F-005).

## Actors

- ACTOR-001: Pengembang, menjalankan perintah di `docs/steering/tech.md`.
- ACTOR-002: Pengunjung tanpa login, hanya melihat halaman placeholder.

## Functional requirements

### FR-001 — Halaman placeholder tanpa data

The system shall menyajikan halaman `/` berbahasa Indonesia yang tidak membaca data apa pun dan tidak diindeks mesin pencari.

- AC-001: Given build produksi, when `npm run build` selesai, then rute `/` dirender statis tanpa variabel Firebase.
- AC-002: Given respons halaman mana pun, when diperiksa, then terdapat meta `robots` `noindex, nofollow` dan header `X-Robots-Tag: noindex, nofollow`.

### FR-002 — Konfigurasi Firebase dari environment, lazy

The system shall membuat Firebase app hanya saat dipanggil, dari empat variabel `NEXT_PUBLIC_FIREBASE_*`, dan melaporkan nama variabel yang kosong.

- AC-003: Given semua variabel terisi, when konfigurasi dibaca, then hasilnya berisi `apiKey`, `authDomain`, `projectId`, `appId`.
- AC-004: Given variabel kosong atau spasi, when konfigurasi dibaca, then hasilnya gagal dan mencantumkan setiap nama variabel yang kosong.

### FR-003 — Format Rupiah bulat

The system shall memformat nominal Rupiah bulat dengan pemisah titik dan spasi tak terputus, dan menolak pecahan.

- AC-005: Given 4800000, when diformat, then hasilnya `Rp 4.800.000`; given 1.5, then RangeError.

### FR-004 — Hanya lihat

The system shall menolak ditampilkan dalam frame situs lain dan menyembunyikan isi halaman saat dicetak.

- AC-006: Given respons halaman, when diperiksa, then header `X-Frame-Options: DENY` ada.
- AC-007: Given media cetak, when stylesheet diterapkan, then `body` bernilai `display: none`.

## Business and validation rules

- BR-001: tidak ada perintah atau kode di fitur ini yang membaca atau menulis Firestore produksi.

## Dependencies and constraints

- Versi mengikuti `fluxa-web` dan `bookmate-web`: Next.js 16.4.2, React 19.3.0, Tailwind v4, ESLint 9, `node --test`.
- Dependency baru di luar proyek acuan: `firebase` 13 (diminta pemilik, ADR-0001).

## Out of scope

- Security Rules, koleksi `investor_*`, akun investor.

## Open questions

- A-011: domain dan hosting, blocking: no (hanya F-005).
