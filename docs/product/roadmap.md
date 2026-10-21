---
id: PRODUCT-ROADMAP
title: Product Roadmap
status: draft
owner: "VXerys"
last_updated: "2026-10-21"
---

# Product Roadmap

Strategic capability order, release intent, and dependency rationale. Not the execution board: task status belongs in each feature's `tasks.md`, and the context views are rendered from it.

## Releases and milestones

### M1 — Investor melihat penjualan bulanan

- Outcome: investor login dan melihat hasil penjualan per bulan, realtime, tanpa akses ke data mentah.
- Capabilities: F-001 fondasi proyek; F-002 akun investor dan gerbang role; F-003 laporan penjualan bulanan.
- Dependencies: A-002 sampai A-007 terjawab; ADR-0002 diputuskan.
- Excluded: komisi, pengembalian, deploy produksi.
- Exit criteria: uji rules investor (allow dan deny) hijau di emulator; angka bulanan sama dengan dasbor internal untuk data contoh.

### M2 — Komisi, pengembalian, dan rilis

- Outcome: investor melihat rekap Komisi 24 bulan dan progres pengembalian; portal hidup di `capital.inzta.id`.
- Capabilities: F-004 komisi dan pengembalian dana; F-005 rilis produksi.
- Dependencies: A-008, A-009, A-011.
- Excluded: ekspor, notifikasi, akun investor kedua.
- Exit criteria: jadwal sesuai Pasal 4 dan 5 teruji; deploy disetujui pemilik.

## Capability ordering

| Capability | Why now | Depends on | Intended milestone |
|---|---|---|---|
| F-001 fondasi proyek | prasyarat semua fitur | none | M1 |
| F-002 akun investor | Pasal 7 ayat 3: akun khusus | F-001, A-003, A-004, A-005 | M1 |
| F-003 laporan penjualan | inti kewajiban Pasal 7 | F-002, A-002, A-006, A-007 | M1 |
| F-004 komisi dan pengembalian | rekap Pasal 4 dan 5; Komisi pertama jatuh tempo sebulan setelah Tanggal Efektif | F-002, A-008, A-009 | M2 |
| F-005 rilis produksi | investor butuh URL tetap | F-003, F-004, A-011 | M2 |

## Roadmap changes

Material priority or scope changes with date and rationale. Task progress is never copied here.

| Date | Change | Rationale | Approved by |
|---|---|---|---|
| 2026-10-21 | roadmap awal | VN Raja 2026-10-20 dan draf perjanjian | belum disetujui |
