---
id: F-003
title: "Tampilan portal investor"
type: verification
status: implemented
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
requirements: [FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007]
supersedes: null
---

# Verification: Tampilan portal investor

## Evidence

### EV-001 — Build, lint, typecheck
- command: `npm run lint && npm run typecheck && npm run build`
- output:
  ```text
  eslint bersih; tsc exit 0; ✓ Compiled successfully; 4 halaman portal dinamis (ƒ)
  ```
- date: 2026-10-21
- commit: 02ba2a8
- covers: [AC-011]

### EV-002 — Desktop 1366 px, terang dan gelap
- command: `npm run dev`, browser pane 1366×900, `/ringkasan`, `/pengembalian?skenario=tahun-kedua`
- output:
  ```text
  sidebar berlogo, menu aktif charcoal, navigasi bawah tersembunyi, label "Data contoh";
  kartu utama Rp6.400.000 + chip Jatuh tempo; Komisi sudah masuk Rp128.000.000 (20 dari 24);
  Pengembalian sudah masuk Rp100.000.000 (2 dari 3, 50%); tabel Pasal 5 dengan baris Jumlah
  ```
- date: 2026-10-21
- commit: 02ba2a8
- covers: [AC-001, AC-003, AC-004, AC-013, AC-014]

### EV-003 — HP 360 px
- command: browser pane 360×780 pada keempat halaman
- output:
  ```text
  scrollWidth 360 = viewport di semua halaman; navigasi bawah 4 label; hero 42,7 px muat di kartu 328 px;
  grafik 12 batang, bulan berjalan diarsir, sumbu 0/25 jt/50 jt/75 jt; Komisi 24 baris daftar;
  Pengembalian "Belum ditetapkan" di ketiga kartu, sisa Rp200.000.000
  /penjualan: svg role=group, 12 rect role=img tabindex=0 berlabel, tabel 12 bulan selalu ada (sr-only atau tombol Tabel)
  ```
- date: 2026-10-21
- commit: 02ba2a8
- covers: [AC-002, AC-006, AC-007, AC-008, AC-009]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-001 sampai AC-004, AC-013, AC-014 | EV-002 | pass |
| AC-002, AC-006 sampai AC-009 | EV-003 | pass |
| AC-011 | EV-001 | pass |
| AC-005, AC-010, AC-012 | | not_run |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| AC-005 fase belum mulai, selesai | mock selalu bulan ke-3 atau 21 | logika fase teruji di F-002 EV-001 |
| AC-010 dan layar gagal AC-012 | butuh data rusak atau sumber gagal; teks "Memuat data…" sempat terlihat saat kompilasi dev | rendah; komponen sederhana |

## Result

`pass_with_limitations`: tampilan utama terverifikasi di HP dan desktop; tiga kondisi tepi hanya dijamin lewat logika domain.
