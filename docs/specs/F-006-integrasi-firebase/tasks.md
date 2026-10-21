---
id: F-006
title: "Integrasi Firebase (ditahan)"
type: tasks
status: draft
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
requirements: [FR-001, FR-002, FR-003, FR-004, FR-005]
supersedes: null
---

# Tasks: Integrasi Firebase (ditahan)

This file is the master for task status. Seluruh tugas ditahan atas permintaan klien (A-014) sampai Sehan membukanya.

## Tasks

### T-001 — Ekspor rules aktif dan siapkan emulator
- status: blocked
- requirements: [FR-003]
- depends_on: []
- evidence: []

Menunggu A-003. Tanpa akses ke project produksi oleh agen.

### T-002 — Adaptor Firestore untuk InvestorDataSource
- status: blocked
- requirements: [FR-001]
- depends_on: [T-001]
- evidence: []

`src/lib/data/firestore.ts` dengan listener realtime; `getDataSource("firestore")`.

### T-003 — Cloud Function ringkasan penjualan dan backfill
- status: blocked
- requirements: [FR-002]
- depends_on: [T-001]
- evidence: []

Butuh paket Blaze dan persetujuan deploy.

### T-004 — Firebase Auth dan role investor
- status: blocked
- requirements: [FR-004, FR-003]
- depends_on: [T-001]
- evidence: []

### T-005 — Gerbang role di dasbor internal
- status: blocked
- requirements: [FR-005]
- depends_on: []
- evidence: []

Menunggu A-004; perubahan di repo lain.

## Deferred

None.
