---
id: F-004
title: "Login mode demo"
type: design
status: implementing
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# Design: Login mode demo

| Path | Isi | FR |
|---|---|---|
| `src/lib/auth/session-token.ts` | `signSession(secret, nowMs)`, `verifySession(token, secret, nowMs)`, format `v1.<expiresMs>.<hex>`; HMAC `node:crypto`, `timingSafeEqual` | FR-002 |
| `src/lib/auth/demo-config.ts` | `readDemoAuthConfig(env, nodeEnv)`, `credentialsMatch()` waktu-konstan | FR-001, FR-005 |
| `src/lib/auth/session.ts` | server: `hasValidSession()`, `requireSession()` (redirect `/masuk`), nama dan opsi cookie | FR-002, FR-003 |
| `src/app/masuk/page.tsx`, `login-form.tsx` | layar masuk, `useActionState` | FR-001 |
| `src/app/masuk/actions.ts` | server action `signIn`, `signOut` | FR-001, FR-004 |
| `src/app/(portal)/layout.tsx` | `await requireSession()` sebelum merender | FR-003 |

## Decisions

- Tanpa dependency baru: `node:crypto` cukup untuk HMAC.
- Gerbang di layout server, bukan `proxy.ts`: hanya satu grup rute dan layout sudah dinamis karena membaca cookie.
- Kredensial dibandingkan setelah di-hash SHA-256 agar panjang berbeda tidak bocor lewat waktu.
- Kredensial demo bawaan hanya bila `NODE_ENV` = `development`; nilainya ditulis di README, bukan rahasia.

## Test plan

Unit: `session-token.test.ts`, `demo-config.test.ts` (AC-003, AC-004, AC-008, AC-009). Runtime: alur masuk, gerbang, keluar di browser pane (AC-001, AC-002, AC-005 sampai AC-007).
