---
id: DATA-MODEL
title: Data Model
status: draft
owner: "VXerys"
last_updated: "2026-10-21"
---

# Data Model

Domain meaning, relationships, ownership, and invariants shared across features. Versioned rules files remain authoritative for access; the store's own rules are in `docs/steering/database.md`.

Status: koleksi `sales` sudah ada (milik dasbor internal, dibaca dari kode `inztamoto-erp-dashboard/public/legacy/app-runtime.js`, bukan dari database). Tiga koleksi `investor_*` di bawah adalah USULAN; belum dibuat di Firestore dan tidak boleh dibuat tanpa persetujuan (ADR-0002, A-008). Penamaan mengikuti dasbor internal: koleksi `snake_case`, field `camelCase`, tanggal string `YYYY-MM-DD`.

## Entity map

```text
sales * --- 1 investor_monthly_sales   (diringkas per bulan dari field date)
investor_agreement 1 --- * investor_payments
```

## Entities

### sales (sudah ada, milik dasbor internal, tidak dibaca langsung oleh investor)

Field yang relevan untuk ringkasan, sesuai `saleDoc` dan helper `getSaleRevenue`, `getSaleProfit` di dasbor internal:

| Field | Meaning | Required | Sensitive | Rules |
|---|---|---|---|---|
| `date` | tanggal transaksi `YYYY-MM-DD` | yes | no | kunci bulan = 7 karakter pertama |
| `revenue` | omzet transaksi (sama dengan `realRevenue` untuk data baru) | no | internal | fallback `sellingPrice * quantity` |
| `profit` | laba kotor transaksi (`realProfit` untuk data baru) | no | internal | fallback `max(0, (sellingPrice - costPrice) * quantity)` |
| `quantity` | jumlah unit | yes | no | |
| `costPrice`, `modal`, `customer`, `city`, `district`, `resellerName`, `notes` | detail operasional | no | sensitive | tidak pernah sampai ke investor |

### investor_monthly_sales/{YYYY-MM} (usulan)

| Field | Meaning | Required | Sensitive | Rules |
|---|---|---|---|---|
| `month` | `YYYY-MM`, sama dengan id dokumen | yes | no | |
| `revenue` | jumlah omzet bulan itu, Rupiah bulat | yes | internal | rumus A-007 |
| `unitsSold` | jumlah unit | yes | internal | ditampilkan hanya bila disetujui |
| `grossProfit` | jumlah laba kotor | no | internal | hanya bila A-006 dikonfirmasi |
| `updatedAt` | waktu dihitung ulang (ISO string) | yes | no | |

- INV-001: setiap nilai sama dengan agregasi `sales` dengan `date` di bulan tersebut pada saat `updatedAt`.

### investor_agreement/current (usulan, satu dokumen)

| Field | Meaning | Required | Sensitive | Rules |
|---|---|---|---|---|
| `effectiveDate` | Tanggal Efektif (Tahap I diterima penuh) | no | internal | `null` sampai diisi admin (A-009) |
| `termMonths` | 24 | yes | no | Pasal 3 |
| `commissionRateBasisPoints` | 320 (3,2%) | yes | no | Pasal 4 ayat 1 |
| `tranches` | `[{ number, amount, receivedDate }]`: Tahap I 150.000.000, Tahap II 50.000.000 | yes | internal | `receivedDate` `null` sampai diterima |
| `repayments` | `[{ number, dueMonth, amount }]`: bulan 16, 20, 24 | yes | internal | ke-1 50.000.000; ke-2 dan ke-3 `null` sampai disepakati |

- INV-002: jumlah `repayments.amount` sama dengan jumlah `tranches.amount` yang diterima, setelah semua nilai ditetapkan (Pasal 5 ayat 3).
- INV-003: Komisi bulan ke-n = `commissionRateBasisPoints / 10000 *` dana diterima sebelum pembayaran bulan itu; tidak berkurang oleh pengembalian (Pasal 4 ayat 2).

### investor_payments/{autoId} (usulan, dicatat admin)

| Field | Meaning | Required | Sensitive | Rules |
|---|---|---|---|---|
| `kind` | `commission` atau `repayment` | yes | no | |
| `periodMonth` | bulan perjanjian 1 sampai 24 | yes | no | |
| `repaymentNumber` | 1 sampai 3, hanya untuk `repayment` | no | no | |
| `amount` | nominal dibayar, Rupiah bulat | yes | internal | |
| `paidDate` | tanggal transfer `YYYY-MM-DD` | yes | internal | |
| `note` | catatan admin, misalnya Keadaan Memaksa | no | internal | tanpa data rekening |
| `recordedAt`, `recordedBy` | jejak pencatatan | yes | internal | `recordedBy` uid staf |

- INV-004: satu pembayaran per `kind` dan `periodMonth`; koreksi lewat dokumen pembatalan, bukan hapus (jejak audit).

## Relationships

| Relationship | Cardinality | Delete behavior | Integrity rule |
|---|---|---|---|
| `sales` ke `investor_monthly_sales` | many-to-one per bulan | ringkasan dihitung ulang | INV-001 |
| `investor_agreement` ke `investor_payments` | one-to-many | restrict | INV-004 |

## Access control summary

| Entity | Read | Create | Update | Delete |
|---|---|---|---|---|
| `sales` | staf (aturan sekarang tidak diketahui, A-003) | staf | staf | staf |
| `investor_*` | investor, staf | staf atau trigger | staf atau trigger | tidak ada |

## Lifecycle and retention

Data `investor_*` disimpan sampai perjanjian berakhir dan seluruh kewajiban lunas (Pasal 3 ayat 2); penghapusan akun investor setelahnya menunggu keputusan Inzta.

## Query and index expectations

- Ringkasan: baca semua dokumen `investor_monthly_sales` (paling banyak 24 sampai 36), tanpa indeks komposit.
- Pembayaran: `investor_payments` urut `periodMonth`, indeks satu field bawaan.

## Migration rules

1. Every schema change uses a versioned migration.
2. Backfills must be explicit and observable.
3. Destructive changes require compatibility and rollback analysis.
4. Changes made only in a hosted console are prohibited; every change is a versioned file in the repository.
5. Backfill awal `investor_monthly_sales` dari `sales` adalah skrip sekali jalan yang butuh persetujuan pemilik.
