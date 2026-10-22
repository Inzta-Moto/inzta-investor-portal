<!-- GENERATED FILE — DO NOT EDIT. Rendered by `npm run context:render`.
Source: sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.
source_hash: d39ad229903881b748ca57d959adb4c7149462ec93bb138e99be89dcb12680a2 -->

# Brief

Inzta Investor Portal adalah portal daring hanya-baca untuk investor PT Inzta Gear Indonesia yang menampilkan laporan penjualan bulanan, rekap komisi, dan progres pengembalian dana investasi selama 24 bulan masa perjanjian.

Project `Inzta Investor Portal`, tier `full`. Rendered from sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.

## Active
Feature F-009 — Penggunaan dana investasi (`verification`, docs/specs/F-009-penggunaan-dana/)
Task T-003 — Penanda di ERP (`done`); requirements: FR-001; depends on: none

Acceptance criteria:
- AC-001: Given owner atau admin, then form Tambah dan Edit Belanja Produksi punya centang "Dibayar dari dana investasi"; role lain tidak melihat centang itu (Q9).
- AC-002: Given halaman Investor ERP, then owner atau admin melihat Belanja Produksi per bulan dan bisa menandai atau membatalkan tanda per barang, termasuk belanja yang sudah closed; hanya tandanya yang berubah (Q9, Q10).
- AC-003: Given belanja bertanggal sebelum Tanggal Efektif, then ERP tetap menandai dan menampilkan peringatan (Q5).
- AC-004: Given belanja bertanda dihapus, then ERP memperingatkan bahwa belanja itu tampil di portal investor (Q10).

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

Setelah deploy portal dan ERP, owner menandai satu belanja di dasbor asli lalu membuka `capital.inzta.id/penggunaan-dana`; catat hasilnya sebagai bukti produksi F-009.

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
| F-009 Penggunaan dana investasi | verification | complete | 3/3 |
| F-010 Form isi perjanjian di ERP | draft | blocked | 0/1 |
| F-011 Banyak investor | draft | blocked | 0/4 |
