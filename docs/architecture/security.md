# Security Baseline

## Security ownership

- Security approver: VXerys
- Incident contact: the security approver until a separate contact is named.
- Data classification owner: VXerys

## Trust boundaries

```text
Investor browser (untrusted)
  -> Firebase Auth (ID token)
  -> Firestore Security Rules (decision point, default deny)
  -> koleksi investor_* saja (ADR-0002)
```

Dasbor internal berbagi project Auth dan Firestore yang sama; karena itu batas kepercayaan portal juga bergantung pada gerbang login dasbor internal (A-004).

## Authentication

Firebase Auth email dan password, satu akun investor, dibuat oleh admin Inzta (A-005). Sesi dikelola Firebase SDK di browser; pencabutan dengan menonaktifkan akun di Firebase Console. Tanpa pendaftaran mandiri dan tanpa reset password mandiri sampai diputuskan.

## Authorization

1. UI visibility is not authorization.
2. Access is enforced at the API, database policy, or trusted service boundary.
3. Default access is deny unless explicitly granted.
4. Ownership and role checks must be testable.

Usulan model role (menunggu A-003): role disimpan sebagai custom claim `role: "investor"` (bukan field yang bisa diubah pengguna). Rules: `investor_*` boleh dibaca role investor dan staf; tulis hanya staf; semua koleksi lain menolak role investor. Dasbor internal menolak login role investor dan akun tanpa profil (A-004, perubahan di repo lain).

## Data classification

| Classification | Examples | Storage | Logging |
|---|---|---|---|
| Public | Firebase web config | bundle klien | allowed |
| Internal | ringkasan penjualan, komisi, pengembalian | Firestore `investor_*` | limited |
| Sensitive | data pelanggan, harga modal, akun investor | Firestore `sales`, Firebase Auth | prohibited or redacted |

## Secret management

- Secrets must use environment or platform secret stores.
- `.env` files with real credentials must not be committed.
- Service-role or administrative credentials must never reach untrusted clients.
- Secret rotation and ownership must be documented.
- Portal tidak memakai service account. Bila Option C ADR-0002 dipilih, kredensial Admin SDK hanya di env server hosting.

## Input and abuse protection

- Validation: portal tidak menerima input selain login; data Firestore divalidasi saat dipetakan ke tipe domain.
- Rate limiting: perlindungan bawaan Firebase Auth terhadap percobaan login berulang.
- Upload: none, portal tidak menerima file.
- Framing dan indexing: header `X-Frame-Options: DENY` dan `X-Robots-Tag: noindex` di `next.config.ts`.

## Security verification

Uji rules di emulator untuk: investor membaca `investor_*` (allow), investor membaca `sales`, `users`, `products` (deny), investor menulis apa pun (deny). Dicatat sebagai evidence di spec F-002. Belum bisa dijalankan sampai rules diekspor ke repo (A-003).
