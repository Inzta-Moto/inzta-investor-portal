---
id: F-003
title: "Tampilan portal investor"
type: tasks
status: implementing
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
- status: planned
- requirements: [FR-001, FR-006]
- depends_on: []
- evidence: []

`globals.css`, `layout.tsx`, `public/brand/`, `app-shell.tsx`, `nav-links.tsx`. AC-001 sampai AC-003, AC-011.

### T-002 — Halaman Ringkasan
- status: planned
- requirements: [FR-002]
- depends_on: [T-001]
- evidence: []

AC-004, AC-005.

### T-003 — Halaman Penjualan dan grafik
- status: planned
- requirements: [FR-003]
- depends_on: [T-001]
- evidence: []

AC-006, AC-007.

### T-004 — Halaman Komisi dan Pengembalian, kartu sudah masuk
- status: planned
- requirements: [FR-004, FR-005, FR-007]
- depends_on: [T-001]
- evidence: []

AC-008 sampai AC-010, AC-013, AC-014.

### T-005 — Kondisi memuat dan gagal, verifikasi responsif
- status: planned
- requirements: [FR-006, FR-001]
- depends_on: [T-002, T-003, T-004]
- evidence: []

AC-012 dan pemeriksaan 360 px, 1366 px, tema gelap.

## Deferred

None.
