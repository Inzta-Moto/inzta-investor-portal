---
id: F-001
title: "Fondasi proyek"
type: verification
status: verification
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

### EV-001 — Lint, typecheck, dan build tanpa variabel Firebase
- command: `npm run lint && npm run typecheck && npm run build`
- output:
  ```text
  eslint: tanpa temuan, exit 0; ✓ Types generated successfully; tsc --noEmit exit 0
  ▲ Next.js 16.4.2 (Turbopack) ✓ Compiled successfully in 6.3s; ┌ ○ / (static)
  ```
- date: 2026-10-21
- commit: 73f4f09
- covers: [AC-001]

### EV-002 — Unit test konfigurasi Firebase dan format Rupiah
- command: `npm test`
- output:
  ```text
  ℹ tests 6, pass 6, fail 0 (config.test.ts 3, rupiah.test.ts 3)
  ```
- date: 2026-10-21
- commit: 73f4f09
- covers: [AC-003, AC-004, AC-005]

### EV-003 — Header, meta, dan CSS cetak pada dev server
- command: `npm run dev` (port 3300), fetch `/` dan inspeksi DOM di browser pane
- output:
  ```text
  200; x-frame-options DENY; x-robots-tag noindex, nofollow; meta robots noindex, nofollow
  @media print { body { display: none; } }; console error 0; request hanya ke localhost:3300
  ```
- date: 2026-10-21
- commit: 73f4f09
- covers: [AC-002, AC-006, AC-007]

### EV-004 — Instalasi bersih, tooling SDD, validasi konteks
- command: `npm ci && npm run test:sdd && npm run context:validate`
- output:
  ```text
  npm ci exit 0; test:sdd 34 pass, 0 fail; Context validation passed: 0 error(s)
  ```
- date: 2026-10-21
- commit: 73f4f09
- covers: [AC-001]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-001 | EV-001, EV-004 | pass |
| AC-002, AC-006, AC-007 | EV-003 | pass |
| AC-003, AC-004, AC-005 | EV-002 | pass |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Koneksi Firebase nyata | `.env.local` belum diisi; Firestore produksi tidak disentuh (BR-001) | `getFirebaseApp` baru teruji di F-002 |
| Format check | tidak ada formatter (`tech.md`: none) | gaya dijaga ESLint |
| Header di `next start` | hanya diperiksa di dev; sumber sama (`next.config.ts`) | rendah |

## Result

`pass_with_limitations`: semua AC lulus pada 73f4f09; koneksi Firebase belum diuji karena kredensial dan ADR-0002 belum ada.
