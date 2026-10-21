---
inclusion: always          # always | fileMatch | manual
---

# Tech

Stack and commands. `npm run init` fills every `PRESET_` placeholder from the chosen app and database presets (`scripts/init/presets/`); everything else is filled from the real repository. A command listed here must exist and run.

## Stack

| Concern | Technology | Reason or constraint |
|---|---|---|
| Language and runtime | TypeScript on Node 22 | |
| Application framework | Next.js | |
| Data store | Firebase (Firestore) | relational, document, key-value, embedded local, file, or none |
| Source and test paths | `src/**`, `public/**` | globs used by `fileMatch` steering rules |

Add rows for the backend or API, auth, state management, build tooling, test framework, and deployment target once they are decided. A row that does not apply says `none`, not an invented value. Mobile (Flutter, Kotlin, React Native) and non-relational stores are first-class here.

## Commands

Run these before claiming any task done. Report a command that cannot run; never claim its success. `none` means the preset has no command for that purpose; replace it when the project gains one.

| Purpose | Command |
|---|---|
| Install | `npm ci` |
| Analyze or lint | `npm run lint` |
| Typecheck | `npx tsc --noEmit` |
| Format check | `npx prettier --check .` |
| Test | `npm test` |
| Build | `npm run build` |
| Run locally | `npm run dev` |
| Data store change check | `firebase deploy --only firestore:rules,firestore:indexes` |
| Context validation | `npm run context:validate` |

## Stack rules

- Server Components by default; client components opt in with `'use client'` and stay leaf-sized.
- Secrets are read in server code only; a variable reaches the browser only with the `NEXT_PUBLIC_` prefix.
- Route handlers validate every request body at the boundary and return typed errors.
- `npx tsc --noEmit` at 0 errors and `npm run lint` clean before a task is done.

## Environment and secrets

- Secrets come from the environment or a secret manager; `.env*`, key files, and store credentials are never read, printed, or committed by an agent.
- Example-config files (`.env.example` or equivalent) document required variables without values.

## Dependency policy

Before adding or replacing a dependency, state the problem it solves, the native alternative considered, maintenance health, runtime or bundle impact, and license. Approval rule: the owner approves every new or replaced dependency; record the approval in the task that adds it.

## Data store changes

Schema, rules, index, or migration changes are versioned files in the repository, reviewed like code. Append-only; destructive changes need explicit approval. The store's own rules are in the `database.md` steering file when a database preset was chosen. The full procedure is `docs/runbooks/database-migrations.md` (full tier).
