---
id: F-009
title: "Penggunaan dana investasi"
type: design
status: verification
tier: lite
owner: "VXerys"
created: 2026-10-22
last_updated: 2026-10-23
last_verified: 2026-10-22
supersedes: null
---

# Design: Penggunaan dana investasi

Keputusan data: ADR-0008 (menggantikan ADR-0007 pada 2026-10-23).

## Portal

| Path | Responsibility |
|---|---|
| `src/lib/data/firestore-source.ts` | `FUND_USAGE_FIELDS`; `getFundUsage()` membaca `investor_purchases` dengan `investorAgreementId == "current"` dengan proyeksi enam kolom, cache 25 detik |
| `src/lib/data/firestore-mapping.ts` | `toFundUsageItem(id, data)`; dokumen rusak dilewati |
| `src/lib/investment/fund-usage.ts` | `groupFundUsage(items)`: urut terbaru, kelompok per bulan (murni, teruji) |
| `src/lib/data/load.ts` | `loadFundUsage()` |
| `src/app/(portal)/penggunaan-dana/page.tsx` | rute baru lewat `PortfolioPage` |
| `src/components/portal/views.tsx` | `PenggunaanDanaView`: kartu di ponsel, tabel di desktop, satu bulan per halaman lewat `Paginated` |
| `src/components/portal/nav-links.tsx` | menu kelima "Penggunaan Dana" |

Teks (Q6): menu "Penggunaan Dana"; judul "Penggunaan Dana Investasi"; pembuka "Daftar belanja PT Inzta Gear Indonesia yang dibayar dari dana investasi Anda, dicatat oleh tim Inzta."; kosong "Belum ada belanja yang dibayar dari dana investasi."

## ERP (`inztamoto-erp-dashboard`, `public/legacy/app-runtime.js`)

- Menu `#menuBelanjaInvestasi` dan halaman `#pageBelanjaInvestasi` di `src/components/InztamotoApp.jsx`; akses owner dan admin di `updateNavigationAccess` dan `navigateTo`.
- Listener lazy `investor_purchases` (`LAZY_LISTENERS_BY_PAGE.belanjaInvestasi`), dimulai saat halaman dibuka; kuota habis tampil sebagai pesan dengan tombol Coba lagi.
- `renderBelanjaInvestasi`: kartu total dan jumlah transaksi, filter `state.ip.period` (day, week memakai `getWeekKey`, month, all) dengan tanggal acuan, cari, tabel 10 per halaman.
- `openInvestorPurchaseModal`, `saveInvestorPurchase`, `confirmDeleteInvestorPurchase`, `deleteInvestorPurchase`: form sendiri (`#fIP*`), tanpa status minggu.
- Belanja Produksi dan halaman Investor kembali seperti sebelum F-009; centang, label, kartu, dan `toggleInvestorPurchase` dicabut.
