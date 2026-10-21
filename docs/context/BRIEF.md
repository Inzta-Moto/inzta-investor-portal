<!-- GENERATED FILE — DO NOT EDIT. Rendered by `npm run context:render`.
Source: sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.
source_hash: 96f01898d0d1d7cda7a1f603fba85badb600a12ce4ad4961a3760d5ce78437e8 -->

# Brief

Inzta Investor Portal adalah portal daring hanya-baca untuk investor PT Inzta Gear Indonesia yang menampilkan laporan penjualan bulanan, rekap komisi, dan progres pengembalian dana investasi selama 24 bulan masa perjanjian.

Project `Inzta Investor Portal`, tier `full`. Rendered from sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.

## Active
Feature F-006 — Integrasi Firestore lewat server (`verification`, docs/specs/F-006-integrasi-firebase/)
Task T-001 — Admin SDK, konfigurasi, dan emulator (`done`); requirements: FR-001; depends on: none

`firebase-admin` menggantikan `firebase` (disetujui Sehan lewat pilihan "jalan tengah"); `firebase.json` hanya emulator; Java 21 di `D:	ools\jre21` untuk mesin lokal.

Acceptance criteria:
- AC-001: Given dokumen `sales` berisi pelanggan, kota, reseller, harga modal, when portal membaca, then hanya empat kolom itu yang diterima server dan HTML maupun payload RSC tidak memuat kolom lain.
- AC-002: Given dokumen lama tanpa `revenue`, then dihitung `sellingPrice * quantity`.

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

Sehan meninjau keputusan [delegasi] di `docs/context/ASSUMPTIONS.md`, lalu menanyakan A-003, A-004, A-011 ke Raja. Saat klien membuka integrasi, mulai F-006 T-001. Verifikasi: `npm run context:validate`.

## Other open tasks
- T-006 — Sambungkan ke produksi (`blocked`)

## Features
| Feature | Status | Phase | Done/Total |
|---|---|---|---|
| F-001 Fondasi proyek | implemented | complete | 3/3 |
| F-002 Domain investasi dan data mock | implemented | complete | 5/5 |
| F-003 Tampilan portal investor | implemented | complete | 6/6 |
| F-004 Login mode demo | implemented | complete | 2/2 |
| F-005 Rilis produksi capital.inzta.id | draft | blocked | 0/2 |
| F-006 Integrasi Firestore lewat server | verification | blocked | 5/6 |
