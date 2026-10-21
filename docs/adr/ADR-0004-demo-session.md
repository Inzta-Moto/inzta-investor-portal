---
id: ADR-0004
title: Login mode demo dengan cookie bertanda tangan selama data mock
type: adr
status: approved
tier: full
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# ADR-0004: Login mode demo selama data mock

Disetujui agen atas delegasi Sehan 2026-10-21 (perlu dicek ulang).

## Context

Firebase Auth ditahan bersama integrasi Firebase (A-014), tetapi portal yang dipratinjau klien tetap perlu layar masuk dan tidak boleh terbuka bebas bila dipasang di URL pratinjau.

## Options

### Option A — Server action memeriksa kredensial dari variabel server, sesi di cookie httpOnly bertanda tangan HMAC

- Advantages: tanpa dependency baru (`node:crypto`), tidak ada kredensial di bundle klien, mudah diganti Firebase Auth.
- Disadvantages: satu akun tetap, tanpa pencabutan selain mengganti `SESSION_SECRET`.

### Option B — Gerbang di sisi klien (localStorage)

- Disadvantages: dapat dilewati dengan devtools; bukan kontrol akses.

## Decision

We will memakai Option A. `DEMO_INVESTOR_USERNAME`, `DEMO_INVESTOR_PASSWORD`, dan `SESSION_SECRET` dibaca di server. Di `next dev` saja, bila variabel kosong, kredensial demo bawaan berlaku agar pratinjau lokal langsung jalan; di build produksi variabel wajib diisi, kalau tidak login menolak semua percobaan.

## Consequences

- Positive: layar terlindungi saat dipratinjau di hosting.
- Negative or cost: bukan autentikasi investor yang sebenarnya; diganti Firebase Auth di F-006.

## Revisit when

- F-006 dimulai.
