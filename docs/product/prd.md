---
id: PRD
title: "Inzta Investor Portal"
type: prd
status: draft
tier: full
owner: "VXerys"
created: "2026-10-21"
last_updated: "2026-10-21"
last_verified: "2026-10-21"
supersedes: null
---

# Product Requirements: Inzta Investor Portal

Product intent and scope. Feature-level behavior lives in `docs/specs/F-XXX/requirements.md`; the short version of vision and personas lives in `docs/steering/product.md` and must agree with this file.

Sumber: VN Raja Purnama 2026-10-20, draf Perjanjian Kerja Sama Investasi antara Investor (Pihak Pertama) dan PT Inzta Gear Indonesia (Pihak Kedua), dan revisi aturan dari Sehan 2026-10-21 (komisi flat, nominal pengembalian diinput admin, dasbor bukan kewajiban kontrak). Proyek ini pekerjaan freelance berbayar terpisah.

## Context

PT Inzta Gear Indonesia memproduksi dan menjual tas serta perlengkapan berkendara, dan mencatat penjualan di dasbor internal (Firestore). Investor menempatkan dana Rp200.000.000 dalam dua tahap: Rp150.000.000 (Tahap I, menentukan Tanggal Efektif) dan Rp50.000.000 (Tahap II, akhir 2026 atau awal 2027). Perjanjian berlaku 24 bulan sejak Tanggal Efektif. Perjanjian tidak lagi mewajibkan dasbor (keputusan Sehan 2026-10-21); portal adalah akses tambahan bagi investor di luar kewajiban kontrak. Permintaan Raja tetap: akun khusus, hanya untuk melihat, tidak dapat diunduh.

## Problem

- Current state: investor belum punya akses langsung ke data penjualan; laporan disampaikan di luar portal sesuai perjanjian.
- Pain or opportunity: laporan manual lambat dan rawan beda angka; investor ingin melihat penjualan, komisi, dan pengembalian dana kapan saja.
- Desired outcome: investor membuka satu portal dan melihat angka yang sama dengan catatan Inzta, tanpa bisa membuka dasbor internal atau data mentah.

## Goals and non-goals

- G-001: investor melihat hasil penjualan per bulan selama masa perjanjian.
- G-002: investor melihat rekap Komisi per bulan (terjadwal dan sudah dibayar).
- G-003: investor melihat progres pengembalian Dana Investasi (jadwal bulan ke-16, 20, 24 dan total yang sudah kembali).
- NG-001: unduh, ekspor, cetak, atau PDF laporan.
- NG-002: akses investor ke dasbor internal atau ke data per transaksi.
- NG-003: investor mengubah data apa pun; investor tidak punya hak instruksi (Pasal 8).
- NG-004: lebih dari satu akun investor.

## Actors and use cases

- ACTOR-001: Investor, satu akun, hanya baca.
- ACTOR-002: Admin Inzta, mencatat penjualan di dasbor internal dan mencatat pembayaran Komisi serta pengembalian (lokasi pencatatan: A-008).
- UC-001: Investor login, melihat ringkasan bulan berjalan dan riwayat bulanan.
- UC-002: Investor melihat Komisi bulan ini sudah dibayar atau belum (jatuh tempo tanggal 25 sampai 26).
- UC-003: Investor melihat sisa Dana Investasi yang belum kembali.
- UC-004: Akun investor mencoba membuka dasbor internal dan ditolak.

## Functional requirements

- FR-001: the system shall meminta login akun investor sebelum menampilkan data apa pun.
- FR-002: the system shall menampilkan hasil penjualan per bulan kalender (definisi: A-007), diperbarui realtime.
- FR-003: the system shall tidak menampilkan margin di M1 (A-006 [delegasi]); bisa ditambah lewat fitur baru bila Inzta meminta.
- FR-004: the system shall menampilkan jadwal 24 bulan Komisi dengan nominal, tanggal jatuh tempo, dan status bayar.
- FR-005: the system shall menampilkan tiga jadwal pengembalian seperti tabel Pasal 5 (persentase, jumlah, sudah masuk), status bayar, total kembali, dan sisa.
- FR-007: the system shall menampilkan kartu "Komisi sudah masuk" dan "Pengembalian dana sudah masuk": nominal yang sudah diterima, dari total berapa, dan rincian per pengembalian (permintaan Sehan 2026-10-21).
- FR-006: the system shall tidak menyediakan tombol unduh, ekspor, atau cetak, dan menyembunyikan halaman saat dicetak.
- BR-001: Komisi = 3,2% flat per bulan dari total Dana Investasi Rp200.000.000 = Rp6.400.000 per bulan sejak bulan pertama, selama 24 bulan (total Rp153.600.000), tidak bergantung pada tahap penyerahan dana.
- BR-002: Komisi tidak berkurang meski sebagian dana sudah dikembalikan.
- BR-003: Komisi dibayar tanggal 25 sampai 26 setiap bulan, mulai bulan pertama perjanjian.
- BR-004: bulan 1 sampai 12 hanya Komisi; tiga pengembalian jatuh tempo bulan ke-16, 20, dan 24. Persentase atau nominal tiap pengembalian bebas per kesepakatan (misalnya 25/25/50% atau 50/25/25%), ditulis tangan di perjanjian, lalu diinput admin; tidak ada angka tetap di kode. Jumlah ketiganya 100% dari Rp200.000.000.
- BR-005: nilai yang belum ditetapkan tampil "belum ditetapkan", tidak pernah dihitung atau ditebak (A-009).

## Non-functional requirements <!-- full-tier -->

- NFR-001: security. Akun investor hanya bisa membaca data yang ditampilkan; diverifikasi dengan uji Security Rules (ADR-0002).
- NFR-002: security. Akun investor ditolak dasbor internal (A-004).
- NFR-003: privacy. Tidak ada data pelanggan, reseller, atau harga modal di portal.
- NFR-004: performance. Ringkasan tampil di bawah 3 detik pada koneksi 4G.
- NFR-005: compatibility. Layar 360 px sampai desktop.

## Constraints

- Tidak menulis ke koleksi dasbor internal; tidak ada aksi ke Firestore produksi tanpa persetujuan.
- Domain rencana `capital.inzta.id` (A-011).
- Bahasa antarmuka Indonesia; uang dalam Rupiah bulat.

## Success criteria

| Signal | Target or interpretation | Measurement source |
|---|---|---|
| Investor memakai portal | investor membuka portal minimal sebulan sekali | konfirmasi Inzta |
| Angka portal sama dengan dasbor internal | selisih 0 untuk bulan yang sama | uji agregasi terhadap data contoh |

## Risks and assumptions

- R-001: kebocoran data mentah lewat rules yang longgar; mitigasi ADR-0002 dan uji emulator.
- R-002: tenggat ketat dari Inzta; mitigasi rilis bertahap (M1 penjualan, M2 komisi dan pengembalian).
- Assumptions: A-003, A-004, A-011 open; lainnya confirmed, sebagian [delegasi] (lihat `docs/context/ASSUMPTIONS.md`).

## Milestones

- M1 (data mock): seluruh layar, login demo, domain teruji. Exit: F-001 sampai F-004 implemented.
- M2: rilis produksi dan integrasi Firestore. Exit: F-005 dan F-006 implemented. Mock dan login demo M1 sudah dihapus di F-006.

## Feature map

| Feature | Capability | Outcome | Depends on | Status |
|---|---|---|---|---|
| F-001 | fondasi proyek | Next.js, Firebase client lazy, verifikasi hijau | none | implemented |
| F-002 | domain investasi dan data mock | aturan Pasal 4 dan 5, kontrak data, mock | F-001 | implemented |
| F-003 | tampilan portal | FR-002 sampai FR-007, desktop dan HP | F-002 | implemented |
| F-004 | login mode demo | FR-001, sesi bertanda tangan | F-001 | implemented |
| F-005 | rilis produksi | `capital.inzta.id` | F-003, F-004, A-011 | draft |
| F-006 | integrasi Firestore lewat server | data nyata, proyeksi kolom `sales`, login milik portal, tanpa mock (ADR-0006) | A-016 untuk produksi | verification |

## Approval

Belum disetujui. Decision owner: Raja Purnama untuk PT Inzta Gear Indonesia; Sehan (VXerys) untuk keputusan teknis.
