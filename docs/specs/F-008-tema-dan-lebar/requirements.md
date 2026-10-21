---
id: F-008
title: "Pilihan tema dan konten desktop lebar penuh"
type: requirements
status: implemented
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# Requirements: Pilihan tema dan konten desktop lebar penuh

## Problem

Tema hanya mengikuti perangkat, dan konten desktop dibatasi 1180 px sehingga layar lebar menyisakan ruang kosong (permintaan Sehan dan klien 2026-10-21: "kasih option ... light theme dan darktheme", "full widt aja bro").

## Goal

Investor memilih tema terang atau gelap sendiri, dan konten desktop memenuhi lebar layar di samping sidebar.

## Functional requirements

### FR-001 — Pilihan tema

- AC-001: Given investor memilih Terang atau Gelap, then seluruh portal berganti tanpa muat ulang dan pilihan tersimpan setahun di cookie.
- AC-002: Given pilihan tersimpan, then server merender tema itu sejak awal, juga bila tema perangkat berbeda; tanpa pilihan, tema mengikuti perangkat.

### FR-002 — Lebar penuh

- AC-003: Given layar desktop, then konten mengisi lebar dari tepi sidebar sampai tepi kanan, tanpa overflow, dan grafik mengisi kartunya.
