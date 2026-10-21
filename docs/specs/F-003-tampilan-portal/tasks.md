---
id: F-003
title: "Tampilan portal investor"
type: tasks
status: implemented
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
requirements: [FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007]
supersedes: null
---

# Tasks: Tampilan portal investor

This file is the master for task status.

## Tasks

### T-001 — Token desain, font, logo, kerangka aplikasi
- status: done
- requirements: [FR-001, FR-006]
- depends_on: []
- evidence: [EV-001, EV-002]

`globals.css`, `layout.tsx`, `public/brand/`, `app-shell.tsx`, `nav-links.tsx`. AC-001 sampai AC-003, AC-011.

### T-002 — Halaman Ringkasan
- status: done
- requirements: [FR-002]
- depends_on: [T-001]
- evidence: [EV-002]

AC-004, AC-005.

### T-003 — Halaman Penjualan dan grafik
- status: done
- requirements: [FR-003]
- depends_on: [T-001]
- evidence: [EV-003]

AC-006, AC-007.

### T-004 — Halaman Komisi dan Pengembalian, kartu sudah masuk
- status: done
- requirements: [FR-004, FR-005, FR-007]
- depends_on: [T-001]
- evidence: [EV-002, EV-003]

AC-008 sampai AC-010, AC-013, AC-014.

### T-005 — Kondisi memuat dan gagal, verifikasi responsif
- status: done
- requirements: [FR-006, FR-001]
- depends_on: [T-002, T-003, T-004]
- evidence: [EV-003]

AC-012 dan pemeriksaan 360 px, 1366 px, tema gelap.

### T-006 — Pagination jadwal komisi dan kartu angka dua kolom
- status: done
- requirements: [FR-004]
- depends_on: [T-004]
- evidence: [EV-004]

Permintaan Sehan 2026-10-21: jadwal 24 bulan dipecah 6 baris per halaman di HP dan 12 di desktop, dibuka di halaman bulan berjalan; kartu "Komisi per bulan" dan "Total 24 bulan" berdampingan di HP; tarif komisi dibaca dari perjanjian, bukan teks tetap.

### T-007 — Tanpa garis dekoratif, skala teks HP, audit semua layar
- status: done
- requirements: [FR-001, FR-006]
- depends_on: [T-006]
- evidence: [EV-005]

Permintaan Sehan 2026-10-21: semua garis warna dekoratif diganti, teks HP lebih kecil, kartu Penjualan berpasangan dan sejajar, tanpa bug UI di HP maupun desktop.

## Deferred

None.
