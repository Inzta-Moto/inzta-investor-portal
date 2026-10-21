---
id: F-004
title: "Login mode demo"
type: verification
status: implemented
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
requirements: [FR-001, FR-002, FR-003, FR-004, FR-005]
supersedes: null
---

# Verification: Login mode demo

## Evidence

### EV-001 — Unit test token, konfigurasi, pembatas percobaan
- command: `npm test`
- output:
  ```text
  ✔ AC-003 token diubah/kedaluwarsa/rahasia lain ditolak; ✔ AC-004 kredensial; ✔ AC-008 produksi menolak
  ✔ AC-009 akun demo hanya di development; ✔ blokir setelah 5 gagal per 15 menit
  ℹ tests 41, pass 41, fail 0
  ```
- date: 2026-10-21
- commit: 02ba2a8
- covers: [AC-003, AC-004, AC-008, AC-009]

### EV-002 — Alur masuk di browser
- command: `npm run dev`, `/masuk` dengan kata sandi salah lalu benar
- output:
  ```text
  salah: tetap di /masuk, "Username atau kata sandi salah.", tanpa cookie
  benar: diarahkan ke /ringkasan; cookie httpOnly tidak terbaca document.cookie
  ```
- date: 2026-10-21
- commit: 02ba2a8
- covers: [AC-001, AC-002]

### EV-003 — Gerbang dan keluar
- command: fetch tanpa cookie ke 4 halaman portal, fetch dengan header RSC, tombol Keluar
- output:
  ```text
  /ringkasan /penjualan /komisi /pengembalian tanpa cookie → /masuk, tanpa data; RSC tanpa cookie → redirect
  dengan sesi: /masuk → /ringkasan; Keluar → /masuk, lalu /komisi → /masuk
  ```
- date: 2026-10-21
- commit: 02ba2a8
- covers: [AC-005, AC-006, AC-007]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-001, AC-002 | EV-002 | pass |
| AC-003, AC-004, AC-008, AC-009 | EV-001 | pass |
| AC-005 sampai AC-007 | EV-003 | pass |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Pembatas percobaan di browser | diuji di unit test saja | pembatas per instance server, hilang saat restart (ADR-0004) |

## Result

`pass`: gerbang sesi di layout dan di titik akses data menolak akses tanpa sesi pada 02ba2a8.
