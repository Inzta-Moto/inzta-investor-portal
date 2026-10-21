<!-- GENERATED FILE — DO NOT EDIT. Rendered by `npm run context:render`.
Source: sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.
source_hash: d86ee4c91ab8cf7913dce478defcba5b8560cbef509664c1cec44dd3b54fe6d4 -->

# Project Progress

## F-001 — Fondasi proyek (`verification`, in_progress)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-001 Kerangka Next.js, Tailwind, ESLint, halaman placeholder | review | FR-001, FR-004 |  | EV-001, EV-003, EV-004 |
| T-002 Konfigurasi Firebase lazy dan format Rupiah | review | FR-002, FR-003 | T-001 | EV-002 |
| T-003 Verifikasi fondasi dan konteks SDD | review | FR-001, FR-002, FR-003, FR-004 | T-001, T-002 | EV-001, EV-002, EV-003, EV-004 |

## F-002 — Domain investasi dan data mock (`implementing`, in_progress)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-001 Kalender perjanjian dan jadwal komisi | in_progress | FR-001, FR-003 |  |  |
| T-002 Jadwal pengembalian | planned | FR-002 | T-001 |  |
| T-003 Penjualan bulanan dan format ringkas | planned | FR-004, FR-006 |  |  |
| T-004 Kontrak sumber data, adaptor mock, portfolio | planned | FR-005, FR-001, FR-002, FR-004 | T-001, T-002, T-003 |  |
| T-005 Verifikasi | planned | FR-001, FR-002, FR-003, FR-004, FR-005, FR-006 | T-004 |  |

## F-003 — Tampilan portal investor (`implementing`, not_started)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-001 Token desain, font, logo, kerangka aplikasi | planned | FR-001, FR-006 |  |  |
| T-002 Halaman Ringkasan | planned | FR-002 | T-001 |  |
| T-003 Halaman Penjualan dan grafik | planned | FR-003 | T-001 |  |
| T-004 Halaman Komisi dan Pengembalian, kartu sudah masuk | planned | FR-004, FR-005, FR-007 | T-001 |  |
| T-005 Kondisi memuat dan gagal, verifikasi responsif | planned | FR-006, FR-001 | T-002, T-003, T-004 |  |

## F-004 — Login mode demo (`implementing`, not_started)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-001 Token sesi dan konfigurasi demo | planned | FR-002, FR-005 |  |  |
| T-002 Layar masuk, gerbang, keluar | planned | FR-001, FR-003, FR-004 | T-001 |  |

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
