---
id: F-006
title: "Integrasi Firebase (ditahan)"
type: design
status: draft
tier: lite
owner: "VXerys"
created: 2026-10-21
last_updated: 2026-10-21
last_verified: 2026-10-21
supersedes: null
---

# Design: Integrasi Firebase (ditahan)

Mengikuti ADR-0001, ADR-0002 (Option A), dan ADR-0003: adaptor `src/lib/data/firestore.ts` memetakan `investor_agreement`, `investor_payments`, `investor_monthly_sales` ke `InvestorSnapshot`; Cloud Function memakai `aggregateMonthlySales` dari `src/lib/investment/sales.ts`; Firebase Auth menggantikan ADR-0004. Rancangan rinci ditulis saat klien membuka integrasi.
