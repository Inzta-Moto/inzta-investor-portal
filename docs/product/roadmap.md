---
id: PRODUCT-ROADMAP
title: Product Roadmap
status: draft
owner: "VXerys"
last_updated: "2026-10-21"
---

# Product Roadmap

Strategic capability order, release intent, and dependency rationale. Not the execution board: task status belongs in each feature's `tasks.md`, and the context views are rendered from it.

## Releases and milestones

### M1 — Portal lengkap dengan data mock

- Outcome: klien bisa meninjau seluruh portal (Ringkasan, Penjualan, Komisi, Pengembalian, Masuk) di HP dan desktop dengan data contoh berlabel.
- Capabilities: F-001 fondasi; F-002 domain dan data mock; F-003 tampilan portal; F-004 login mode demo.
- Dependencies: tidak ada; Firebase ditahan klien (A-014).
- Excluded: data nyata, Firebase Auth, deploy.
- Exit criteria: lint, typecheck, test, build, validasi konteks hijau; pemeriksaan 360 px dan 1366 px.

### M2 — Data nyata dan rilis

- Outcome: portal membaca Firestore bersama secara realtime dan hidup di `capital.inzta.id`.
- Capabilities: F-006 integrasi Firestore lewat server; F-005 rilis produksi.
- Dependencies: A-016 (kunci service account, env, dokumen perjanjian di produksi), A-011.
- Excluded: ekspor, notifikasi, akun investor kedua.
- Exit criteria: Komisi 24 x Rp6.400.000 dan pengembalian dari input admin teruji; deploy disetujui pemilik.

## Capability ordering

| Capability | Why now | Depends on | Intended milestone |
|---|---|---|---|
| F-001 fondasi proyek | prasyarat semua fitur | none | M1 |
| F-002 domain dan data mock | aturan uang teruji tanpa Firebase | F-001 | M1 |
| F-003 tampilan portal | kebutuhan utama investor (VN Raja), kartu sudah masuk | F-002 | M1 |
| F-004 login mode demo | pratinjau tidak terbuka bebas | F-001 | M1 |
| F-006 integrasi Firestore lewat server | data nyata, pembaruan otomatis | A-016 | M2 |
| F-005 rilis produksi | investor butuh URL tetap | F-006, A-011 | M2 |

## Roadmap changes

Material priority or scope changes with date and rationale. Task progress is never copied here.

| Date | Change | Rationale | Approved by |
|---|---|---|---|
| 2026-10-21 | roadmap awal | VN Raja 2026-10-20 dan draf perjanjian | belum disetujui |
| 2026-10-21 | Komisi flat Rp6.400.000 sejak bulan 1; nominal pengembalian diinput admin; dasbor bukan kewajiban kontrak | revisi aturan dari Sehan | Sehan |
| 2026-10-21 | M1 memakai data mock; integrasi Firebase pindah ke M2 (F-006); fitur disusun ulang menjadi F-002 domain, F-003 tampilan, F-004 login demo | permintaan klien "pakai data mock dulu" | Sehan, lewat klien |
| 2026-10-21 | Integrasi Firestore dibuka dan mock dihapus; server membaca `sales` empat kolom, tanpa Cloud Function dan tanpa akun Firebase untuk investor (ADR-0006) | "integrasikan saja langsung", "pastikan tidak ada data mock lagi", "pakai jalan tengah" | Sehan |
