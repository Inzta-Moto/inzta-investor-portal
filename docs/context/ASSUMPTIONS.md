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

Sumber: VN Raja Purnama 2026-10-20, draf Perjanjian Kerja Sama Investasi, dan revisi Sehan 2026-10-21 (komisi flat Rp6.400.000, nominal pengembalian diinput admin, dasbor bukan kewajiban kontrak). Pertanyaan untuk Raja atau PT Inzta Gear Indonesia ditandai "Tanya:".

### A-001 — Satu database Firestore dengan dasbor internal, data realtime
- status: confirmed
- feature: F-001
- raised: 2026-10-21
- resolution: Dikonfirmasi Sehan 2026-10-21 ("1 database 2 web agar realtime"); dicatat di ADR-0001.

Portal membaca project Firestore yang sama dengan `inztamoto-erp-dashboard` lewat Firebase client SDK dengan listener realtime. Portal tidak menulis ke koleksi milik dasbor internal.

### A-002 — Cara investor melihat penjualan tanpa membaca data mentah
- status: open
- feature: F-003
- raised: 2026-10-21
- resolution:

Security Rules Firestore bekerja per dokumen, bukan per field. Bila akun investor diberi akses baca ke `sales`, investor bisa membaca seluruh field lewat devtools (nama pelanggan, kota, harga modal, reseller), melanggar kebutuhan "tidak bisa akses data mentah". Opsi di ADR-0002 (status proposed). Memblokir F-003 dan F-004.

### A-003 — Security Rules Firestore yang berlaku sekarang tidak diketahui
- status: open
- feature: F-002
- raised: 2026-10-21
- resolution:

Repo `inztamoto-erp-dashboard` tidak menyimpan `firestore.rules`. Aturan aktif hanya terlihat di Firebase Console. Mengubahnya adalah aksi produksi yang juga memengaruhi dasbor internal. Tanya: siapa pemegang akses Owner project Firebase, dan boleh-kah rules diekspor ke repo lalu dikelola sebagai kode?

### A-004 — Akun investor bisa masuk ke dasbor internal
- status: open
- feature: F-002
- raised: 2026-10-21
- resolution:

`loadUserProfile` di dasbor internal memberi role fallback "User" kepada akun Firebase Auth mana pun yang tidak punya dokumen di `users`, lalu `enterApp()` tetap jalan. Bila akun investor dibuat di project Auth yang sama, investor bisa login ke dasbor internal. Perlu perubahan di repo dasbor internal (tolak role `investor` dan akun tanpa profil) serta rules berbasis role. Di luar repo ini; Tanya: masuk lingkup proyek ini atau terpisah?

### A-005 — Format "username" akun investor
- status: open
- feature: F-002
- raised: 2026-10-21
- resolution:

VN menyebut username dan password; Firebase Auth email/password memakai email. Usulan: investor login dengan username yang dipetakan ke email sintetis di domain Inzta, atau langsung memakai email investor. Tanya: pilih yang mana, dan siapa yang membuat serta menyerahkan kredensial?

### A-006 — Definisi margin yang ditampilkan
- status: open
- feature: F-003
- raised: 2026-10-21
- resolution:

VN meminta penjualan dan margin; perjanjian tidak mengatur isi dasbor. Dasbor internal punya dua angka: margin kotor (jumlah `sales.profit` dibagi omzet) dan laba bersih (dikurangi belanja produksi dan gaji). Tanya: tampilkan margin atau tidak, dan bila ya, margin kotor dalam persen saja atau nominal juga? Menampilkan nominal laba membuka struktur biaya Inzta.

### A-007 — Definisi "hasil penjualan" bulanan
- status: open
- feature: F-003
- raised: 2026-10-21
- resolution:

Usulan: jumlah `revenue` (fallback `sellingPrice * quantity`, sama seperti `getSaleRevenue` dasbor internal) dari dokumen `sales` dengan `date` di bulan tersebut, semua channel. Tanya: semua channel dihitung, dan apakah ditampilkan sejak Tanggal Efektif saja atau termasuk riwayat sebelumnya?

### A-008 — Siapa dan di mana pembayaran komisi dan pengembalian dicatat
- status: open
- feature: F-004
- raised: 2026-10-21
- resolution:

Data ini belum ada di Firestore. Usulan desain koleksi di `docs/architecture/data-model.md`. Tanya: admin Inzta mencatat lewat halaman baru di dasbor internal (perubahan di repo lain), lewat halaman admin di portal ini, atau sementara lewat Firebase Console?

### A-009 — Tanggal Efektif dan nilai ketiga pengembalian
- status: open
- feature: F-004
- raised: 2026-10-21
- resolution:

Tanggal Efektif dan persentase atau nominal ketiga pengembalian (bulan ke-16, 20, 24) ditulis tangan di perjanjian, totalnya 100% dari Rp200.000.000. Admin menginputnya; portal menampilkan "belum ditetapkan" sampai diisi. Tidak ada nilai bawaan, termasuk pengembalian ke-1. Tidak memblokir pembangunan, memblokir data produksi.

### A-010 — Arti "tidak dapat diunduh"
- status: open
- feature: F-003
- raised: 2026-10-21
- resolution:

Portal tidak menyediakan ekspor, PDF, atau cetak (cetak disembunyikan lewat CSS). Browser tidak bisa mencegah tangkapan layar atau salin teks sepenuhnya. Tanya: cukup dengan batasan ini?

### A-011 — Domain, hosting, dan akun deploy
- status: open
- feature: F-005
- raised: 2026-10-21
- resolution:

Rencana domain `capital.inzta.id`. Tanya: hosting di Vercel atau lainnya, akun milik siapa, dan siapa yang mengatur DNS `inzta.id`? Memblokir deploy saja.

### A-012 — Tampilan saat Keadaan Memaksa (Pasal 9)
- status: open
- feature: F-004
- raised: 2026-10-21
- resolution:

Draf perjanjian mengatur penangguhan kewajiban selama masa pemulihan. Tanya: perlu status "ditangguhkan" pada jadwal komisi dan pengembalian, atau cukup dicatat admin sebagai catatan? Tidak memblokir.
