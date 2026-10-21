---
id: F-002
title: "Domain investasi dan data mock"
type: design
status: implementing
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# Design: Domain investasi dan data mock

## Files

| Path | Isi | FR |
|---|---|---|
| `src/lib/investment/types.ts` | `Agreement`, `Payment`, `MonthlySales`, `InvestorSnapshot`, status union | semua |
| `src/lib/investment/calendar.ts` | tanggal ISO tanpa zona waktu, `agreementMonthDate`, `currentAgreementMonth`, `monthKey` | FR-001, FR-003 |
| `src/lib/investment/commission.ts` | `monthlyCommission`, `buildCommissionSchedule`, `commissionTotals` | FR-001 |
| `src/lib/investment/repayment.ts` | `buildRepaymentSchedule`, `repaymentTotals`, `validateRepaymentSplit` | FR-002 |
| `src/lib/investment/sales.ts` | `saleRevenue`, `aggregateMonthlySales`, `lastTwelveMonths` | FR-004 |
| `src/lib/investment/portfolio.ts` | `buildPortfolio(snapshot, today)`: satu objek siap tampil untuk semua halaman | FR-001 sampai FR-004 |
| `src/lib/data/source.ts` | `InvestorDataSource`, `getDataSource(env)` | FR-005 |
| `src/lib/data/mock.ts` | `createMockSource()`, data contoh relatif terhadap hari ini | FR-005 |
| `src/lib/money/rupiah.ts` | `formatRupiahCompact` ditambahkan | FR-006 |

## Decisions

- Tanggal disimpan sebagai string `YYYY-MM-DD` seperti dasbor internal; aritmetika bulan memakai tahun dan bulan bilangan bulat, tidak memakai `Date` lokal, agar hasil server dan browser sama (zona WIB vs UTC).
- "Hari ini" selalu parameter (`today: IsoDate`), tidak dibaca di dalam domain, supaya test deterministik. Halaman menghitungnya sekali di zona `Asia/Jakarta`.
- Uang tetap Rupiah bulat; persentase dalam basis poin (10000 = 100%); pembagian memakai pembulatan ke bawah dan sisa ditambahkan ke pengembalian terakhir agar total tepat Rp200.000.000.
- Import relatif memakai ekstensi `.ts` agar `node --test` dapat memuat modul tanpa bundler.

## Error handling

`validateRepaymentSplit` mengembalikan `{ ok: false, reason }` dan `buildPortfolio` meneruskannya sebagai `warnings`; layar menampilkan peringatan, bukan crash.

## Test plan

Unit test di samping setiap modul (`*.test.ts`), meliputi AC-001 sampai AC-014.
