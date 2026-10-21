---
id: F-006
title: "Integrasi Firestore lewat server"
type: tasks
status: verification
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
requirements: [FR-001, FR-002, FR-003, FR-004, FR-005]
supersedes: null
---

# Tasks: Integrasi Firestore lewat server

This file is the master for task status. Rencana awal (rules, Cloud Function, Firebase Auth) dibatalkan oleh ADR-0006.

## Tasks

### T-001 — Admin SDK, konfigurasi, dan emulator
- status: done
- requirements: [FR-001]
- depends_on: []
- evidence: [EV-001, EV-002]

`firebase-admin` menggantikan `firebase` (disetujui Sehan lewat pilihan "jalan tengah"); `firebase.json` hanya emulator; Java 21 di `D:	ools\jre21` untuk mesin lokal.

### T-002 — Adaptor Firestore dengan proyeksi kolom
- status: done
- requirements: [FR-001, FR-002]
- depends_on: [T-001]
- evidence: [EV-002, EV-004]

### T-003 — Cache dan pembaruan otomatis
- status: done
- requirements: [FR-003]
- depends_on: [T-002]
- evidence: [EV-002, EV-003]

### T-004 — Login milik portal
- status: done
- requirements: [FR-004]
- depends_on: []
- evidence: [EV-001, EV-003]

### T-005 — Hapus mock dan akun demo
- status: done
- requirements: [FR-005]
- depends_on: [T-002, T-004]
- evidence: [EV-001, EV-004]

### T-006 — Sambungkan ke produksi
- status: blocked
- requirements: [FR-001, FR-002, FR-004]
- depends_on: [T-001, T-002, T-003, T-004, T-005]
- evidence: []

Menunggu A-016: Sehan membuat kunci service account dan env produksi; admin membuat `investor_agreement/current` dan `investor_payments`; hosting A-011.

## Deferred

None.
