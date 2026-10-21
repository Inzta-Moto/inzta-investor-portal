---
id: F-006
title: "Integrasi Firestore lewat server"
type: system-architecture
status: verification
tier: full
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# System Architecture: Integrasi Firestore lewat server

## 1. Intent

- Capability: portal membaca data penjualan dasbor ERP dan data perjanjian investor dari Firestore `database-inzta`, lalu menampilkan total bulanan, komisi, dan pengembalian kepada satu investor.
- Objective: angka sama dengan dasbor, terasa langsung, tanpa mengirim data per transaksi ke browser, tanpa Blaze, tanpa mengubah rules atau dasbor.
- In scope: pembacaan server, cache, pembaruan halaman, login investor, nilai bawaan kontrak.
- Out of scope: input admin (Firebase Console, A-008), hosting dan domain (F-005, A-011).
- Why a separate architecture document: database dipakai bersama dasbor ERP (kuota dan kunci akses penuh), dan ada batas keamanan antara data mentah dan investor.

## 2. Drivers

| Driver | Requirement or assumption | Priority | Architectural consequence |
|---|---|---|---|
| Tanpa data per transaksi di browser | FR-001, ADR-0006 | high | proyeksi `select()` empat kolom di server; browser menerima total bulanan |
| Rules dan dasbor tidak disentuh | ADR-0006, A-003 | high | Admin SDK di server; investor tanpa akun Firebase |
| Kuota baca Spark dipakai bersama | ADR-0006 | high | cache dua jendela dan jeda refresh saat tidak dipakai |
| Portal jalan sebelum perjanjian diisi | FR-002 AC-003 | medium | ketentuan draf sebagai nilai bawaan, dokumen admin menimpa |

Unknowns: A-016 (dokumen perjanjian di produksi, blocking: no untuk menjalankan portal), A-011 (hosting, blocking: yes untuk rilis).

## 3. Workload assumptions

| Dimension | Current | Expected growth | Source or confidence |
|---|---|---|---|
| Investor | 1 akun | tetap | perjanjian |
| Penjualan | 1.523 dokumen Mei–Okt 2026, maksimum 389 per bulan (sekitar 13 per hari) | naik bertahap | baca hanya-hitung produksi 2026-10-21 |
| Baca saat halaman dibuka | jendela langsung (kemarin dan hari ini) per 25 detik, sisa 12 bulan per jam | sebanding volume | perkiraan dari volume di atas |

Redesign triggers: kuota baca harian Firestore mendekati batas, penjualan per hari jauh di atas 100, atau investor lebih dari satu.

## 4. Context and boundaries

```text
investor browser -> Next.js server (sesi cookie) -> Firebase Admin SDK -> Firestore database-inzta <- dasbor ERP (menulis sales)
                                                                         <- admin Console (menulis investor_*)
```

| Boundary or component | Owns | Does not own | Trust level |
|---|---|---|---|
| Browser investor | tampilan, refresh berkala | data mentah, kunci apa pun | untrusted |
| Server portal | sesi, proyeksi kolom, agregasi, cache | penulisan ke Firestore | trusted |
| Firestore `sales` | transaksi dasbor ERP | data perjanjian | trusted, milik dasbor |
| `investor_agreement`, `investor_payments` | data perjanjian dan pembayaran | penjualan | trusted, diisi admin |

Boundary invariants: portal tidak pernah menulis ke Firestore; `sales` hanya dibaca lewat `SALES_FIELDS`; kunci service account hanya di env server.

## 6. Critical flows

1. Halaman diminta: cek sesi di server, `loadPortfolio()` membaca snapshot lewat cache, `buildPortfolio()` menghitung, server merender HTML berisi total saja.
2. Refresh: `AutoRefresh` memanggil `router.refresh()` tiap 30 detik selama tab terlihat dan dipakai dalam 15 menit terakhir; server memakai cache bila belum kedaluwarsa.
3. Perjanjian belum ada: `toAgreement(undefined)` mengembalikan ketentuan draf; fase "Perjanjian belum aktif"; penjualan tetap tampil.

## 10. Caching

Cache per instance server (`TtlCache`, maksimal 64 kunci): penjualan sejak kemarin 25 detik, rentang lebih lama 1 jam dengan kunci rentang tanggal, perjanjian dan pembayaran 25 detik. Perubahan penjualan lama tampil paling lambat 1 jam.

## 12. Reliability and resilience

Konfigurasi hilang menjadi pesan di halaman; field perjanjian rusak memakai nilai kontrak dan dicatat di log server; pembayaran rusak dilewati dengan kalimat untuk investor; galat lain ke error boundary dengan tombol "Coba lagi".

## 13. Security, privacy, abuse

Kunci service account memberi akses penuh ke database bersama; disimpan hanya di env server, dibuat dan diputar pemilik. Login: hash scrypt async, cookie HMAC dengan kunci turunan dari kata sandi, pembatas 5 per klien dan 50 total per 15 menit. Browser tidak pernah menerima kolom pelanggan, kota, reseller, atau harga modal (EV-004).

## 18. Accepted trade-offs

- Refresh berkala, bukan push realtime; tunda sampai 25 detik untuk penjualan baru.
- Satu kunci dengan akses penuh di server portal, sebagai ganti tidak mengubah rules dan tidak memakai Blaze.

## 20. Verification plan

Unit test pemetaan, cache, dan kredensial; `npm run test:emulator` untuk proyeksi, batas bulan, cache, dan tanpa perjanjian; pemeriksaan hanya-baca produksi untuk bentuk data; pemeriksaan layar HP dan desktop.

## 21. Impact on global architecture and ADRs

ADR-0006 (menggantikan ADR-0002 dan ADR-0005); ADR-0001 tetap.
