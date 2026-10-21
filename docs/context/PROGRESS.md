<!-- GENERATED FILE — DO NOT EDIT. Rendered by `npm run context:render`.
Source: sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.
source_hash: 53365353f9f3bff0643f497f536d2696b9959bf24e1c1df0b1ecfaf4204566eb -->

# Project Progress

## F-001 — Fondasi proyek (`implemented`, complete)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-001 Kerangka Next.js, Tailwind, ESLint, halaman placeholder | done | FR-001, FR-004 |  | EV-001, EV-003 |
| T-002 Konfigurasi Firebase lazy dan format Rupiah | done | FR-002, FR-003 | T-001 | EV-002, EV-005 |
| T-003 Verifikasi fondasi dan konteks SDD | done | FR-001, FR-002, FR-003, FR-004 | T-001, T-002 | EV-001, EV-002, EV-003, EV-005 |

## F-002 — Domain investasi dan data mock (`implemented`, complete)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-001 Kalender perjanjian dan jadwal komisi | done | FR-001, FR-003 |  | EV-001 |
| T-002 Jadwal pengembalian | done | FR-002 | T-001 | EV-001, EV-003 |
| T-003 Penjualan bulanan dan format ringkas | done | FR-004, FR-006 |  | EV-001 |
| T-004 Kontrak sumber data, adaptor mock, portfolio | done | FR-005, FR-001, FR-002, FR-004 | T-001, T-002, T-003 | EV-001, EV-002 |
| T-005 Verifikasi | done | FR-001, FR-002, FR-003, FR-004, FR-005, FR-006 | T-004 | EV-001, EV-002, EV-003 |

## F-003 — Tampilan portal investor (`implemented`, complete)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-001 Token desain, font, logo, kerangka aplikasi | done | FR-001, FR-006 |  | EV-001, EV-002 |
| T-002 Halaman Ringkasan | done | FR-002 | T-001 | EV-002 |
| T-003 Halaman Penjualan dan grafik | done | FR-003 | T-001 | EV-003 |
| T-004 Halaman Komisi dan Pengembalian, kartu sudah masuk | done | FR-004, FR-005, FR-007 | T-001 | EV-002, EV-003 |
| T-005 Kondisi memuat dan gagal, verifikasi responsif | done | FR-006, FR-001 | T-002, T-003, T-004 | EV-003 |

## F-004 — Login mode demo (`implemented`, complete)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-001 Token sesi dan konfigurasi demo | done | FR-002, FR-005 |  | EV-001 |
| T-002 Layar masuk, gerbang, keluar | done | FR-001, FR-003, FR-004 | T-001 | EV-002, EV-003 |

## F-005 — Rilis produksi capital.inzta.id (`draft`, blocked)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-001 Pilih hosting dan siapkan project | blocked | FR-001, FR-002 |  |  |
| T-002 Domain dan verifikasi header | blocked | FR-001 | T-001 |  |

## F-006 — Integrasi Firebase (ditahan) (`draft`, blocked)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-001 Ekspor rules aktif dan siapkan emulator | blocked | FR-003 |  |  |
| T-002 Adaptor Firestore untuk InvestorDataSource | blocked | FR-001 | T-001 |  |
| T-003 Cloud Function ringkasan penjualan dan backfill | blocked | FR-002 | T-001 |  |
| T-004 Firebase Auth dan role investor | blocked | FR-004, FR-003 | T-001 |  |
| T-005 Gerbang role di dasbor internal | blocked | FR-005 |  |  |
