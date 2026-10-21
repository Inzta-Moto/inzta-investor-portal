<!-- GENERATED FILE — DO NOT EDIT. Rendered by `npm run context:render`.
Source: sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.
source_hash: 00e279ad7af3295adfde60267b2906ce94b130f9297e1c336ae24d1126c573a5 -->

# Brief

Inzta Investor Portal adalah portal daring hanya-baca untuk investor PT Inzta Gear Indonesia yang menampilkan laporan penjualan bulanan, rekap komisi, dan progres pengembalian dana investasi selama 24 bulan masa perjanjian.

Project `Inzta Investor Portal`, tier `full`. Rendered from sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.

## Active
Feature F-006 — Integrasi Firestore lewat server (`verification`, docs/specs/F-006-integrasi-firebase/)
Task T-006 — Sambungkan ke produksi (`blocked`); requirements: FR-001, FR-002, FR-004; depends on: T-001, T-002, T-003, T-004, T-005

Menunggu A-016: Sehan menjalankan `npm run env:setup` dengan kunci service account; admin membuat `investor_agreement/current` dan `investor_payments`; hosting A-011.

Acceptance criteria:
- AC-001: Given dokumen `sales` berisi pelanggan, kota, reseller, harga modal, when portal membaca, then hanya empat kolom itu yang diterima server dan HTML maupun payload RSC tidak memuat kolom lain.
- AC-002: Given dokumen lama tanpa `revenue`, then dihitung `sellingPrice * quantity`.
- AC-003: Given `investor_agreement/current` dan `investor_payments`, then Ringkasan, Komisi, dan Pengembalian memakai nilainya; dokumen pembayaran yang rusak menjadi peringatan, perjanjian yang hilang atau rusak menjadi pesan yang bisa dibaca.
- AC-007: Given `INVESTOR_USERNAME` dan `INVESTOR_PASSWORD_HASH` (scrypt), then hanya pasangan yang cocok yang masuk; hash rusak ditolak sebagai kesalahan konfigurasi; investor tidak punya akun Firebase.
- AC-008: Given kata sandi diganti di env, then cookie lama tidak berlaku.
- AC-009: Given banyak percobaan gagal, then dibatasi 5 per klien dan 50 total per 15 menit.

## Rules
Stop conditions:

Stop and report, instead of implementing, when the task would require any prohibited action above, when two sources of truth conflict, when a blocking assumption is open, or when a required command is unavailable.

Prohibited without explicit owner approval:

- Changing a public API, event, or data contract.
- Destructive data operations: drop, mass delete, reset, backfill with unknown impact, editing an applied migration.
- Replacing a major framework, provider, or dependency; adding a dependency outside the policy in `tech.md`.
- Breaking an architecture boundary or dependency direction.
- Changing production infrastructure, credentials, or configuration.
- Bypassing authentication or authorization.
- Force push, history rewrite, or any git operation that can destroy work.
- Editing a generated or frozen path.
- Publishing, deploying, or sending messages on the owner's behalf.

## Read-only paths
Generated: `docs/context/state.yaml`, `docs/context/PROJECT_STATE.md`, `docs/context/PROGRESS.md`, `docs/context/BRIEF.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/`, `.github/copilot-instructions.md`, `.github/instructions/`, `.kiro/steering/`
Frozen: none

## Open assumptions
- A-016 — Penyambungan ke Firestore produksi (F-006)

## Handoff
Next step:

Sehan membuat kunci service account di Firebase Console (Project settings, Service accounts), mengisi env sesuai README, dan meminta admin membuat dokumen perjanjian; lalu F-006 T-006: jalankan portal terhadap produksi dan bandingkan total bulanan dengan dasbor internal. Verifikasi: `npm run context:validate`.

## Other open tasks
None.

## Features
| Feature | Status | Phase | Done/Total |
|---|---|---|---|
| F-001 Fondasi proyek | implemented | complete | 3/3 |
| F-002 Domain investasi dan data mock | implemented | complete | 5/5 |
| F-003 Tampilan portal investor | implemented | complete | 6/6 |
| F-004 Login mode demo | implemented | complete | 2/2 |
| F-005 Rilis produksi capital.inzta.id | draft | blocked | 0/2 |
| F-006 Integrasi Firestore lewat server | verification | blocked | 5/6 |
