<!-- GENERATED FILE — DO NOT EDIT. Rendered by `npm run context:render`.
Source: sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.
source_hash: a5f45ba334e93aca1eb4ff409b7edbd35449926fd7a21ae2ff0730b83f3e1824 -->

# Brief

Inzta Investor Portal adalah portal daring hanya-baca untuk investor PT Inzta Gear Indonesia yang menampilkan laporan penjualan bulanan, rekap komisi, dan progres pengembalian dana investasi selama 24 bulan masa perjanjian.

Project `Inzta Investor Portal`, tier `full`. Rendered from sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.

## Active
Feature F-001 — Fondasi proyek (`implementing`, docs/specs/F-001-fondasi-proyek/)
Task T-001 — Kerangka Next.js, Tailwind, ESLint, halaman placeholder (`in_progress`); requirements: FR-001, FR-004; depends on: none

Scope: `package.json`, `tsconfig.json`, `eslint.config.mjs`, `next.config.ts`, `.gitignore`, `src/app/`. Acceptance criteria: AC-001, AC-002, AC-006, AC-007.

Acceptance criteria:
- AC-001: Given build produksi, when `npm run build` selesai, then rute `/` dirender statis tanpa variabel Firebase.
- AC-002: Given respons halaman mana pun, when diperiksa, then terdapat meta `robots` `noindex, nofollow` dan header `X-Robots-Tag: noindex, nofollow`.
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
Handoff is `inactive`.

## Other open tasks
- T-002 — Konfigurasi Firebase lazy dan format Rupiah (`planned`)
- T-003 — Verifikasi fondasi dan konteks SDD (`planned`)

## Features
| Feature | Status | Phase | Done/Total |
|---|---|---|---|
| F-001 Fondasi proyek | implementing | in_progress | 0/3 |
