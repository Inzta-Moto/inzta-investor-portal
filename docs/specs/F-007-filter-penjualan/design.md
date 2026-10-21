---
id: F-007
title: "Filter bulan dan tahun di Penjualan"
type: design
status: implemented
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# Design: Filter bulan dan tahun di Penjualan

| Path | Responsibility |
|---|---|
| `src/lib/investment/sales.ts` | `availableYears`, `parseSalesFilter`, `filterMonths`, `salesPoints`, `monthFocus` (murni, teruji) |
| `src/lib/data/firestore-source.ts` | `getMonths(keys)` memakai cache jendela langsung dan rentang yang sama dengan `getSnapshot`; `getFirstSaleMonth` (1 dokumen, cache 1 jam) |
| `src/lib/data/load.ts` | `loadSalesView(searchParams)`; bulan terpilih ikut memuat bulan sebelumnya |
| `src/components/portal/sales-filter.tsx` | dua `<select>` bawaan; `router.push` dengan `?tahun=&bulan=` dalam transition |
| `src/components/portal/sales-chart.tsx` | `highlight`, slot `controls` dan `summary` |

Filter ada di URL, jadi render server dan refresh 30 detik mempertahankan periode. Kartu ringkasan atas tetap menunjukkan kondisi terkini, bukan periode filter.
