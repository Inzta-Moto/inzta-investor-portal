---
id: F-005
title: "Rilis produksi capital.inzta.id"
type: requirements
status: draft
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# Requirements: Rilis produksi capital.inzta.id

## Problem

Investor butuh URL tetap untuk portal. Hosting, akun, dan DNS `inzta.id` belum diputuskan (A-011).

## Goal

Portal dapat dibuka investor di `capital.inzta.id` dengan HTTPS, variabel server terisi, dan tanpa kredensial demo bawaan.

## Functional requirements

### FR-001 — Deploy dan domain

The system shall dilayani di `capital.inzta.id` lewat HTTPS dengan header keamanan dari `next.config.ts`.

- AC-001: Given domain aktif, when dibuka, then sertifikat HTTPS sah dan header `X-Frame-Options: DENY` serta `X-Robots-Tag: noindex, nofollow` ada.

### FR-002 — Konfigurasi produksi

- AC-002: Given build produksi, then `DEMO_INVESTOR_USERNAME`, `DEMO_INVESTOR_PASSWORD`, `SESSION_SECRET` (atau Firebase Auth setelah F-006) terisi di secret hosting, dan kredensial demo bawaan tidak berlaku.

## Out of scope

- Integrasi Firebase (F-006).

## Open questions

- A-011: hosting, akun, DNS. blocking: yes.
