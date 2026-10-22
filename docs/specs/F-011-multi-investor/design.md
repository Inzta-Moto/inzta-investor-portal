---
id: F-011
title: "Banyak investor"
type: design
status: draft
tier: lite
owner: "VXerys"
created: 2026-10-22
last_updated: 2026-10-22
last_verified: 2026-10-22
supersedes: null
---

# Design: Banyak investor

Butuh ADR baru yang menggantikan bagian login ADR-0006 sebelum dikerjakan.

- Data: `investor_agreements/{agreementId}` menggantikan `investor_agreement/current`; dokumen lama dipindah dengan id `current`, sehingga penanda belanja ADR-0007 tetap berlaku. `investor_payments` mendapat `agreementId`. `investor_accounts/{username}` berisi hash scrypt, `agreementId`, dan status aktif, ditulis dari ERP.
- Login portal: kredensial dibaca dari `investor_accounts`, bukan env; cookie sesi membawa `agreementId` dan ditandatangani seperti sekarang. Pembatas percobaan login tetap.
- Data source: semua kueri difilter `agreementId` dari sesi; cache dipisah per perjanjian.
- ERP: halaman Investor menjadi daftar dan detail; centang penggunaan dana menjadi pilihan investor.
- Migrasi: skrip sekali jalan, dengan ekspor dan persetujuan Sehan sebelum menyentuh produksi.
