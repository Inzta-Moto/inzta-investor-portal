---
inclusion: always          # always | fileMatch | manual
---

# Tech

Stack and commands. `npm run init` filled the preset values; everything else comes from the real repository. A command listed here must exist and run. The web stack mirrors `fluxa-web` and `bookmate-web` (same Next.js, React, Tailwind, ESLint, and test runner versions).

## Stack

| Concern | Technology | Reason or constraint |
|---|---|---|
| Language and runtime | TypeScript 5 on Node 22+ (developed on Node 24) | `"type": "module"` so `node --test` loads `.ts` with type stripping |
| Application framework | Next.js 16.4 (App Router, Turbopack), React 19.3 | Server Components by default |
| Styling | Tailwind CSS v4 through `@tailwindcss/turbopack` | tokens from `docs/design/design-system.html` in `@theme` of `src/app/globals.css`: white base, Inzta charcoal, Inzta orange accent, no pale yellow |
| Data store | Firebase Firestore, project `inzta-5244e` shared with `inztamoto-erp-dashboard` (Spark plan) | one database, two web apps (ADR-0001); the daily read quota is shared with the internal dashboard |
| Data access | Firebase Admin SDK (`firebase-admin` 14) on the server only, behind `InvestorDataSource` (ADR-0003, ADR-0006) | `sales` is read with `select(date, revenue, sellingPrice, quantity)`; the browser receives monthly totals only |
| Auth | Portal-owned username and scrypt password hash from the server env, httpOnly HMAC-signed cookie (ADR-0004, ADR-0006) | the investor has no Firebase Auth account; gate at the data access point in `src/app/(portal)/portfolio.tsx` |
| Authorization | Session check on the server; the Admin SDK bypasses Firestore Security Rules, so the field projection in `firestore-source.ts` is the data boundary | rules of the shared project are unchanged (A-003); UI hiding is never authorization |
| Test framework | Node test runner with type stripping (`node --test`); Firestore emulator for `*.itest.ts` | pure logic in `src/lib/**`; relative imports carry the `.ts` extension; the emulator needs Java 21 (`JAVA_HOME`) |
| Deployment target | not decided; planned domain `capital.inzta.id` | A-011 |
| Source and test paths | `src/**`, `public/**` | globs used by `fileMatch` steering rules |

## Commands

Run these before claiming any task done. Report a command that cannot run; never claim its success. `none` means the project has no command for that purpose yet.

| Purpose | Command |
|---|---|
| Install | `npm ci` |
| Analyze or lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Format check | `none` |
| Test | `npm test` |
| Build | `npm run build` |
| Run locally | `npm run dev` (port 3300) |
| Data store change check | `none` (the portal changes no rules or indexes, see A-003; `firebase deploy` is a production action, never a check) |
| Data integration test | `npm run test:emulator` (starts the Firestore emulator for project `demo-inzta`) |
| Context validation | `npm run context:validate` |
| SDD tooling tests | `npm run test:sdd` |

## Stack rules

- Server Components by default; client components opt in with `'use client'` and stay leaf-sized.
- Secrets are read in server code only; a variable reaches the browser only with the `NEXT_PUBLIC_` prefix. The app has no `NEXT_PUBLIC_` variables. The Firebase service account (`FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) is created by the owner and lives only in the server environment (ADR-0006).
- `npm run typecheck` at 0 errors and `npm run lint` clean before a task is done. It runs `next typegen` first because `next-env.d.ts` and `.next/types` are generated, not committed.
- Next.js 16 differs from older versions; read the matching guide in `node_modules/next/dist/docs/` before using an unfamiliar API. `agentRules: false` in `next.config.ts` stops `next dev` from appending to the rendered `AGENTS.md`.
- The Admin app is created lazily in `adminDb()` (`src/lib/data/firestore-source.ts`); nothing connects at import time or during `next build`. `FIRESTORE_EMULATOR_HOST` switches it to the emulator, and scripts that write data refuse to run without it.
- Firestore reads are budgeted: sales dated yesterday or later are cached 25 seconds, older days one hour, agreement and payments 25 seconds; pages refresh every 30 seconds only while visible and used in the last 15 minutes (ADR-0006).
- Domain code takes "today" as a parameter; pages compute it once with `todayInJakarta()` so the 25th and 26th are counted in WIB.
- There is no mock data in the app. Sample data exists only in `scripts/emulator/fixtures.mjs` for the local emulator.
- Type-only imports use `import type` so `node --test` can strip them.
- Money is whole Rupiah as safe integers, formatted through `src/lib/money/rupiah.ts`, shown with the `tabular` utility.

## Environment and secrets

- Secrets come from the environment or a secret manager; `.env*`, key files, and store credentials are never read, printed, or committed by an agent.
- `.env.example` lists `INVESTOR_USERNAME`, `INVESTOR_PASSWORD_HASH`, `SESSION_SECRET`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, and `FIRESTORE_EMULATOR_HOST` without values. The owner fills `.env.local` and the hosting secrets.
- `npm run env:setup` writes `.env.local` (login, session secret, project id, service account from a key file kept outside the repository) without printing values; agents never run it against the owner's file. `INVESTOR_PASSWORD_HASH` uses `scrypt:N:r:p:salt:hash` because the Next.js env loader expands `$` in `.env` files. Changing it signs out every device.
- `next dev` falls back to the development account documented in README only when the three login variables are all empty; production builds never do.

## Dependency policy

Before adding or replacing a dependency, state the problem it solves, the native alternative considered, maintenance health, runtime or bundle impact, and license. Approval rule: the owner approves every new or replaced dependency; record the approval in the task that adds it. `firebase-admin` replaced `firebase` in F-006 when the owner chose the server-side read ("pakai jalan tengah", 2026-10-21, ADR-0006). `firebase-tools` is used through `npx` for the emulator and is not a dependency.

## Data store changes

Rules and index changes are versioned files in the repository, reviewed like code, tested in the emulator before deploy. Deploying rules, indexes, or functions to the shared project is a production action that affects the internal dashboard and needs the owner's explicit approval each time. The store's own rules are in `docs/steering/database.md`; the procedure is `docs/runbooks/database-migrations.md`.
