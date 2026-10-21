---
id: IDEA-BRIEF
title: "Inzta Investor Portal"
type: idea-brief
status: draft
tier: lite
owner: "VXerys"
created: "2026-10-21"
last_updated: "2026-10-21"
last_verified: "2026-10-21"
supersedes: null
---

# Idea Brief: Inzta Investor Portal

The problem before the product. Written once, before the PRD; the PRD supersedes it for scope.

## Problem statement

Investor PT Inzta Gear Indonesia ingin memantau penjualan bulanan serta Komisi dan pengembalian dana, tetapi belum ada saluran yang memberi angka langsung dari catatan Inzta tanpa membuka dasbor internal. Dasbor ini akses tambahan, bukan kewajiban kontrak.

## Affected users

- Primary user: Investor, minimal sebulan sekali selama 24 bulan.
- Context: memantau penjualan dan memastikan Komisi tanggal 25 sampai 26 serta pengembalian bulan ke-16, 20, 24.
- Current workaround: laporan di luar portal sesuai perjanjian.

## Evidence

- 2026-10-20, VN Raja Purnama: dasbor terpisah untuk investor, penjualan dan margin per bulan, dana yang sudah kembali, hanya lihat tanpa PDF, satu akun username dan password, database dari dasbor Inzta.
- 2026-10-21, draf Perjanjian Kerja Sama Investasi: nilai dana Rp200.000.000, Komisi 3,2%, jadwal pengembalian bulan ke-16, 20, 24.
- 2026-10-21, revisi Sehan: Komisi flat Rp6.400.000 sejak bulan 1 (total Rp153.600.000); nominal pengembalian bebas per kesepakatan dan diinput admin; perjanjian tidak lagi menyebut dasbor.
- 2026-10-21, Sehan: satu database untuk dua web agar realtime (ADR-0001).

## Desired outcome

Laporan bulanan berpindah dari dokumen manual ke portal yang selalu terkini.

## Constraints

- Waktu: Inzta meminta secepatnya setelah perjanjian ditandatangani.
- Teknologi: Firestore milik dasbor internal; tidak boleh mengganggu dasbor internal.
- Kerahasiaan: investor wajib menjaga kerahasiaan informasi usaha sesuai perjanjian.

## Assumptions to validate

Dicatat sebagai A-001 sampai A-012 di `docs/context/ASSUMPTIONS.md`.

## Risks

| ID | Risk | Impact | Mitigation |
|---|---|---|---|
| RISK-001 | rules longgar membuka data mentah ke investor | high | ADR-0002, uji emulator |
| RISK-002 | akun investor bisa login ke dasbor internal | high | A-004, gerbang role di dasbor internal |

## Open questions

Lihat `docs/context/ASSUMPTIONS.md`.

## Go or no-go

Go untuk fondasi (F-001), 2026-10-21, VXerys. Fitur data menunggu jawaban pertanyaan terbuka.
