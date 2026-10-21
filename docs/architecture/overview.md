---
id: ARCH
title: "Inzta Investor Portal"
type: architecture-baseline
status: draft
tier: lite
owner: "VXerys"
created: "2026-10-21"
last_updated: "2026-10-21"
last_verified: "2026-10-21"
supersedes: null
---

# Architecture Baseline: Inzta Investor Portal

Cross-feature boundaries and invariants every module obeys, in the lite form of `docs/_templates/architecture-baseline.md`. Module-level reasoning lives in `docs/specs/F-XXX/system-architecture.md`; the stack and commands live in `docs/steering/tech.md`; directory responsibilities live in `docs/steering/structure.md`. Do not repeat them here. Full tier: add the remaining sections of `docs/_templates/architecture-baseline.md` (contracts, persistence, external services, errors, performance, observability, testing, constraints and risks).

## System context

Portal web hanya-baca untuk satu akun investor PT Inzta Gear Indonesia. Portal membaca project Firestore yang sama dengan dasbor internal (ADR-0001). Pencatatan penjualan, produk, produksi, gaji, dan pengguna tetap milik dasbor internal dan di luar batas portal.

| Actor or external system | Relationship | Trust boundary |
|---|---|---|
| Investor (browser) | login, membaca ringkasan | untrusted client; dibatasi Security Rules |
| Firebase Auth (project bersama) | identitas investor | dikelola Google; akun dibuat admin |
| Firestore (project bersama) | sumber data penjualan, komisi, pengembalian | Security Rules adalah titik otorisasi |
| Dasbor internal `inztamoto-erp-dashboard` | penulis koleksi penjualan | aplikasi terpisah; gerbang role belum menolak akun non-staf (A-004) |

```text
investor browser -> Firebase Auth -> Firestore Security Rules -> koleksi yang boleh dibaca investor
admin browser (dasbor internal) -> Firestore (sales, products, ...) -> ringkasan investor (ADR-0002, belum diputuskan)
```

## Components

| Component | Responsibility | Owns | Does not own |
|---|---|---|---|
| `src/app/` | rute, layout, layar baca | tampilan | data, otorisasi |
| `src/lib/firebase/` | inisialisasi Firebase client, listener | koneksi SDK | perhitungan domain |
| `src/lib/money/`, domain di `src/lib/` | format Rupiah, perhitungan jadwal Komisi dan pengembalian | aturan Pasal 4 dan 5 | akses data |

## Boundaries

- B-001: portal hanya membaca. Tidak ada `addDoc`, `setDoc`, `updateDoc`, atau `deleteDoc` ke koleksi dasbor internal; ditegakkan oleh rules role investor dan review.
- B-002: hanya `src/lib/firebase/` yang mengimpor `firebase`; domain menerima data biasa agar teruji tanpa Firestore.
- B-003: investor tidak menerima dokumen `sales` mentah (ADR-0002).

## Dependency direction

```text
ui -> application -> domain <- data
```

`src/app` memanggil `src/lib`; `src/lib/firebase` memetakan dokumen Firestore ke tipe domain sebelum sampai ke UI.

## Data flow and classification

| Data | Owner | Where stored | Sensitivity |
|---|---|---|---|
| Transaksi penjualan (pelanggan, kota, harga modal, reseller) | dasbor internal | `sales` | personal dan internal; tidak untuk investor |
| Ringkasan penjualan bulanan | Inzta | usulan `investor_monthly_sales` (ADR-0002) | internal, boleh dibaca investor |
| Komisi dan pengembalian | Inzta | usulan `investor_payments` (A-008) | internal, boleh dibaca investor |
| Akun investor | Inzta | Firebase Auth | personal |

## State ownership

| State | Owner | Source of truth | Mutation path | Invalidation or sync |
|---|---|---|---|---|
| Penjualan | admin Inzta | `sales` | dasbor internal | listener realtime |
| Ringkasan bulanan | belum diputuskan | ADR-0002 | trigger atau dasbor internal | dihitung ulang tiap perubahan `sales` |
| Pembayaran Komisi dan pengembalian | admin Inzta | usulan `investor_payments` | A-008 | listener realtime |

## Security

Lihat `docs/architecture/security.md`. Default deny; satu role `investor` hanya membaca koleksi `investor_*`.

## Deployment

Belum diputuskan (A-011). Build `next build`; konfigurasi lewat variabel `NEXT_PUBLIC_FIREBASE_*`.

## Decisions and open questions

- ADR-0001 approved: satu Firestore, realtime.
- ADR-0002 review: isolasi data investor.
- Open: A-002 sampai A-012.

## Approval and change rule

Architecture owner: VXerys. Perubahan rules atau koleksi bersama butuh ADR dan persetujuan pemilik project Firebase.
