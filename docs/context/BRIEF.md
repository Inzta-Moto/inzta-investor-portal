<!-- GENERATED FILE — DO NOT EDIT. Rendered by `npm run context:render`.
Source: sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.
source_hash: 3845e89ad13f3da5c2ab6174f9164b0298aec9f453054179013b0001a431ecf2 -->

# Brief

Inzta Investor Portal adalah portal daring hanya-baca untuk investor PT Inzta Gear Indonesia yang menampilkan laporan penjualan bulanan, rekap komisi, dan progres pengembalian dana investasi selama 24 bulan masa perjanjian.

Project `Inzta Investor Portal`, tier `full`. Rendered from sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.

## Active
Feature F-009 — Penggunaan dana investasi (`verification`, docs/specs/F-009-penggunaan-dana/)
Task T-004 — Menu Belanja Investasi terpisah (revisi klien 2026-10-23) (`done`); requirements: FR-001, FR-002, FR-003; depends on: none

Acceptance criteria:
- AC-001: Given owner atau admin, then sidebar ERP punya menu "Belanja Investasi" untuk menambah, mengubah, dan menghapus belanja di koleksi `investor_purchases`; role lain tidak melihat menu itu dan dialihkan bila membuka halamannya (Q9, revisi 2026-10-23).
- AC-002: Given menu Belanja Investasi, then admin memilih periode Hari, Minggu, Bulan, atau Semua dengan tanggal acuan, mencari barang, dan melihat total serta jumlah transaksi periode itu; total hanya ada di ERP (revisi 2026-10-23).
- AC-003: Given belanja bertanggal sebelum Tanggal Efektif, then ERP tetap menyimpan dan menampilkan peringatan (Q5).
- AC-004: Given Belanja Produksi dan halaman Investor, then keduanya tidak punya centang, label, kartu, atau peringatan dana investasi, dan Belanja Investasi tidak muncul di Belanja Produksi (revisi 2026-10-23).
- AC-005: Given Belanja Investasi, then halaman "Penggunaan Dana Investasi" menampilkan satu angka: total seluruh belanja, dengan jumlah belanja dan rentang bulannya, di samping Dana Investasi dari perjanjian (revisi klien 2026-10-24: "jangan pake rincian, global aja, total dana terpakai berapa").
- AC-006: Given halaman itu, then tidak ada rincian per barang, sisa dana, harga satuan, catatan, atau status minggu. Rincian per barang tetap dicatat di ERP.
- AC-007: Given belanja ditambah, diedit, atau dihapus di menu Belanja Investasi, then portal menampilkan keadaan terbaru setelah cache 25 detik (Q4, Q10).
- AC-008: Given tidak ada Belanja Investasi, then total Rp0 dengan keterangan "Belum ada belanja yang dibayar dari dana investasi."
- AC-009: Given dokumen Belanja Investasi dengan harga satuan, catatan, dan field lain, then server portal hanya menerima enam kolom ADR-0008, dan tidak pernah membaca `production_purchases`.
- AC-010: Given dokumen Belanja Investasi yang rusak, then dokumen itu dilewati dan investor melihat kalimat biasa.

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

Setelah merge dan deploy ERP serta portal, owner mencatat satu belanja di menu Belanja Investasi lalu membuka `capital.inzta.id/penggunaan-dana`; catat hasilnya sebagai bukti produksi F-009. Belanja lama yang pernah ditandai dicatat ulang di menu baru bila perlu.

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
| F-009 Penggunaan dana investasi | verification | complete | 4/4 |
| F-010 Form isi perjanjian di ERP | draft | blocked | 0/1 |
| F-011 Banyak investor | draft | blocked | 0/4 |
