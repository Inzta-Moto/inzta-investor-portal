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

Investor PT Inzta Gear Indonesia berhak menerima laporan hasil penjualan bulanan serta rekap Komisi dan pengembalian dana (Pasal 6 dan 7 draf perjanjian), tetapi belum ada saluran yang memberi angka langsung dari catatan Inzta tanpa membuka dasbor internal.

## Affected users

- Primary user: Investor, minimal sebulan sekali selama 24 bulan.
- Context: memantau penjualan dan memastikan Komisi tanggal 25 sampai 26 serta pengembalian bulan ke-16, 20, 24.
- Current workaround: belum ada; perjanjian menyiapkan laporan dokumen elektronik lewat surel atau aplikasi pesan selama dasbor belum tersedia (Pasal 7 ayat 4).

## Evidence

- 2026-10-20, VN Raja Purnama: dasbor terpisah untuk investor, penjualan dan margin per bulan, dana yang sudah kembali, hanya lihat tanpa PDF, satu akun username dan password, database dari dasbor Inzta.
- 2026-10-21, draf Perjanjian Kerja Sama Investasi Pasal 2 sampai 7: nilai dana, Komisi 3,2%, jadwal pengembalian, kewajiban laporan lewat dasbor.
- 2026-10-21, Sehan: satu database untuk dua web agar realtime (ADR-0001).

## Desired outcome

Laporan bulanan berpindah dari dokumen manual ke portal yang selalu terkini.

## Constraints

- Waktu: Inzta meminta secepatnya setelah perjanjian ditandatangani.
- Teknologi: Firestore milik dasbor internal; tidak boleh mengganggu dasbor internal.
- Kerahasiaan: investor wajib menjaga kerahasiaan (Pasal 6 ayat 2, Pasal 7 ayat 3).

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
