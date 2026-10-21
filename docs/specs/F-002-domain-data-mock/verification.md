---
id: F-002
title: "Domain investasi dan data mock"
type: verification
status: implemented
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
requirements: [FR-001, FR-002, FR-003, FR-004, FR-005, FR-006]
supersedes: null
---

# Verification: Domain investasi dan data mock

## Evidence

### EV-001 — Unit test domain, mock, format
- command: `npm test`
- output:
  ```text
  ✔ AC-001 … AC-004, AC-009 (commission.test.ts); AC-005 … AC-008 (repayment.test.ts)
  ✔ AC-010, AC-011 (sales.test.ts); AC-012, AC-013 (source.test.ts); compact Rupiah (rupiah.test.ts)
  ℹ tests 41, pass 41, fail 0
  ```
- date: 2026-10-21
- commit: 02ba2a8
- covers: [AC-001, AC-002, AC-003, AC-004, AC-005, AC-006, AC-007, AC-008, AC-009, AC-010, AC-011, AC-012, AC-013, AC-014]

### EV-002 — Lint, typecheck, build
- command: `npm run lint && npm run typecheck && npm run build`
- output:
  ```text
  eslint: tanpa temuan; ✓ Types generated successfully; tsc exit 0
  ✓ Compiled successfully in 4.8s; ƒ /ringkasan /penjualan /komisi /pengembalian /masuk
  ```
- date: 2026-10-21
- commit: 02ba2a8
- covers: [AC-012]

### EV-003 — Review independen dan perbaikannya
- command: agen `code-reviewer` atas diff, lalu `npm test`
- output:
  ```text
  temuan diperbaiki: pembayaran sebagian tidak lagi berstatus Dibayar, duplikat dijumlah per bulan,
  Rp999.950.000 tampil "Rp1 M", mock tidak berstatus Terlambat setelah tanggal 26; test baru hijau
  ```
- date: 2026-10-21
- commit: 02ba2a8
- covers: [AC-003, AC-008, AC-014]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-001 sampai AC-014 | EV-001 | pass |
| AC-003, AC-008, AC-014 (kasus tepi) | EV-003 | pass |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Data Firestore nyata | ditahan klien (A-014) | bentuk dokumen nyata diuji di F-006 |

## Result

`pass`: aturan Pasal 4 dan 5 serta adaptor mock teruji pada 02ba2a8.
