---
id: F-002
title: "Domain investasi dan data mock"
type: tasks
status: implemented
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
requirements: [FR-001, FR-002, FR-003, FR-004, FR-005, FR-006]
supersedes: null
---

# Tasks: Domain investasi dan data mock

This file is the master for task status.

## Tasks

### T-001 — Kalender perjanjian dan jadwal komisi
- status: done
- requirements: [FR-001, FR-003]
- depends_on: []
- evidence: [EV-001]

`calendar.ts`, `commission.ts` dan test. AC-001 sampai AC-004, AC-009.

### T-002 — Jadwal pengembalian
- status: done
- requirements: [FR-002]
- depends_on: [T-001]
- evidence: [EV-001, EV-003]

`repayment.ts` dan test. AC-005 sampai AC-008.

### T-003 — Penjualan bulanan dan format ringkas
- status: done
- requirements: [FR-004, FR-006]
- depends_on: []
- evidence: [EV-001]

`sales.ts`, `formatRupiahCompact`, test. AC-010, AC-011, AC-014.

### T-004 — Kontrak sumber data, adaptor mock, portfolio
- status: done
- requirements: [FR-005, FR-001, FR-002, FR-004]
- depends_on: [T-001, T-002, T-003]
- evidence: [EV-001, EV-002]

`source.ts`, `mock.ts`, `portfolio.ts`, test. AC-012, AC-013.

### T-005 — Verifikasi
- status: done
- requirements: [FR-001, FR-002, FR-003, FR-004, FR-005, FR-006]
- depends_on: [T-004]
- evidence: [EV-001, EV-002, EV-003]

Semua perintah di `docs/steering/tech.md`.

## Deferred

None.
