# Assumptions and Constraints

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-AC-001 |
| Document Name | Assumptions and Constraints |
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

1. Introduction
2. Assumptions
3. Constraints
4. Dependencies
5. Risk Implications
6. Assumption Validation Plan
7. References

---

# 1. Introduction

This document records all assumptions made during the planning and design of PKMP and all constraints that bound the project.

Assumptions are conditions believed to be true but not yet verified. If an assumption proves incorrect, the associated decisions may require revision.

Constraints are fixed limitations imposed by technology, resources, legal obligations, or project objectives. Constraints are non-negotiable unless the project scope is formally changed.

Every architectural decision, technology selection, and scope definition in prior documents rests on the assumptions documented here. If any assumption changes, dependent documents must be reviewed and updated.

---

# 2. Assumptions

## 2.1 Project Assumptions

| ID | Assumption | Impact if Invalid | Dependent Documents |
|----|-----------|-------------------|---------------------|
| A-01 | The project is developed and maintained by a single developer (Project Owner). | Team coordination processes, code review workflows, and onboarding documentation become unnecessary overhead. | Project Charter, Stakeholders |
| A-02 | Development occurs part-time alongside other responsibilities. | Timeline estimates must account for variable availability. Scope may require phased delivery. | Roadmap, Timeline |
| A-03 | The project is non-commercial. No revenue generation is expected or planned. | No payment processing, billing systems, or commercial licensing are required. | Scope, Legal |
| A-04 | Contributors may join in the future but are not guaranteed. | Documentation and code quality must support onboarding without direct guidance. | Vision and Goals, Stakeholders |
| A-05 | The project serves as a professional portfolio demonstration. | Engineering quality, documentation completeness, and architectural rigor are primary success metrics. | Vision and Goals |

---

## 2.2 Technical Assumptions

| ID | Assumption | Impact if Invalid | Dependent Documents |
|----|-----------|-------------------|---------------------|
| A-06 | React 19 and the TanStack ecosystem remain stable and actively maintained throughout development. | Framework migration would require significant frontend refactoring. | Vision and Goals, Scope |
| A-07 | NestJS remains a viable and actively maintained backend framework. | Backend architecture patterns and dependency injection mechanisms would need replacement. | Architecture |
| A-08 | Prisma ORM supports all required PostgreSQL features including full-text search, `pg_trgm`, and advanced indexing. | Raw SQL may be required for specific queries, reducing type safety in those areas. | Database, Search |
| A-09 | PostgreSQL's built-in full-text search and `pg_trgm` extension are sufficient for the search requirements without requiring a dedicated search engine (e.g., Elasticsearch). | Search architecture would need to introduce an additional infrastructure component. | Search, Architecture |
| A-10 | A single PostgreSQL instance can handle the expected data volume and query load for v1.0.0. | Database replication, read replicas, or sharding would need to be introduced. | Database, Deployment |
| A-11 | Client-side rendering (CSR) via Vite provides acceptable performance for the application's content type. | SSR or hybrid rendering (e.g., Next.js) would be required, necessitating framework migration. | Architecture, Performance |
| A-12 | Tailwind CSS v4 provides stable CSS-native configuration and design token support. | Fallback to v3 configuration or alternative styling approach may be needed. | UI/UX |
| A-13 | Docker is available in all target deployment environments. | Alternative containerization or bare-metal deployment strategies would be required. | Deployment |
| A-14 | GitHub Actions is available for CI/CD. | Alternative CI/CD platform would need to be configured. | DevOps |
| A-15 | JWT with refresh token rotation provides sufficient authentication security for the application's threat model. | Session-based authentication or additional MFA would be required. | Security |

---

## 2.3 Data Assumptions

| ID | Assumption | Impact if Invalid | Dependent Documents |
|----|-----------|-------------------|---------------------|
| A-16 | Comprehensive Pokémon data is available through publicly accessible fan resources and can be compiled into structured JSON datasets. | Data collection scope would need to be reduced or alternative sources identified. | Scope, Database |
| A-17 | Pokémon data does not change retroactively in ways that break the data model. Historical changes (e.g., type chart modifications) are additive and can be versioned. | The data model would require temporal versioning at the field level rather than the record level. | Database |
| A-18 | The Pokémon franchise will continue releasing new generations, requiring the platform to accommodate future expansions. | Forward-compatibility design is wasted effort if the franchise discontinues. Low risk. | Scope, Architecture |
| A-19 | Fan-made content volume will remain manageable with a moderator-based review workflow rather than automated content moderation. | Automated moderation or stricter submission limits would be required. | CMS |
| A-20 | Media assets (images, sprites, audio) can be sourced or created within fair use guidelines for a non-commercial fan project. | Asset availability would need to be restricted or alternative asset strategies developed. | Legal, Assets |

---

## 2.4 User Assumptions

| ID | Assumption | Impact if Invalid | Dependent Documents |
|----|-----------|-------------------|---------------------|
| A-21 | Target users access the platform primarily through modern web browsers (Chrome, Firefox, Safari, Edge). | Legacy browser support would increase frontend complexity and testing requirements. | Scope, UI/UX |
| A-22 | Mobile users are adequately served by a responsive web application and PWA. Native mobile apps are not required for v1.0.0. | Native app development would require additional technology stacks and deployment processes. | Scope |
| A-23 | Users expect fast search but do not require sub-50ms response times. The 200 ms p95 target is acceptable. | Search infrastructure would need optimization beyond PostgreSQL capabilities. | Search, Performance |
| A-24 | Most users consume content (read-heavy). Write operations (collections, teams, content submissions) represent a small percentage of total requests. | Write-optimized database strategies or CQRS patterns might be required. | Database, Architecture |
| A-25 | Users understand basic Pokémon terminology (types, stats, abilities, moves) and do not require in-app tutorials for core concepts. | Onboarding flows and contextual help systems would need to be designed. | UI/UX |

---

# 3. Constraints

## 3.1 Resource Constraints

| ID | Constraint | Impact | Mitigation |
|----|-----------|--------|------------|
| C-01 | Single developer | Limits parallel development velocity. No dedicated QA, DevOps, or design resources. | Prioritize automation (CI/CD, linting, testing). Use documentation to maintain context across sessions. |
| C-02 | Part-time development schedule | Extended timeline compared to full-time projects. Risk of context loss between sessions. | Maintain detailed documentation. Use task tracking. Keep working sessions focused on single modules. |
| C-03 | No dedicated budget | No paid infrastructure, services, or tools unless free tiers are sufficient. | Use open-source tools. Leverage free tiers (GitHub Actions, free PostgreSQL hosting for staging). |
| C-04 | No dedicated design team | UI/UX decisions are made by the developer. No user research budget. | Follow established design systems (Tailwind). Reference successful existing platforms for UX patterns. |

---

## 3.2 Technical Constraints

| ID | Constraint | Impact | Mitigation |
|----|-----------|--------|------------|
| C-05 | PostgreSQL as the sole database | No dedicated search engine, no document store, no graph database. All functionality must be achievable within PostgreSQL. | Leverage PostgreSQL FTS, `pg_trgm`, JSONB, and advanced indexing. Evaluate Elasticsearch only if PostgreSQL proves insufficient. |
| C-06 | Modular Monolith architecture | Cannot independently scale or deploy individual modules. | Design module boundaries cleanly so microservice extraction is possible in the future without rewriting business logic. |
| C-07 | REST API only (no GraphQL, no WebSockets in v1.0.0) | Clients cannot request custom data shapes. No real-time push updates. | Design REST endpoints with field selection and include parameters where beneficial. Plan WebSocket support as a future addition. |
| C-08 | Client-Side Rendering only | No server-side rendering for initial page load. SEO depends on meta tags and prerendering. | Implement prerendering for critical pages. Use proper meta tags. Evaluate SSR only if SEO proves insufficient. |
| C-09 | TypeScript required across entire stack | No JavaScript-only libraries without type definitions. | Use DefinitelyTyped. Write custom type declarations when necessary. |
| C-10 | Prisma ORM required for all database access | Raw SQL usage is discouraged. Complex queries may require `$queryRaw`. | Design the schema to work well with Prisma's query capabilities. Use raw queries only for search and performance-critical operations. |

---

## 3.3 Legal Constraints

| ID | Constraint | Impact | Mitigation |
|----|-----------|--------|------------|
| C-11 | Pokémon IP is owned by The Pokémon Company, Game Freak, and Nintendo. | Cannot commercialize the platform. Cannot distribute official game assets without authorization. | Operate as non-commercial fan project. Use publicly available assets within fair use. Clearly attribute all IP. |
| C-12 | Fan-made content must be clearly separated from official content. | Requires schema-level separation, UI labeling, and moderation workflows. | Enforce `source_type` column. Default queries exclude community content. Visual badges on all fan content. |
| C-13 | User data must be handled responsibly even without explicit GDPR/CCPA requirements. | Data collection should be minimal. Users should be able to delete their accounts and data. | Implement account deletion. Minimize stored personal data. Document data handling practices. |

---

## 3.4 Quality Constraints

| ID | Constraint | Impact | Mitigation |
|----|-----------|--------|------------|
| C-14 | WCAG 2.2 AA compliance required. | Every UI component must meet accessibility standards. Increases development time. | Use semantic HTML. Include accessibility testing in CI. Follow Tailwind's accessibility patterns. |
| C-15 | Documentation must precede or accompany implementation. | Slows initial development velocity. | Documentation quality accelerates long-term maintenance and reduces rework. Treat documentation as a first-class deliverable. |
| C-16 | ≥ 80% test coverage for service layers. | Increases development time per feature. | Write tests alongside implementation. Use NestJS testing utilities. Automate coverage enforcement in CI. |
| C-17 | Performance budgets must be maintained. | Limits library additions and feature complexity. | Monitor bundle size in CI. Use code splitting aggressively. Lazy load non-critical features. |

---

## 3.5 Operational Constraints

| ID | Constraint | Impact | Mitigation |
|----|-----------|--------|------------|
| C-18 | Single-instance deployment for v1.0.0. | No horizontal scaling. Limited fault tolerance. | Design for vertical scaling. Monitor resource usage. Plan multi-instance deployment for future releases. |
| C-19 | No dedicated monitoring infrastructure in v1.0.0. | Limited production visibility. Debugging relies on logs. | Implement structured logging. Add health check endpoints. Plan monitoring (Prometheus/Grafana) for future. |
| C-20 | No dedicated staging environment guaranteed. | Testing occurs primarily in development and local environments. | Docker Compose replicates production-like environment locally. CI pipeline validates builds. |

---

# 4. Dependencies

## 4.1 Technology Dependencies

| Dependency | Type | Risk Level | Fallback |
|-----------|------|------------|----------|
| React 19 | Frontend framework | Low | React 18 (backward compatible) |
| Vite | Build tool | Low | Webpack (migration effort) |
| TypeScript | Language | Low | None (core to project) |
| Tailwind CSS v4 | Styling | Low | Tailwind v3 or vanilla CSS |
| TanStack Router | Routing | Medium | React Router (API migration) |
| TanStack Query | Server state | Medium | SWR or custom hooks |
| React Hook Form | Forms | Low | Formik or native forms |
| Zod | Validation | Low | Yup or io-ts |
| NestJS | Backend framework | Low | Express + manual DI (significant rework) |
| Prisma | ORM | Medium | TypeORM or Drizzle (schema migration) |
| PostgreSQL | Database | Low | None (core to architecture) |
| Docker | Containerization | Low | Bare-metal deployment |
| GitHub Actions | CI/CD | Low | GitLab CI, CircleCI |

---

## 4.2 External Service Dependencies

| Dependency | Usage | Runtime Required | Risk |
|-----------|-------|-----------------|------|
| npm registry | Package installation | Build time only | Low |
| GitHub | Source control, CI/CD | Development time only | Low |
| Docker Hub | Base images | Build time only | Low |
| CDN (production) | Static asset delivery | Runtime | Medium |
| DNS provider | Domain resolution | Runtime | Low |
| TLS certificate provider | HTTPS | Runtime | Low |

The platform has no runtime dependencies on external data APIs. All Pokémon data is stored internally.

---

# 5. Risk Implications

Assumptions and constraints create risks that must be tracked.

| Risk | Source | Likelihood | Impact | Mitigation |
|------|--------|-----------|--------|------------|
| Framework deprecation | A-06, A-07 | Low | High | Monitor ecosystem health. Maintain clean module boundaries for migration. |
| PostgreSQL search limitations | A-09 | Medium | Medium | Benchmark with realistic data volumes. Design search interface to allow backend replacement. |
| Single developer burnout | C-01, C-02 | Medium | High | Maintain realistic scope. Prioritize Core modules. Accept phased delivery. |
| Data sourcing difficulty | A-16, A-20 | Medium | Medium | Begin data compilation early. Identify multiple source strategies. |
| Prisma limitations for complex queries | A-08, C-10 | Medium | Low | Identify complex query patterns early. Benchmark `$queryRaw` for search. |
| CSR performance with large datasets | A-11 | Low | Medium | Implement pagination, virtual scrolling, and code splitting. Monitor LCP. |
| Legal takedown request | C-11 | Low | High | Operate within fair use. Separate architecture from dataset. Architecture is reusable independently. |

Full risk analysis is maintained in the Risk Register: `docs/00_Project_Management/09_Risk_Register.md`.

---

# 6. Assumption Validation Plan

Assumptions should be validated as early as practical to reduce the cost of incorrect assumptions.

| Assumption | Validation Method | Validation Phase |
|-----------|-------------------|-----------------|
| A-08 (Prisma + PostgreSQL FTS) | Prototype search queries using Prisma with `pg_trgm` and `tsvector` on a representative dataset. | Phase 2 — Core Platform |
| A-09 (PostgreSQL search sufficiency) | Benchmark search response times against the 200 ms p95 target with 1,000+ Pokémon records. | Phase 4 — Search |
| A-10 (Single PostgreSQL instance capacity) | Load test with full dataset and simulated concurrent users. | Phase 9 — Optimization |
| A-11 (CSR performance) | Measure Lighthouse scores on content-heavy pages with realistic data. | Phase 2 — Core Platform |
| A-16 (Data availability) | Attempt dataset compilation for Generation I–III before committing to full scope. | Phase 1 — Foundation |
| A-22 (PWA sufficiency) | Test PWA installation and offline capabilities on representative mobile devices. | Phase 5 — User Features |
| A-23 (200 ms search target) | Measure actual search latency with representative queries after search implementation. | Phase 4 — Search |

Validation results should be recorded as ADRs if they lead to architectural changes.

---

# 7. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Charter | `docs/00_Project_Management/00_Project_Charter.md` |
| Project Context | `docs/00_Project_Management/01_Project_Context.md` |
| Vision and Goals | `docs/00_Project_Management/02_Vision_and_Goals.md` |
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Glossary | `docs/00_Project_Management/04_Glossary.md` |
| Risk Register | `docs/00_Project_Management/09_Risk_Register.md` |

---

# Next Document

```
docs/00_Project_Management/06_Stakeholders.md
```

The Stakeholders document provides a detailed analysis of all stakeholder groups, their roles, responsibilities, communication requirements, and influence on architectural decisions.
