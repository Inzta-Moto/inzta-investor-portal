<!-- GENERATED FILE — DO NOT EDIT. Rendered by `npm run context:render`.
Source: sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.
source_hash: 82715917d28eeb26f20df5ea26d506dc75c23d9a5ea2bc2e5748c8244107d436 -->

# Brief

Inzta Investor Portal adalah portal daring hanya-baca untuk investor PT Inzta Gear Indonesia yang menampilkan laporan penjualan bulanan, rekap komisi, dan progres pengembalian dana investasi selama 24 bulan masa perjanjian.

Project `Inzta Investor Portal`, tier `full`. Rendered from sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.

## Active
Feature F-001 — Fondasi proyek (`verification`, docs/specs/F-001-fondasi-proyek/)
Task T-003 — Verifikasi fondasi dan konteks SDD (`review`); requirements: FR-001, FR-002, FR-003, FR-004; depends on: T-001, T-002

Jalankan semua perintah di `docs/steering/tech.md`, catat evidence, perbarui handoff.

Acceptance criteria:
- AC-001: Given build produksi, when `npm run build` selesai, then rute `/` dirender statis tanpa variabel Firebase.
- AC-002: Given respons halaman mana pun, when diperiksa, then terdapat meta `robots` `noindex, nofollow` dan header `X-Robots-Tag: noindex, nofollow`.
- AC-003: Given semua variabel terisi, when konfigurasi dibaca, then hasilnya berisi `apiKey`, `authDomain`, `projectId`, `appId`.
- AC-004: Given variabel kosong atau spasi, when konfigurasi dibaca, then hasilnya gagal dan mencantumkan setiap nama variabel yang kosong.
- AC-005: Given 4800000, when diformat, then hasilnya `Rp 4.800.000`; given 1.5, then RangeError.
- AC-006: Given respons halaman, when diperiksa, then header `X-Frame-Options: DENY` ada.
- AC-007: Given media cetak, when stylesheet diterapkan, then `body` bernilai `display: none`.

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
None.

## Handoff
Next step:

Kirim pertanyaan A-002 sampai A-012 ke Raja; setelah dijawab, putuskan ADR-0002 dan tulis spec F-002 (akun investor) dari `docs/specs/_templates/`. Verifikasi: `npm run context:validate`.

## Other open tasks
- T-001 — Kerangka Next.js, Tailwind, ESLint, halaman placeholder (`review`)
- T-002 — Konfigurasi Firebase lazy dan format Rupiah (`review`)

## Features
| Feature | Status | Phase | Done/Total |
|---|---|---|---|
| F-001 Fondasi proyek | verification | in_progress | 0/3 |
