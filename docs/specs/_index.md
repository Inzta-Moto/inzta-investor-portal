---
id: FEATURE-REGISTRY
title: Feature Registry
status: active
owner: "VXerys"
last_updated: "2026-10-21"
---

# Feature Registry

This file is the durable navigation registry for feature specifications.

Task status belongs in each feature's `tasks.md`; `docs/context/state.yaml` and the context views are rendered from it.

| Feature ID | Feature | Spec path | Product priority | Lifecycle gate | Related milestone |
|---|---|---|---|---|---|
| `F-001` | fondasi proyek | `docs/specs/F-001-fondasi-proyek/` | P0 | implemented | M1 |
| `F-002` | domain investasi dan data mock | `docs/specs/F-002-domain-data-mock/` | P0 | implemented | M1 |
| `F-003` | tampilan portal investor | `docs/specs/F-003-tampilan-portal/` | P0 | implemented | M1 |
| `F-004` | login mode demo | `docs/specs/F-004-login-demo/` | P0 | implemented | M1 |
| `F-005` | rilis produksi `capital.inzta.id` | `docs/specs/F-005-rilis-produksi/` | P1 | draft | M2 |
| `F-006` | integrasi Firestore lewat server | `docs/specs/F-006-integrasi-firebase/` | P0 | approved | M2 |

## Lifecycle gate meaning

- `draft`: specification is being written;
- `review`: awaiting product or architecture review;
- `approved`: contract is approved and may enter execution planning;
- `implemented`: accepted implementation exists;
- `superseded`: replaced by another feature contract.

Do not update this file for every task transition. The context system owns mutable progress.
