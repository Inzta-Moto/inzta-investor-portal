---
id: ADR-0008
title: Penggunaan dana dibaca dari koleksi investor_purchases milik menu Belanja Investasi
type: adr
status: approved
tier: full
owner: "VXerys"
created: 2026-10-23
last_updated: 2026-10-23
last_verified: 2026-10-23
supersedes: ADR-0007
---

# ADR-0008: Belanja Investasi di koleksi sendiri

Diputuskan Sehan 2026-10-23 atas permintaan klien (Raja Purnama). Menggantikan ADR-0007. ADR-0006 tetap berlaku: portal membaca di server dengan proyeksi kolom dan tidak menulis ke Firestore.

## Context

- ADR-0007 menandai dokumen `production_purchases`, jadi fitur investor masuk ke form dan tabel Belanja Produksi serta ke kartu di halaman Investor.
- Klien menolak itu: belanja investor tidak boleh dicampur ke tab atau kartu yang sudah ada, karena investor sifatnya sementara. Klien minta satu menu sendiri untuk mencatat transaksi dan melihatnya per hari, minggu, atau bulan.
- Paket Spark (tanpa Blaze), dan kuota baca dipakai bersama.

## Options

### Option A — Tetap memakai penanda di `production_purchases` (ADR-0007)
- Disadvantages: belanja investor muncul di Belanja Produksi, Laporan, dan Dashboard, padahal klien ingin terpisah.

### Option B — Koleksi `investor_purchases` yang ditulis menu Belanja Investasi
- Advantages: menu dan data terpisah total; menghapus fitur investor nanti tidak menyentuh Belanja Produksi.
- Disadvantages: barang yang dibeli dari dana investasi tidak ikut terhitung di Belanja Produksi, Laporan, maupun HPP ERP.

## Decision

We will memakai Option B.

- ERP menulis `investor_purchases` dari menu Belanja Investasi (owner dan admin): `date`, `itemName`, `category`, `quantity`, `unit`, `unitPrice`, `totalCost`, `note`, `investorAgreementId: "current"`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`.
- Portal membaca `investor_purchases.where("investorAgreementId", "==", "current").select("date", "itemName", "category", "quantity", "unit", "totalCost")`. Harga satuan, catatan, dan siapa yang mengetik tidak pernah diterima server portal.
- `production_purchases` tidak dibaca portal lagi, termasuk dokumen yang masih membawa penanda ADR-0007.
- Cache 25 detik tetap sama.

## Consequences

- Positive: Belanja Produksi, Laporan, dan Dashboard ERP kembali seperti sebelum F-009.
- Negative or cost: belanja yang sudah ditandai lewat ADR-0007 tidak tampil lagi di portal dan perlu dicatat ulang di menu Belanja Investasi.
- Operational: kueri satu field memakai index otomatis; koleksi baru mengikuti Security Rules yang berlaku untuk `investor_payments`, belum dibuktikan di produksi.

## Revisit when

- Ada investor kedua (F-011): nilai `investorAgreementId` menjadi id perjanjian investor itu.
- Inzta ingin belanja investasi ikut dihitung di Laporan ERP.
