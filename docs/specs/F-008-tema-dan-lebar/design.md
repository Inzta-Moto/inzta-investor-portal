---
id: F-008
title: "Pilihan tema dan konten desktop lebar penuh"
type: design
status: implemented
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# Design: Pilihan tema dan konten desktop lebar penuh

| Path | Responsibility |
|---|---|
| `src/lib/theme.ts` | nama cookie `inzta_theme`, `parseTheme` |
| `src/app/layout.tsx` | membaca cookie dan memasang `data-theme` di `<html>` |
| `src/app/globals.css` | token gelap untuk `[data-theme="dark"]` dan untuk perangkat gelap tanpa pilihan; dua blok dijaga identik oleh `theme.test.ts` |
| `src/components/portal/theme-toggle.tsx` | tombol Terang/Gelap di sidebar, ikon di header HP; menulis cookie, menahan transisi saat berganti, menyesuaikan warna bilah browser |
| `src/components/portal/app-shell.tsx` | `main` tanpa batas lebar |
