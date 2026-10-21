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
| Data store | Firebase Firestore, the project shared with `inztamoto-erp-dashboard` | one database, two web apps, realtime (ADR-0001) |
| Data access | `InvestorDataSource` contract (ADR-0003); mock adapter active, Firestore adapter on hold (A-014, F-006) | pages read `Portfolio` built by `src/lib/investment/` |
| Auth | Demo login: server action + httpOnly HMAC-signed cookie (ADR-0004); Firebase Auth in F-006 | gate in `src/app/(portal)/layout.tsx` |
| Authorization | Firestore Security Rules | current rules unknown (A-003); UI hiding is never authorization |
| Test framework | Node test runner with type stripping (`node --test`) | pure logic in `src/lib/**`; relative imports carry the `.ts` extension; rules tests need the emulator (F-006) |
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
| Data store change check | `none` (no `firestore.rules` in this repository yet, see A-003; the preset's `firebase deploy` is a production action, never a check) |
| Context validation | `npm run context:validate` |
| SDD tooling tests | `npm run test:sdd` |

## Stack rules

- Server Components by default; client components opt in with `'use client'` and stay leaf-sized.
- Secrets are read in server code only; a variable reaches the browser only with the `NEXT_PUBLIC_` prefix. The Firebase web config is public by design; no service account or Admin SDK credential is used by this app.
- `npm run typecheck` at 0 errors and `npm run lint` clean before a task is done. It runs `next typegen` first because `next-env.d.ts` and `.next/types` are generated, not committed.
- Next.js 16 differs from older versions; read the matching guide in `node_modules/next/dist/docs/` before using an unfamiliar API. `agentRules: false` in `next.config.ts` stops `next dev` from appending to the rendered `AGENTS.md`.
- The Firebase app is created lazily in `src/lib/firebase/client.ts`; nothing connects at import time or during `next build`. Nothing calls it while the mock is active.
- Domain code takes "today" as a parameter; pages compute it once with `todayInJakarta()` so the 25th and 26th are counted in WIB.
- Every page shows the "Data contoh" label while `INVESTOR_DATA_SOURCE` is `mock`; sample numbers are never presented as Inzta's.
- Type-only imports use `import type` so `node --test` can strip them.
- Money is whole Rupiah as safe integers, formatted through `src/lib/money/rupiah.ts`, shown with the `tabular` utility.

## Environment and secrets

- Secrets come from the environment or a secret manager; `.env*`, key files, and store credentials are never read, printed, or committed by an agent.
- `.env.example` lists `INVESTOR_DATA_SOURCE`, `DEMO_INVESTOR_USERNAME`, `DEMO_INVESTOR_PASSWORD`, `SESSION_SECRET`, and the four `NEXT_PUBLIC_FIREBASE_*` variables without values. The owner fills `.env.local`.
- `next dev` falls back to the demo account documented in README only when the three login variables are all empty; production builds never do.

## Dependency policy

Before adding or replacing a dependency, state the problem it solves, the native alternative considered, maintenance health, runtime or bundle impact, and license. Approval rule: the owner approves every new or replaced dependency; record the approval in the task that adds it. `firebase` was added in F-001 at the owner's request (data layer of ADR-0001).

## Data store changes

Rules and index changes are versioned files in the repository, reviewed like code, tested in the emulator before deploy. Deploying rules, indexes, or functions to the shared project is a production action that affects the internal dashboard and needs the owner's explicit approval each time. The store's own rules are in `docs/steering/database.md`; the procedure is `docs/runbooks/database-migrations.md`.
