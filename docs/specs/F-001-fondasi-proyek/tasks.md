---
id: F-001
title: "Fondasi proyek"
type: tasks
status: verification
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
requirements: [FR-001, FR-002, FR-003, FR-004]
supersedes: null
---

# Tasks: Fondasi proyek

This file is the master for task status. `state.yaml`, `BRIEF.md`, and the progress views are rendered from it and never edited by hand.

## Tasks

### T-001 — Kerangka Next.js, Tailwind, ESLint, halaman placeholder
- status: review
- requirements: [FR-001, FR-004]
- depends_on: []
- evidence: [EV-001, EV-003, EV-004]

Scope: `package.json`, `tsconfig.json`, `eslint.config.mjs`, `next.config.ts`, `.gitignore`, `src/app/`. Acceptance criteria: AC-001, AC-002, AC-006, AC-007.

### T-002 — Konfigurasi Firebase lazy dan format Rupiah
- status: review
- requirements: [FR-002, FR-003]
- depends_on: [T-001]
- evidence: [EV-002]

Scope: `.env.example`, `src/lib/firebase/`, `src/lib/money/`. Acceptance criteria: AC-003, AC-004, AC-005. Tidak memanggil Firestore.

### T-003 — Verifikasi fondasi dan konteks SDD
- status: review
- requirements: [FR-001, FR-002, FR-003, FR-004]
- depends_on: [T-001, T-002]
- evidence: [EV-001, EV-002, EV-003, EV-004]

Jalankan semua perintah di `docs/steering/tech.md`, catat evidence, perbarui handoff.

## Deferred

None.
