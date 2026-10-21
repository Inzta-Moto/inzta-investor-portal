---
id: ASSUMPTIONS
title: Assumptions Log
status: active
owner: "VXerys"
last_updated: "2026-10-21"
---

# Assumptions

Agents and contributors log unknowns here instead of guessing. An `open` assumption blocks the tasks it affects, and a feature cannot become `implemented` while it has an `open` assumption. The owner resolves entries to `confirmed` or `rejected` and records the resolution; rejected assumptions stay in the log.

## Block format

Every entry uses exactly this shape; the key-value lines are parsed.

```markdown
### A-001 — title
- status: open          # open | confirmed | rejected
- feature: F-001
- raised: YYYY-MM-DD
- resolution:

What was assumed, why it could not be verified, and what changes if it is wrong.
```

## Entries

Sumber: VN Raja Purnama 2026-10-20, draf Perjanjian Kerja Sama Investasi versi 2026-10-21 08.37, dan arahan Sehan 2026-10-21. Pada 2026-10-21 Sehan mendelegasikan keputusan pertanyaan terbuka kepada agen ("langsung approve aja") dan klien meminta data mock dulu, integrasi Firebase ditahan. Resolusi bertanda **[delegasi]** dibuat agen atas delegasi itu dan perlu dicek ulang Sehan.

### A-001 — Satu database Firestore dengan dasbor internal, data realtime
- status: confirmed
- feature: F-006
- raised: 2026-10-21
- resolution: Dikonfirmasi Sehan 2026-10-21 ("1 database 2 web agar realtime"); dicatat di ADR-0001. Cara baca diubah oleh ADR-0006: server portal dengan Admin SDK dan refresh 30 detik.

Portal membaca project Firestore yang sama dengan `inztamoto-erp-dashboard` (`inzta-5244e`). Portal tidak menulis ke Firestore sama sekali.

### A-002 — Cara investor melihat penjualan tanpa membaca data mentah
- status: confirmed
- feature: F-006
- raised: 2026-10-21
- resolution: Diputuskan Sehan 2026-10-21 ("ambil sebagian kolom itu aja", "pakai jalan tengah"): server portal membaca `sales` hanya kolom `date`, `revenue`, `sellingPrice`, `quantity`, browser menerima total bulanan saja (ADR-0006). Menggantikan resolusi delegasi sebelumnya (Cloud Function, ADR-0002).

Security Rules Firestore bekerja per dokumen, bukan per field, sehingga `sales` tidak pernah dibuka ke browser investor.

### A-003 — Security Rules Firestore yang berlaku sekarang tidak diketahui
- status: confirmed
- feature: F-006
- raised: 2026-10-21
- resolution: Tidak lagi memblokir (ADR-0006): portal tidak mengubah rules dan tidak memakai akun Firebase untuk investor; Admin SDK di server tidak bergantung pada rules. Isi rules aktif tetap tidak diketahui dan tidak disentuh.

Repo `inztamoto-erp-dashboard` tidak menyimpan `firestore.rules`. Aturan aktif hanya terlihat di Firebase Console; mengubahnya adalah aksi produksi. Tanya Raja: siapa pemegang akses Owner project Firebase, dan boleh-kah rules diekspor ke repo? Tidak memblokir mode mock.

### A-004 — Akun investor bisa masuk ke dasbor internal
- status: confirmed
- feature: F-006
- raised: 2026-10-21
- resolution: Tidak berlaku lagi (ADR-0006): investor tidak dibuatkan akun Firebase Auth, sehingga tidak bisa masuk ke dasbor internal. Celah role fallback di dasbor internal tetap ada untuk akun lain; di luar lingkup portal.

`loadUserProfile` di dasbor internal memberi role fallback "User" kepada akun Firebase Auth mana pun. Akun investor di project Auth yang sama bisa login ke dasbor internal. Perlu perubahan di repo dasbor internal; tanya Raja apakah masuk lingkup proyek ini. Tidak memblokir mode mock.

### A-005 — Format "username" akun investor
- status: confirmed
- feature: F-004
- raised: 2026-10-21
- resolution: Layar masuk memakai field Username dan Kata sandi, dicek server terhadap `INVESTOR_USERNAME` dan hash scrypt `INVESTOR_PASSWORD_HASH` (ADR-0006). Sehan menetapkan username `investor@inzta.id` pada 2026-10-21.

### A-006 — Definisi margin yang ditampilkan
- status: confirmed
- feature: F-003
- raised: 2026-10-21
- resolution: [delegasi] Margin tidak ditampilkan di M1. Perjanjian hanya mengatur laporan hasil penjualan, dan nominal laba membuka struktur biaya Inzta. Bisa ditambah lewat fitur baru bila Raja meminta.

### A-007 — Definisi "hasil penjualan" bulanan
- status: confirmed
- feature: F-002
- raised: 2026-10-21
- resolution: [delegasi] Jumlah `revenue` (cadangan `sellingPrice * quantity`, sama dengan `getSaleRevenue` dasbor internal) per bulan kalender dari `date`, semua kanal. Portal menampilkan 12 bulan terakhir.

### A-008 — Siapa dan di mana pembayaran komisi dan pengembalian dicatat
- status: confirmed
- feature: F-002
- raised: 2026-10-21
- resolution: [delegasi] Admin Inzta mencatat di koleksi `investor_payments` dan `investor_agreement`; halaman input admin di luar lingkup M1. Portal hanya membaca keduanya.

### A-009 — Tanggal Efektif dan nilai ketiga pengembalian
- status: confirmed
- feature: F-002
- raised: 2026-10-21
- resolution: [delegasi] Draf 2026-10-21 menyatakan persentase dan jumlah diisi saat penandatanganan. Nilai disimpan sebagai data admin; portal menampilkan "Belum ditetapkan" selama kosong dan tidak memakai angka bawaan.

### A-010 — Arti "tidak dapat diunduh"
- status: confirmed
- feature: F-003
- raised: 2026-10-21
- resolution: [delegasi] Tanpa ekspor, PDF, atau cetak (CSS print menyembunyikan halaman), tidak bisa di-frame, tidak diindeks. Tangkapan layar tidak bisa dicegah; disampaikan ke klien.

### A-011 — Domain, hosting, dan akun deploy
- status: open
- feature: F-005
- raised: 2026-10-21
- resolution:

Rencana domain `capital.inzta.id`. Tanya Raja: hosting di mana, akun milik siapa, siapa yang mengatur DNS `inzta.id`. Memblokir deploy saja. Pembaruan 2026-10-21: hosting dikerjakan Angkasa, rekan Sehan; DNS `inzta.id` belum diketahui.

### A-012 — Tampilan saat Keadaan Memaksa (Pasal 9)
- status: confirmed
- feature: F-002
- raised: 2026-10-21
- resolution: [delegasi] Tidak ada status khusus di M1; admin menulis keterangan di field `note` pembayaran. Status "Ditangguhkan" sudah ada di sistem desain bila nanti diperlukan.

### A-013 — Arti "bulan pertama setelah Tanggal Efektif"
- status: confirmed
- feature: F-002
- raised: 2026-10-21
- resolution: [delegasi] Bulan ke-n adalah bulan kalender ke-n setelah bulan Tanggal Efektif; komisi bulan ke-n jatuh tempo tanggal 25 sampai 26 bulan itu. Contoh: Tanggal Efektif 10 Nov 2026, komisi pertama 25 sampai 26 Des 2026. Pengembalian ke-1, 2, 3 jatuh tempo bersama komisi bulan ke-16, 20, 24.

Pasal 4 ayat 3 tidak menjelaskan apakah Tanggal Efektif sebelum tanggal 25 membuat komisi pertama jatuh di bulan yang sama. Bila Raja menafsirkan lain, cukup ubah `agreementMonthDate` di `src/lib/investment/calendar.ts` beserta test-nya.

### A-014 — Integrasi Firebase ditahan, portal memakai data mock
- status: rejected
- feature: F-006
- raised: 2026-10-21
- resolution: Dibatalkan Sehan 2026-10-21 ("integrasikan saja langsung", lalu "pastikan tidak ada data mock lagi"). Adaptor mock dihapus di F-006; data contoh hanya ada di `scripts/emulator/`. Sebelumnya: "pakai data mock dulu aja, hold dulu integrasi ke firebase".

### A-015 — Login mode demo selama data mock
- status: rejected
- feature: F-004
- raised: 2026-10-21
- resolution: [delegasi] Selama mode mock, login dicek di server terhadap `DEMO_INVESTOR_USERNAME` dan `DEMO_INVESTOR_PASSWORD`, sesi disimpan di cookie httpOnly bertanda tangan HMAC (`SESSION_SECRET`). Kredensial demo bawaan hanya berlaku di `next dev`. Digantikan F-006 FR-004 (ADR-0006): `DEMO_INVESTOR_*` dihapus, kredensial memakai hash scrypt; akun pengembangan hanya untuk `next dev` tanpa env.

### A-016 — Penyambungan ke Firestore produksi
- status: open
- feature: F-006
- raised: 2026-10-21
- resolution:

Belum dikerjakan agen karena butuh kredensial dan aksi produksi: (1) Sehan membuat kunci service account untuk `inzta-5244e` di Firebase Console (sudah diunduh 2026-10-21), menyimpannya di luar repo, lalu menjalankan `npm run env:setup -- --service-account <berkas>` yang mengisi login, `SESSION_SECRET`, dan kunci di `.env.local`; secret hosting diisi terpisah; (2) username `investor@inzta.id`; (3) admin membuat `investor_agreement/current` dan `investor_payments` di Console sesuai kontrak di F-006 design; (4) hosting A-011. Kata sandi awal pilihan Sehan (11 karakter, pola kata umum ditambah angka) di bawah 12 karakter yang disarankan dan ada di daftar tebakan umum; ganti sebelum portal dibuka di internet. Volume penjualan per hari belum diketahui, jadi beban kuota baca Spark dicek setelah tersambung. Memblokir F-006 T-006 saja.

### A-017 — Project Firebase `inzta-5244e` bukan database dasbor internal
- status: open
- feature: F-006
- raised: 2026-10-21
- resolution:

Pembacaan produksi hanya-baca (izin Sehan 2026-10-21, "boleh baca produksi") ke `inzta-5244e` lewat kunci service account: koleksi `sales` kosong (0 dokumen). Koleksi yang ada: `affiliates` 26, `articles` 3, `commissions` 19, `orders` 55, `products` 32, `settings` 1, `vouchers` 24, pola website toko. Kode `inztamoto-erp-dashboard` memakai `sales`, `stock_movements`, `resellers`, `production`, `payrolls`; project-nya diambil dari env dasbor yang tidak dibaca agen. Perlu dari Sehan: project Firebase dasbor ERP (kunci service account harus dari project itu), dan apakah `orders` website ikut dihitung sebagai hasil penjualan (A-007). Memblokir F-006 T-006; ADR-0001 berasumsi satu database dengan dasbor ERP.
