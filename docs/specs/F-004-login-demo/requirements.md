---
id: F-004
title: "Login mode demo"
type: requirements
status: implemented
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# Requirements: Login mode demo

> Diperbarui 2026-10-21 oleh F-006 FR-004 (ADR-0006): `DEMO_INVESTOR_*` diganti `INVESTOR_USERNAME` dan hash scrypt `INVESTOR_PASSWORD_HASH`; layar masuk, cookie sesi, gerbang, dan pembatas percobaan dari fitur ini tetap dipakai.

## Problem

Firebase Auth ditahan (A-014), tetapi pratinjau portal untuk klien tidak boleh terbuka bebas. Satu akun investor masuk dengan username dan kata sandi (VN Raja, A-005, ADR-0004).

## Goal

Halaman portal hanya terbuka setelah masuk dengan kredensial demo yang diperiksa server; sesi diakhiri dengan Keluar.

## Non-goals

- Firebase Auth, reset kata sandi, banyak akun (F-006).

## Functional requirements

### FR-001 — Layar masuk

The system shall menyediakan `/masuk` dengan Username dan Kata sandi yang diperiksa di server.

- AC-001: Given kredensial benar, when Masuk, then diarahkan ke `/ringkasan`.
- AC-002: Given kredensial salah atau kosong, then pesan "Username atau kata sandi salah." tampil tanpa menyebut field mana yang salah.

### FR-002 — Sesi bertanda tangan

The system shall menyimpan sesi di cookie httpOnly, SameSite Lax, Secure di produksi, berlaku 12 jam, berisi waktu kedaluwarsa dan tanda tangan HMAC-SHA256.

- AC-003: Given token yang diubah, kedaluwarsa, atau ditandatangani rahasia lain, then token ditolak.
- AC-004: Given pemeriksaan tanda tangan dan kredensial, then memakai perbandingan waktu-konstan.

### FR-003 — Gerbang halaman

- AC-005: Given tanpa sesi sah, when membuka halaman portal, then diarahkan ke `/masuk`.
- AC-006: Given sesi sah, when membuka `/masuk`, then diarahkan ke `/ringkasan`.

### FR-004 — Keluar

- AC-007: Given tombol Keluar, then cookie dihapus dan pengguna kembali ke `/masuk`.

### FR-005 — Konfigurasi

- AC-008: Given build produksi tanpa `DEMO_INVESTOR_USERNAME`, `DEMO_INVESTOR_PASSWORD`, atau `SESSION_SECRET` minimal 32 karakter, then semua percobaan masuk ditolak dengan pesan konfigurasi.
- AC-009: Given `next dev` tanpa variabel itu, then kredensial demo bawaan yang tertulis di README berlaku.

## Open questions

- Tidak ada; A-005 dan A-015 diputuskan [delegasi].
