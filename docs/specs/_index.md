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
| `F-001` | fondasi proyek | `docs/specs/F-001-fondasi-proyek/` | P0 | approved | M1 |
| `F-002` | akun investor dan gerbang role | belum dibuat | P0 | draft | M1 |
| `F-003` | laporan penjualan bulanan | belum dibuat | P0 | draft | M1 |
| `F-004` | komisi dan pengembalian dana | belum dibuat | P0 | draft | M2 |
| `F-005` | rilis produksi `capital.inzta.id` | belum dibuat | P1 | draft | M2 |

## Lifecycle gate meaning

- `draft`: specification is being written;
- `review`: awaiting product or architecture review;
- `approved`: contract is approved and may enter execution planning;
- `implemented`: accepted implementation exists;
- `superseded`: replaced by another feature contract.

Do not update this file for every task transition. The context system owns mutable progress.
