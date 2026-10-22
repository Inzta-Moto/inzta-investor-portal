---
id: F-009
title: "Penggunaan dana investasi"
type: design
status: implementing
tier: lite
owner: "VXerys"
created: 2026-10-22
last_updated: 2026-10-22
last_verified: 2026-10-22
supersedes: null
---

# Design: Penggunaan dana investasi

Keputusan data: ADR-0007.

## Portal

| Path | Responsibility |
|---|---|
| `src/lib/data/firestore-source.ts` | `FUND_USAGE_FIELDS`; `getFundUsage()` membaca `production_purchases` bertanda `investorAgreementId == "current"` dengan proyeksi enam kolom, cache 25 detik |
| `src/lib/data/firestore-mapping.ts` | `toFundUsageItem(id, data)`; dokumen rusak dilewati |
| `src/lib/investment/fund-usage.ts` | `groupFundUsage(items)`: urut terbaru, kelompok per bulan (murni, teruji) |
| `src/lib/data/load.ts` | `loadFundUsage()` |
| `src/app/(portal)/penggunaan-dana/page.tsx` | rute baru lewat `PortfolioPage` |
| `src/components/portal/views.tsx` | `PenggunaanDanaView`: kartu di ponsel, tabel di desktop, satu bulan per halaman lewat `Paginated` |
| `src/components/portal/nav-links.tsx` | menu kelima "Penggunaan Dana" |

Teks (Q6): menu "Penggunaan Dana"; judul "Penggunaan Dana Investasi"; pembuka "Daftar belanja PT Inzta Gear Indonesia yang dibayar dari dana investasi Anda, dicatat oleh tim Inzta."; kosong "Belum ada belanja yang dibayar dari dana investasi."

## ERP (`inztamoto-erp-dashboard`, `public/legacy/app-runtime.js`)

- `purchaseFormHTML`: centang `#fPPInvestor` hanya untuk owner dan admin. `savePurchase` menulis tanda bila dicentang; `saveEditPurchase` menulis atau menghapus tanda (`FieldValue.delete()`), di luar `sanitize` karena `sanitize` merusak sentinel.
- Tabel Belanja Produksi: label kecil "Dana investasi" di samping nama barang bertanda.
- `confirmDeletePurchase`: peringatan tambahan untuk belanja bertanda.
- Halaman Investor: kartu "Penggunaan Dana Investasi" dengan pilihan bulan dari `state.productionPurchases`, centang per barang memanggil `toggleInvestorPurchase(id)` yang hanya mengubah `investorAgreementId`, `investorMarkedAt`, `investorMarkedBy`.
