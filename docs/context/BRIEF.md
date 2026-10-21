<!-- GENERATED FILE — DO NOT EDIT. Rendered by `npm run context:render`.
Source: sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.
source_hash: 53365353f9f3bff0643f497f536d2696b9959bf24e1c1df0b1ecfaf4204566eb -->

# Brief

Inzta Investor Portal adalah portal daring hanya-baca untuk investor PT Inzta Gear Indonesia yang menampilkan laporan penjualan bulanan, rekap komisi, dan progres pengembalian dana investasi selama 24 bulan masa perjanjian.

Project `Inzta Investor Portal`, tier `full`. Rendered from sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.

## Active
Feature F-006 — Integrasi Firebase (ditahan) (`draft`, docs/specs/F-006-integrasi-firebase/)
Task T-001 — Ekspor rules aktif dan siapkan emulator (`blocked`); requirements: FR-003; depends on: none

Menunggu A-003. Tanpa akses ke project produksi oleh agen.

Acceptance criteria:
- AC-003: Given akun role `investor`, then baca `investor_*` diizinkan; baca `sales`, `users`, `products` dan semua tulis ditolak, diuji di emulator.

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
- A-003 — Security Rules Firestore yang berlaku sekarang tidak diketahui (F-006)
- A-004 — Akun investor bisa masuk ke dasbor internal (F-006)

## Handoff
Next step:

Sehan meninjau keputusan [delegasi] di `docs/context/ASSUMPTIONS.md`, lalu menanyakan A-003, A-004, A-011 ke Raja. Saat klien membuka integrasi, mulai F-006 T-001. Verifikasi: `npm run context:validate`.

## Other open tasks
- T-002 — Adaptor Firestore untuk InvestorDataSource (`blocked`)
- T-003 — Cloud Function ringkasan penjualan dan backfill (`blocked`)
- T-004 — Firebase Auth dan role investor (`blocked`)
- T-005 — Gerbang role di dasbor internal (`blocked`)

## Features
| Feature | Status | Phase | Done/Total |
|---|---|---|---|
| F-001 Fondasi proyek | implemented | complete | 3/3 |
| F-002 Domain investasi dan data mock | implemented | complete | 5/5 |
| F-003 Tampilan portal investor | implemented | complete | 5/5 |
| F-004 Login mode demo | implemented | complete | 2/2 |
| F-005 Rilis produksi capital.inzta.id | draft | blocked | 0/2 |
| F-006 Integrasi Firebase (ditahan) | draft | blocked | 0/5 |
