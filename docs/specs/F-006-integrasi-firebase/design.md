---
id: F-006
title: "Integrasi Firestore lewat server"
type: design
status: verification
tier: full
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# Design: Integrasi Firestore lewat server

Mengikuti ADR-0006, ADR-0003 (kontrak `InvestorDataSource`), ADR-0004 (cookie sesi).

## Modules

| Path | Responsibility |
|---|---|
| `src/lib/data/admin-config.ts` | mode emulator (`FIRESTORE_EMULATOR_HOST`) atau service account (`FIREBASE_*`) |
| `src/lib/data/firestore-source.ts` | `adminDb()`, `SALES_FIELDS`, `createFirestoreSource()`; satu-satunya importir `firebase-admin` |
| `src/lib/data/firestore-mapping.ts` | validasi `investor_agreement` (field rusak kembali ke kontrak) dan `investor_payments` |
| `src/lib/investment/contract-terms.ts` | ketentuan draf sebagai nilai bawaan saat dokumen perjanjian belum ada |
| `src/lib/data/ttl-cache.ts` | cache per instance, berbagi promise yang sedang berjalan, maksimal 64 kunci |
| `src/lib/data/load.ts` | `loadPortfolio()` per request; `InvestorDataError` menjadi pesan halaman |
| `src/app/(portal)/portfolio.tsx` | cek sesi di titik akses data, lalu render `PortfolioView` dan `AutoRefresh` |
| `src/components/portal/auto-refresh.tsx` | `router.refresh()` tiap 30 detik saat terlihat dan aktif 15 menit terakhir |
| `src/lib/auth/investor-credentials.ts` | hash scrypt async, validasi parameter, `sessionKey()` |

## Read budget

Sales dipecah di batas kemarin: rentang `[kemarin, ...)` di-cache 25 detik; tiap bulan sebelum kemarin di-cache 1 jam dengan kunci `from|to`, sehingga pergantian hari membuka rentang baru. Kemarin ikut rentang langsung karena dasbor internal mengisi tanggal default dengan tanggal UTC.

## Data contract

Semua field perjanjian opsional; yang kosong memakai `CONTRACT_TERMS`, urutan `dueMonth` harus naik. `investor_agreement/current`: `effectiveDate` (YYYY-MM-DD atau null), `totalInvestment`, `termMonths`, `commissionRateBasisPoints`, `tranches[{amount, receivedDate}]`, `repayments[3]{dueMonth, percentBasisPoints}`. `investor_payments/{id}`: `kind` (commission/repayment), `periodMonth`, `amount`, `paidDate`, `repaymentNumber` untuk repayment, `note` opsional.

## Testing

Unit test untuk pemetaan, cache, kredensial; `npm run test:emulator` untuk proyeksi kolom, total bulanan, batas bulan, cache, dan perjanjian hilang.
