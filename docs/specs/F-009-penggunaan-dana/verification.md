---
id: F-009
title: "Penggunaan dana investasi"
type: verification
status: verification
tier: lite
owner: "VXerys"
created: 2026-10-22
last_updated: 2026-10-22
last_verified: 2026-10-22
requirements: [FR-001, FR-002, FR-003]
supersedes: null
---

# Verification: Penggunaan dana investasi

## Evidence

### EV-001 — Unit, emulator, typecheck, lint, build
- command: `npm test`, `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node --test "src/**/*.itest.ts"`, `npm run typecheck`, `npm run lint`, `npm run build`
- output:
  ```text
  tests 58 pass: urutan terbaru per bulan; kategori apa adanya; dokumen bertanda rusak dilewati
  emulator 10 pass: hanya 2 dari 3 belanja (yang bertanda) terbaca, hanya enam kolom, catatan "Toko A, transfer" tidak sampai; tanda dibatalkan hilang setelah cache 25 detik
  typecheck 0 error, eslint bersih, build menghasilkan rute /penggunaan-dana
  ```
- date: 2026-10-22
- commit: 215394e
- covers: [AC-005, AC-007, AC-008, AC-009, AC-010]

### EV-002 — Browser 320 px dan 1280 px (emulator, `next start`)
- command: preview `inzta-investor-portal-emulator`, buka menu Penggunaan Dana
- output:
  ```text
  320 px: Oktober 2026 "Kain canvas Rp310.000, 3 Okt 2026 · bahan · 10 meter"; halaman 1 dari 2; tanpa total; tanpa scroll horizontal;
          menu bawah lima tab, "Pengem-balian" dan "Penggu-naan Dana" tidak terpotong
  1280 px: tabel Tanggal | Barang | Kategori | Jumlah | Nominal; September 2026 "Listrik | Operasional | 1 pcs | Rp300.000"
  HTML halaman tidak memuat "Bisban" (belanja tanpa tanda) maupun catatan belanja
  ```
- date: 2026-10-22
- commit: 215394e
- covers: [AC-005, AC-006, AC-009]

### EV-003 — ERP (halaman uji lokal dengan Firestore tiruan)
- command: kode Investor dan `purchaseFormHTML` dari `inztamoto-erp-dashboard/public/legacy/app-runtime.js` di halaman uji dengan CSS dasbor; `npm run build` di ERP
- output:
  ```text
  centang Listrik: update production_purchases/pp1 {investorAgreementId:"current", investorMarkedAt, investorMarkedBy}
  batal centang: tiga field dihapus (FieldValue.delete); belanja closed tetap bisa ditandai, hanya field tanda yang berubah
  belanja 28 Sep sebelum Tanggal Efektif 1 Okt: toast peringatan, tetap ditandai
  form belanja: centang tampil untuk admin, tidak untuk warehouse; nama barang ber-HTML di-escape; build ERP sukses
  ```
- date: 2026-10-22
- commit: inztamoto-erp-dashboard feat/investor-fund-usage
- covers: [AC-001, AC-002, AC-003, AC-004]

Belum diuji: alur penuh di produksi (admin menandai di dasbor asli, lalu daftar muncul di `capital.inzta.id`).
