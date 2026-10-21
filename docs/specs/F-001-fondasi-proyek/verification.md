---
id: F-001
title: "Fondasi proyek"
type: verification
status: implemented
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
requirements: [FR-001, FR-002, FR-003, FR-004]
supersedes: null
---

# Verification: Fondasi proyek

## Evidence

### EV-001 — Instalasi, lint, typecheck, build, tooling SDD
- command: `npm ci && npm run lint && npm run typecheck && npm run build && npm run test:sdd && npm run context:validate`
- output:
  ```text
  npm ci exit 0; eslint bersih; tsc exit 0; ✓ Compiled successfully in 6.3s; ┌ ○ / (static)
  test:sdd 34 pass, 0 fail; Context validation passed: 0 error(s)
  ```
- date: 2026-10-21
- commit: 73f4f09
- covers: [AC-001]

### EV-002 — Unit test konfigurasi Firebase
- command: `npm test`
- output:
  ```text
  ℹ tests 6, pass 6, fail 0 (config.test.ts 3, rupiah.test.ts 3)
  ```
- date: 2026-10-21
- commit: 73f4f09
- covers: [AC-003, AC-004]

### EV-003 — Header, meta, dan CSS cetak pada dev server
- command: `npm run dev` (port 3300), fetch `/` dan inspeksi DOM di browser pane
- output:
  ```text
  200; x-frame-options DENY; x-robots-tag noindex, nofollow; meta robots noindex, nofollow; @media print { body { display: none } }
  ```
- date: 2026-10-21
- commit: 73f4f09
- covers: [AC-002, AC-006, AC-007]

### EV-005 — Format Rupiah PUEBI setelah AC-005 diubah
- command: `npm test`
- output:
  ```text
  ✔ formats whole Rupiah with dot grouping and the symbol attached (Rp6.400.000); ✔ rejects fractions; 41 pass
  ```
- date: 2026-10-21
- commit: 02ba2a8
- covers: [AC-005]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-001 | EV-001 | pass |
| AC-002, AC-006, AC-007 | EV-003 | pass |
| AC-003, AC-004 | EV-002 | pass |
| AC-005 | EV-005 | pass |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Koneksi Firebase nyata | ditahan klien (A-014) | `getFirebaseApp` baru teruji di F-006 |
| Header di `next start` | hanya diperiksa di dev; sumber sama (`next.config.ts`) | rendah |

## Result

`pass_with_limitations`: semua AC lulus; koneksi Firebase belum diuji karena integrasi ditahan.
