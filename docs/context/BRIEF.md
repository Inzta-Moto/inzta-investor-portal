<!-- GENERATED FILE — DO NOT EDIT. Rendered by `npm run context:render`.
Source: sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.
source_hash: d86ee4c91ab8cf7913dce478defcba5b8560cbef509664c1cec44dd3b54fe6d4 -->

# Brief

Inzta Investor Portal adalah portal daring hanya-baca untuk investor PT Inzta Gear Indonesia yang menampilkan laporan penjualan bulanan, rekap komisi, dan progres pengembalian dana investasi selama 24 bulan masa perjanjian.

Project `Inzta Investor Portal`, tier `full`. Rendered from sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.

## Active
Feature F-002 — Domain investasi dan data mock (`implementing`, docs/specs/F-002-domain-data-mock/)
Task T-001 — Kalender perjanjian dan jadwal komisi (`in_progress`); requirements: FR-001, FR-003; depends on: none

`calendar.ts`, `commission.ts` dan test. AC-001 sampai AC-004, AC-009.

Acceptance criteria:
- AC-001: Given Dana Investasi Rp200.000.000 dan tarif 320 basis poin, then komisi per bulan Rp6.400.000 dan total Rp153.600.000.
- AC-004: Given Tanggal Efektif kosong, then jadwal tetap 24 baris tanpa tanggal dan semua berstatus Akan datang.
- AC-009: Given Tanggal Efektif 2026-11-10 dan hari ini 2027-01-14, then bulan berjalan = 2; sebelum Desember 2026 = 0; setelah November 2028 = selesai.

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
- T-002 — Jadwal pengembalian (`planned`)
- T-003 — Penjualan bulanan dan format ringkas (`planned`)
- T-004 — Kontrak sumber data, adaptor mock, portfolio (`planned`)
- T-005 — Verifikasi (`planned`)

## Features
| Feature | Status | Phase | Done/Total |
|---|---|---|---|
| F-001 Fondasi proyek | verification | in_progress | 0/3 |
| F-002 Domain investasi dan data mock | implementing | in_progress | 0/5 |
| F-003 Tampilan portal investor | implementing | not_started | 0/5 |
| F-004 Login mode demo | implementing | not_started | 0/2 |
| F-005 Rilis produksi capital.inzta.id | draft | blocked | 0/2 |
| F-006 Integrasi Firebase (ditahan) | draft | blocked | 0/5 |
