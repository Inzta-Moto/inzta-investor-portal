# Portal Investor Inzta Gear

Portal web hanya-baca untuk investor PT Inzta Gear Indonesia: hasil penjualan bulanan InztaMoto, rekap komisi (Rp6.400.000 per bulan selama 24 bulan), dan progres pengembalian dana (bulan ke-16, 20, 24). Rencana domain `capital.inzta.id`. Dirancang untuk HP terlebih dulu.

Status: membaca Firestore asli lewat server (ADR-0006), tanpa data mock. Tersambung ke database dasbor ERP (project `database-inzta`). Sebelum dokumen perjanjian diisi admin, portal memakai ketentuan draf perjanjian dan menampilkan "Perjanjian belum aktif" (A-016).

## Cara kerja data

- Server portal membaca Firestore dengan Firebase Admin SDK. Koleksi `sales` hanya dibaca kolom `date`, `revenue`, `sellingPrice`, `quantity`; browser menerima total bulanan saja.
- `investor_agreement/current` dan `investor_payments` diisi admin Inzta lewat Firebase Console (kontrak di `docs/specs/F-006-integrasi-firebase/design.md`). Portal tidak menulis apa pun ke Firestore.
- Halaman memperbarui diri tiap 30 detik selama dibuka dan dipakai; penjualan sejak kemarin di-cache 25 detik, hari yang lebih lama 1 jam, untuk menjaga kuota baca yang dipakai bersama dasbor internal.
- Investor tidak punya akun Firebase. Login memakai username dan hash kata sandi di env server.

## Menjalankan dengan emulator (tanpa menyentuh produksi)

Butuh Java 21 (`JAVA_HOME`). Terminal 1:

```bash
npm run emulator:start
```

Terminal 2, isi data contoh lalu jalankan portal:

```bash
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run emulator:seed
```

```bash
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run dev
```

Buka http://localhost:3300. Di `npm run dev`, bila ketiga variabel login kosong, akun pengembangan `investor` / `inzta-demo-2026` berlaku (tidak pernah di build produksi). Data contoh hanya ada di emulator (`scripts/emulator/fixtures.mjs`).

## Variabel lingkungan

Cara termudah mengisi `.env.local`: simpan kunci service account (JSON dari Firebase Console, Project settings, Service accounts) **di luar folder proyek**, lalu jalankan:

```bash
npm run env:setup -- --service-account D:/keys/database-inzta-admin.json
```

Skrip menanyakan username dan kata sandi, menulis hash, membuat `SESSION_SECRET`, mengisi kunci service account, dan tidak pernah menampilkan nilainya. Daftar variabel ada di `.env.example`; untuk hosting, isi variabel yang sama di secret hosting.

| Variabel | Isi |
|---|---|
| `INVESTOR_USERNAME` | username investor, misalnya `investor@inzta.id` |
| `INVESTOR_PASSWORD_HASH` | dibuat `npm run env:setup` atau `npm run auth:hash-password`, format `scrypt:...` (kata sandi tidak disimpan) |
| `SESSION_SECRET` | minimal 32 karakter acak |
| `FIREBASE_PROJECT_ID` | `database-inzta` (diisi otomatis dari berkas kunci) |
| `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | dari kunci service account yang dibuat di Firebase Console, Project settings, Service accounts |
| `FIRESTORE_EMULATOR_HOST` | hanya untuk lokal; bila diisi, portal membaca emulator |

Mengganti `INVESTOR_PASSWORD_HASH` atau `INVESTOR_USERNAME` mengeluarkan semua perangkat yang sedang masuk.

## Perintah

| Tujuan | Perintah |
|---|---|
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Test | `npm test` |
| Test integrasi Firestore (emulator) | `npm run test:emulator` |
| Build | `npm run build` |
| Isi `.env.local` | `npm run env:setup` |
| Hash kata sandi investor | `npm run auth:hash-password` |
| Validasi konteks SDD | `npm run context:validate` |
| Test tooling SDD | `npm run test:sdd` |

## Struktur

| Path | Isi |
|---|---|
| `src/app/(portal)/` | Ringkasan, Penjualan, Komisi, Pengembalian; cek sesi di `portfolio.tsx` |
| `src/app/masuk/` | layar masuk dan server action |
| `src/components/portal/` | kerangka, tampilan halaman, kartu, grafik, jadwal, pembaruan otomatis |
| `src/lib/investment/` | aturan komisi, pengembalian, penjualan (murni, teruji) |
| `src/lib/data/` | adaptor Firestore (Admin SDK), validasi dokumen, cache |
| `src/lib/auth/` | kredensial scrypt, sesi bertanda tangan, pembatas percobaan |
| `scripts/emulator/`, `scripts/auth/`, `scripts/env/` | data contoh emulator, pembuat hash kata sandi, pengisi `.env.local` |
| `docs/design/` | sistem desain dan prototipe HTML |
| `docs/` | PRD, spec F-001 sampai F-006, ADR, asumsi; mulai dari `docs/context/BRIEF.md` |

## Cara kerja dokumen

Proyek memakai template spec-driven development v2.0.0: aturan di `docs/steering/`, spec per fitur di `docs/specs/`, status tugas di `tasks.md`, tampilan konteks dirender dengan `npm run context:render`. Penjelasan lengkap: `docs/automation/README.md` dan `docs/context/CONTEXT_SYSTEM.md`.
