---
id: F-010
title: "Form isi perjanjian di ERP"
type: design
status: draft
tier: lite
owner: "VXerys"
created: 2026-10-22
last_updated: 2026-10-22
last_verified: 2026-10-22
supersedes: null
---

# Design: Form isi perjanjian di ERP

- ERP `public/legacy/app-runtime.js`: kartu Perjanjian di halaman Investor mendapat tombol "Ubah isi perjanjian" yang membuka modal berisi semua isian AC-001. Simpan memakai `set(..., { merge: true })` ke `investor_agreement/current`.
- Field mengikuti `docs/architecture/data-model.md`: `totalInvestment`, `commissionRateBasisPoints`, `termMonths`, `tranches[{ amount, receivedDate }]`, `repayments[{ dueMonth, percentBasisPoints }]`.
- Portal tidak berubah: `toAgreement` sudah membaca semua field itu.
- Bila F-011 dikerjakan lebih dulu, form ini menjadi bagian detail per investor.
