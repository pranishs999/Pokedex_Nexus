# Requirement Traceability Matrix

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-TM-002 |
| Document Name | Requirement Traceability Matrix |
| Version | 1.0.0 |
| Status | Draft |
| Documentation Standard | IEEE 29148 |
| Author | Project Owner |
| Last Updated | TBD |

---

# Revision History

| Version | Date | Author | Description |
|----------|------|--------|-------------|
| 1.0.0 | TBD | Project Owner | Initial version |

---

# Table of Contents

1. Purpose and Scope
2. Traceability Mapping Matrix
3. References

---

# 1. Purpose and Scope

This Requirement Traceability Matrix document maps every business, functional, and non-functional requirement of the Pokémon Knowledge Management Platform (PKMP) v1.0.0 to its implementing component in the codebase and its corresponding verification test file. This ensures completeness and verifiability of all requirements.

---

# 2. Traceability Mapping Matrix

| Req ID | Title | Implementing Component | Verification / Test File |
|--------|-------|------------------------|--------------------------|
| **REQ-BUS-001**| Portfolio Demo | Whole Repository, docs/ | Manual Inspection |
| **REQ-BUS-002**| Non-Commercial Status | Footer navigation component | Manual Inspection |
| **REQ-BUS-003**| Data Separation | `pokemon.source_type` DB schema column | `tests/import-pipeline.spec.ts` |
| **REQ-BUS-004**| Operational Independence| `/apps/api`, Prisma ORM | `tests/db-connections.spec.ts` |
| **REQ-FUN-100**| National Pokédex Browse | `/apps/web/routes/pokemon/index.tsx` | `tests/e2e/pokedex-browse.spec.ts` |
| **REQ-FUN-101**| Pokémon Detail View | `/apps/web/routes/pokemon/$id.tsx` | `tests/e2e/pokemon-detail.spec.ts` |
| **REQ-FUN-103**| 3D Asset Loader | `/apps/web/components/Model3D.tsx` | `tests/components/model3d.spec.tsx` |
| **REQ-FUN-200**| Keyword Search | `/apps/api/src/search/` | `apps/api/src/search/search.service.spec.ts` |
| **REQ-FUN-203**| Natural Language Parse | `/apps/api/src/search/parser/` | `apps/api/src/search/parser.spec.ts` |
| **REQ-FUN-301**| Living Dex Tracker | `/apps/web/routes/collections/index.tsx` | `tests/e2e/living-dex.spec.ts` |
| **REQ-FUN-303**| Team Builder Workspace | `/apps/web/routes/teams/index.tsx` | `tests/e2e/team-builder.spec.ts` |
| **REQ-FUN-401**| Secure Session Login | `/apps/api/src/auth/` | `apps/api/src/auth/auth.service.spec.ts` |
| **REQ-FUN-402**| Token Rotation Sync | `/apps/api/src/auth/guards/` | `apps/api/src/auth/auth.controller.spec.ts` |
| **REQ-FUN-500**| JSON Schema Validation | `/apps/api/src/import/validation/`| `apps/api/src/import/validation.spec.ts` |
| **REQ-FUN-503**| Database Rollback | `/apps/api/src/import/import.service.ts`| `apps/api/src/import/rollback.spec.ts` |
| **REQ-FUN-602**| Activity Audit Log | `/apps/api/src/audit/` | `apps/api/src/audit/audit.service.spec.ts` |
| **REQ-NFR-100**| Initial Page Load | `apps/web/vite.config.ts` (bundler configs)| Lighthouse Performance Audit |
| **REQ-NFR-101**| API Response Latency | `@nestjs/throttler`, Prisma indexing | `tests/performance/load-test.spec.ts` |
| **REQ-NFR-201**| Password Hashing | `apps/api/src/auth/auth.service.ts` | `apps/api/src/auth/password.spec.ts` |
| **REQ-NFR-300**| WCAG 2.2 Compliance | `/apps/web/` semantic HTML structure | Lighthouse Accessibility Audit |
| **REQ-NFR-401**| Transactional Seeding | `apps/api/src/import/import.service.ts`| `tests/import-transactions.spec.ts` |
| **REQ-NFR-500**| Test Coverage Minimum | GitHub Actions pipeline configuration | Jest Coverage Report |

---

# 3. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Project Timeline | `docs/00_Project_Management/08_Project_Timeline.md` |
| Functional Requirements | `docs/01_Requirements/02_Functional_Requirements.md` |
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| Acceptance Criteria | `docs/01_Requirements/23_Acceptance_Criteria.md` |

---

# Next Document

```
docs/01_Requirements/25_Open_Questions.md
```

The Open Questions document tracks pending architectural decisions, data sourcing uncertainties, and platform queries.
