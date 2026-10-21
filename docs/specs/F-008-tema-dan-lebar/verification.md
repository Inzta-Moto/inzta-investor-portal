---
id: F-008
title: "Pilihan tema dan konten desktop lebar penuh"
type: verification
status: implemented
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
requirements: [FR-001, FR-002]
supersedes: null
---

# Verification: Pilihan tema dan konten desktop lebar penuh

## Evidence

### EV-001 — Tema di HP dan desktop
- command: `next start` dengan emulator; ikon header di 360 px (perangkat terang), tombol sidebar di 1440 px (perangkat gelap); `npm test` (theme.test.ts)
- output:
  ```text
  HP: perangkat terang, klik: data-theme=dark, latar rgb(12,10,9), cookie inzta_theme=dark, HTML server berisi data-theme="dark"
  desktop: perangkat gelap, Terang: latar rgb(250,250,249), Terang=true; 320 px terang dan gelap tanpa overflow; dua blok token identik
  ```
- date: 2026-10-21
- commit: 082e011
- covers: [AC-001, AC-002]

### EV-002 — Lebar penuh 1920 px
- command: `next start` dengan emulator, 1920x1000 gelap, empat halaman lewat sidebar
- output:
  ```text
  main 248 sampai 1905/1920 px (scrollbar 15 px); grafik 1015/1056 dan 1567/1608 px; tanpa overflow; sidebar sampai dasar layar
  ```
- date: 2026-10-21
- commit: 082e011
- covers: [AC-003]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-001, AC-002 | EV-001 | pass |
| AC-003 | EV-002 | pass |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Tombol tema di halaman masuk | belum ada; halaman masuk mengikuti cookie atau perangkat | investor yang belum pernah memilih melihat tema perangkat saat masuk |

## Result
Lulus.
