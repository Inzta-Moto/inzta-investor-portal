---
id: ADR-0006
title: Server portal membaca Firestore dengan Admin SDK, sales dibatasi empat kolom, login milik portal
type: adr
status: approved
tier: full
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: [ADR-0002, ADR-0005]
---

# ADR-0006: Baca di server dengan proyeksi kolom, tanpa akun Firebase untuk investor

> Koreksi fakta 2026-10-21 (A-017): database dasbor ERP adalah project `database-inzta`, bukan `inzta-5244e` yang disebut di Context. Keputusan tidak berubah.

Diputuskan Sehan 2026-10-21 ("jadi kita ambil sebagian kolom itu aja untuk investor", lalu "oke pakai jalan tengah aja opsi nya"). Menggantikan ADR-0002 (koleksi ringkasan oleh Cloud Function) dan ADR-0005 (Firebase Auth di browser). Kontrak `InvestorDataSource` dari ADR-0003 dan cookie sesi dari ADR-0004 tetap dipakai; adaptor mock ADR-0003 dan akun demo ADR-0004 dihapus.

## Context

- Security Rules Firestore mengizinkan atau menolak satu dokumen utuh; tidak bisa menyembunyikan kolom pelanggan, kota, reseller, atau harga modal di dokumen `sales`.
- Project `inzta-5244e` memakai paket Spark: Cloud Functions (ADR-0002) butuh Blaze.
- Akun Firebase Auth apa pun bisa masuk ke dasbor internal karena role fallback (A-004), dan rules aktif tidak diketahui (A-003).
- Investor berusia lanjut; Sehan menerima bahwa total bulanan terlihat di devtools browser.

## Decision drivers

1. Investor tidak menerima data per transaksi atau kolom sensitif.
2. Tanpa Blaze, tanpa mengubah rules atau dasbor internal.
3. Angka terasa langsung tanpa menghabiskan kuota baca yang dipakai bersama dasbor internal.

## Options

### Option A — Koleksi ringkasan oleh Cloud Function (ADR-0002)
- Disadvantages: butuh Blaze dan deploy fungsi ke project bersama.

### Option B — Firebase Auth di browser, rules untuk `investor_*` (ADR-0005)
- Disadvantages: membuka akun Auth yang bisa masuk dasbor internal; membaca `sales` mentah tetap tidak mungkin tanpa koleksi ringkasan.

### Option C — Server portal membaca dengan Admin SDK dan proyeksi kolom
- Advantages: tanpa Blaze, tanpa perubahan rules; browser hanya menerima total bulanan.
- Disadvantages: service account dengan akses penuh ada di server portal; bukan push realtime, melainkan refresh berkala.

## Decision

We will memakai Option C.

- `src/lib/data/firestore-source.ts` membaca `sales` dengan `select("date", "revenue", "sellingPrice", "quantity")` dan menjumlahkan per bulan dengan aturan `getSaleRevenue` dasbor internal (A-007). Hanya file ini yang mengimpor `firebase-admin`.
- `investor_agreement/current` dan `investor_payments` diisi admin lewat Console (A-008); portal tidak menulis apa pun ke Firestore.
- Login memakai username dan hash scrypt di env server (`INVESTOR_USERNAME`, `INVESTOR_PASSWORD_HASH`); kunci tanda tangan cookie diturunkan dari `SESSION_SECRET`, username, dan hash, sehingga ganti kata sandi mengeluarkan semua perangkat.
- Penjualan bertanggal kemarin ke atas di-cache 25 detik, hari yang lebih lama 1 jam, perjanjian dan pembayaran 25 detik. Halaman meminta render ulang setiap 30 detik selama tab terlihat dan dipakai dalam 15 menit terakhir.

## Consequences

- Positive: investor tidak pernah menerima kolom selain total bulanan; dasbor internal dan rules tidak disentuh; A-003 dan A-004 tidak lagi memblokir.
- Negative or cost: kunci service account memberi akses penuh ke project bersama; bocornya kunci sama dengan bocornya seluruh database. Kunci hanya di env server, dibuat dan diputar oleh Sehan.
- Negative or cost: Admin SDK melewati Security Rules, jadi batas data adalah kode `SALES_FIELDS`, diuji di emulator.
- Operational: kuota baca Spark (50.000 per hari) dipakai bersama. Biaya baca bergantung jumlah penjualan per hari; bila volume besar, perpanjang cache atau beralih ke Option A.
- Operational: perubahan pada penjualan lama (lebih dari sehari) tampil paling lambat 1 jam.

## Revisit when

- Inzta pindah ke Blaze atau volume penjualan membuat kuota harian mendekati batas.
- Investor lebih dari satu orang, atau butuh lupa kata sandi mandiri.
