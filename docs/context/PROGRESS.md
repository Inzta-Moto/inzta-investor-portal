<!-- GENERATED FILE — DO NOT EDIT. Rendered by `npm run context:render`.
Source: sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.
source_hash: 93e65f14ddfd037f9430342b5e02727c5fe727b19f28ee606f596d0a7926d365 -->

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
| T-007 Tanpa garis dekoratif, skala teks HP, audit semua layar | done | FR-001, FR-006 | T-006 | EV-005 |

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
| T-007 Jalan tanpa dokumen perjanjian | done | FR-002 | T-002 | EV-005, EV-006 |

## F-007 — Filter bulan dan tahun di Penjualan (`implemented`, complete)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-001 Logika filter dan data bulan apa pun | done | FR-001, FR-002, FR-003 |  | EV-001 |
| T-002 Kontrol filter dan sorotan grafik | done | FR-001, FR-002 | T-001 | EV-002 |

## F-008 — Pilihan tema dan konten desktop lebar penuh (`implemented`, complete)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-001 Pilihan tema | done | FR-001 |  | EV-001 |
| T-002 Konten desktop lebar penuh | done | FR-002 |  | EV-002 |

## F-009 — Penggunaan dana investasi (`verification`, complete)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-001 Data penggunaan dana di portal | done | FR-002, FR-003 |  | EV-001 |
| T-002 Halaman Penggunaan Dana di portal | done | FR-002 | T-001 | EV-002 |
| T-003 Penanda di ERP | done | FR-001 |  | EV-003 |

## F-010 — Form isi perjanjian di ERP (`draft`, blocked)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-001 Modal isi perjanjian di ERP | blocked | FR-001 |  |  |

## F-011 — Banyak investor (`draft`, blocked)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-001 ADR login dan data per investor | blocked | FR-001, FR-002 |  |  |
| T-002 Akun dan data per investor di portal | blocked | FR-001, FR-002 | T-001 |  |
| T-003 Daftar dan detail investor di ERP | blocked | FR-003 | T-001 |  |
| T-004 Migrasi data satu investor | blocked | FR-002 | T-002, T-003 |  |
