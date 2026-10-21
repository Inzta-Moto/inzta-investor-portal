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
| Styling | Tailwind CSS v4 through `@tailwindcss/turbopack` | provisional tokens in `@theme` in `src/app/globals.css`; visual direction not decided |
| Data store | Firebase Firestore, the project shared with `inztamoto-erp-dashboard` | one database, two web apps, realtime (ADR-0001) |
| Data access | Firebase JS SDK 13 (modular), browser listeners | isolation model pending (ADR-0002, A-002) |
| Auth | Firebase Auth, one investor account | account format pending (A-005); internal dashboard gate pending (A-004) |
| Authorization | Firestore Security Rules | current rules unknown (A-003); UI hiding is never authorization |
| Test framework | Node test runner with type stripping (`node --test`) | pure logic only; rules tests need the emulator (A-003) |
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
- The Firebase app is created lazily in `src/lib/firebase/client.ts`; nothing connects at import time or during `next build`.
- Money is whole Rupiah as safe integers, formatted through `src/lib/money/rupiah.ts`, shown with the `tabular` utility.

## Environment and secrets

- Secrets come from the environment or a secret manager; `.env*`, key files, and store credentials are never read, printed, or committed by an agent.
- `.env.example` documents the four `NEXT_PUBLIC_FIREBASE_*` variables without values. The owner fills `.env.local`.

## Dependency policy

Before adding or replacing a dependency, state the problem it solves, the native alternative considered, maintenance health, runtime or bundle impact, and license. Approval rule: the owner approves every new or replaced dependency; record the approval in the task that adds it. `firebase` was added in F-001 at the owner's request (data layer of ADR-0001).

## Data store changes

Rules and index changes are versioned files in the repository, reviewed like code, tested in the emulator before deploy. Deploying rules, indexes, or functions to the shared project is a production action that affects the internal dashboard and needs the owner's explicit approval each time. The store's own rules are in `docs/steering/database.md`; the procedure is `docs/runbooks/database-migrations.md`.
