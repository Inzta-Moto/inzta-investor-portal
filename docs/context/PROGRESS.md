<!-- GENERATED FILE — DO NOT EDIT. Rendered by `npm run context:render`.
Source: sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.
source_hash: 134ff46fe114fa60a4b638c73ff7003ca80f4732ce3f9c9d868414c7318959fc -->

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
| T-006 Pagination jadwal komisi dan kartu angka dua kolom | done | FR-004 | T-004 | EV-004 |

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

## F-006 — Integrasi Firestore lewat server (`verification`, blocked)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-001 Admin SDK, konfigurasi, dan emulator | done | FR-001 |  | EV-001, EV-002 |
| T-002 Adaptor Firestore dengan proyeksi kolom | done | FR-001, FR-002 | T-001 | EV-002, EV-004 |
| T-003 Cache dan pembaruan otomatis | done | FR-003 | T-002 | EV-002, EV-003 |
| T-004 Login milik portal | done | FR-004 |  | EV-001, EV-003 |
| T-005 Hapus mock dan akun demo | done | FR-005 | T-002, T-004 | EV-001, EV-004 |
| T-006 Sambungkan ke produksi | blocked | FR-001, FR-002, FR-004 | T-001, T-002, T-003, T-004, T-005 |  |
