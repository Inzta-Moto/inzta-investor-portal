---
id: ADR-0007
title: Penggunaan dana dibaca dari production_purchases yang ditandai, enam kolom
type: adr
status: superseded
tier: full
owner: "VXerys"
created: 2026-10-22
last_updated: 2026-10-23
last_verified: 2026-10-22
supersedes: null
---

# ADR-0007: Penggunaan dana dari Belanja Produksi yang ditandai

Digantikan ADR-0008 (2026-10-23): klien meminta belanja investor dicatat di menu sendiri, tidak dicampur ke Belanja Produksi.

Diputuskan Sehan 2026-10-22, setelah sesi grilling F-009 (Q1, Q9, Q11). Melengkapi ADR-0006: aturan baca di server dan proyeksi kolom tetap berlaku, dan portal kini membaca satu koleksi ERP tambahan.

## Context

- Klien meminta investor melihat ke mana dana investasi dipakai, berupa daftar tanpa total.
- Belanja dicatat di halaman Belanja Produksi ERP (`production_purchases`, satu dokumen per barang, 530 dokumen pada 2026-10-21). Field `category` diketik bebas, jadi tidak bisa menjadi penanda.
- Paket Spark (tanpa Blaze, keputusan Sehan 2026-10-22), dan kuota baca dipakai bersama.

## Options

### Option A — Field penanda di dokumen belanja
- Advantages: tanpa data ganda; edit belanja langsung terlihat; kueri `where` hanya membaca belanja yang ditandai.
- Disadvantages: ERP menulis satu field tambahan ke koleksi miliknya sendiri.

### Option B — Koleksi `investor_fund_usage` berisi salinan belanja
- Disadvantages: data ganda; edit belanja tidak ikut berubah.

## Decision

We will memakai Option A.

- ERP menulis `investorAgreementId: "current"` pada belanja yang dibayar dana investasi, ditambah `investorMarkedAt` dan `investorMarkedBy`; menghapus field itu membatalkan tanda. Nilainya id perjanjian, bukan `true`, supaya multi-investor (F-011) cukup mengganti nilainya.
- Portal membaca `production_purchases.where("investorAgreementId", "==", "current").select("date", "itemName", "category", "quantity", "unit", "totalCost")`. Harga satuan, catatan, status minggu, dan field lain tidak pernah diterima server portal. Kolom ini ada di `FUND_USAGE_FIELDS` di `src/lib/data/firestore-source.ts`.
- Hasil di-cache 25 detik, sama dengan perjanjian dan pembayaran.
- Portal tetap tidak menulis ke Firestore.

## Consequences

- Positive: investor melihat belanja yang sama dengan catatan Inzta, dan biaya baca sama dengan jumlah belanja yang ditandai.
- Negative or cost: belanja yang dihapus di ERP hilang dari portal; ERP memperingatkan sebelum hapus.
- Operational: kueri satu field memakai index otomatis Firestore; tidak ada index komposit baru.

## Revisit when

- Ada investor kedua (F-011): nilai penanda menjadi id perjanjian investor itu.
- Dana investasi dipakai untuk pengeluaran di luar Belanja Produksi.
