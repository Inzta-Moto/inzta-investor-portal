<!-- GENERATED FILE — DO NOT EDIT. Rendered by `npm run context:render`.
Source: sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.
source_hash: c9017110ace6120b0eb98917d7cb82d5517a2eff3d477dbb4ee782681cd11074 -->

# Brief

Inzta Investor Portal adalah portal daring hanya-baca untuk investor PT Inzta Gear Indonesia yang menampilkan laporan penjualan bulanan, rekap komisi, dan progres pengembalian dana investasi selama 24 bulan masa perjanjian.

Project `Inzta Investor Portal`, tier `full`. Rendered from sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.

## Active
Feature F-006 — Integrasi Firestore lewat server (`verification`, docs/specs/F-006-integrasi-firebase/)
Task T-006 — Sambungkan ke produksi (`blocked`); requirements: FR-001, FR-002, FR-004; depends on: T-001, T-002, T-003, T-004, T-005

Sudah: `.env.local` lewat `npm run env:setup` dengan kunci `database-inzta` (A-017). Menunggu A-016: admin membuat `investor_agreement/current` dan `investor_payments`; hosting A-011.

Acceptance criteria:
- AC-001: Given dokumen `sales` berisi pelanggan, kota, reseller, harga modal, when portal membaca, then hanya empat kolom itu yang diterima server dan HTML maupun payload RSC tidak memuat kolom lain.
- AC-002: Given dokumen lama tanpa `revenue`, then dihitung `sellingPrice * quantity`.
- AC-003: Given `investor_agreement/current` dan `investor_payments`, then Ringkasan, Komisi, dan Pengembalian memakai nilainya. Tanpa dokumen perjanjian, portal memakai ketentuan draf (Pasal 2 sampai 5) dengan status "Perjanjian belum aktif"; field yang rusak memakai nilai kontrak, pembayaran yang rusak dilewati, dan investor melihat kalimat biasa, bukan nama field (keputusan Sehan 2026-10-21: "jangan di hold belum ada perjanjian").
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
- A-016 — Data perjanjian dan rilis di produksi (F-006)

## Handoff
Next step:

Total bulanan sudah cocok dengan dasbor ERP (Sehan, EV-007). Setelah Tahap I diterima, admin mengisi Tanggal Efektif dan persentase pengembalian di `investor_agreement/current`. Angkasa menyiapkan hosting dengan env yang sama. Verifikasi: `npm run context:validate`.

## Other open tasks
None.

## Features
| Feature | Status | Phase | Done/Total |
|---|---|---|---|
| F-001 Fondasi proyek | implemented | complete | 3/3 |
| F-002 Domain investasi dan data mock | implemented | complete | 5/5 |
| F-003 Tampilan portal investor | implemented | complete | 7/7 |
| F-004 Login mode demo | implemented | complete | 2/2 |
| F-005 Rilis produksi capital.inzta.id | draft | blocked | 0/2 |
| F-006 Integrasi Firestore lewat server | verification | blocked | 6/7 |
| F-007 Filter bulan dan tahun di Penjualan | implemented | complete | 2/2 |
| F-008 Pilihan tema dan konten desktop lebar penuh | implemented | complete | 2/2 |
