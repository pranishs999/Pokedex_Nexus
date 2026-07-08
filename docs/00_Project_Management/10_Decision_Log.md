# Decision Log

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-DL-001 |
| Document Name | Decision Log |
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
2. Architecture & Tech Stack Decisions
3. API & Communication Decisions
4. Content & Sourcing Decisions
5. Reference Links and ADR Cross-References
6. References

---

# 1. Purpose and Scope

This Decision Log serves as a single source of truth for major technical, architectural, and design decisions made throughout the lifecycle of the Pokémon Knowledge Management Platform (PKMP). By documenting the problem statement, alternatives considered, selected option, trade-offs, and future impacts of each decision, this log ensures traceability and prevents unnecessary re-litigation of technical choices.

---

# 2. Architecture & Tech Stack Decisions

## 2.1 Decision DL-001 — Monolith vs. Microservices (Modular Monolith)

- **Status:** Approved
- **Problem Statement:** Determine the deployment and codebase structure for the PKMP backend and frontend.
- **Alternatives Considered:**
  1. *Distributed Microservices:* High isolation but introduces network overhead, synchronization issues, and deployment complexity.
  2. *Standard Monolith:* Easy to bootstrap but risk of code spaghetti and tight coupling over time.
- **Selected Option:** *Modular Monolith.*
- **Trade-offs & Rationale:**
  - *Benefits:* Fits the single-developer capacity constraint (C-01). Simpler deployment (single container). Strong compile-time interface enforcement prevents tight coupling. Easy microservice extraction later.
  - *Drawbacks:* Scaling is all-or-nothing. Shared runtime resource limits.
- **Future Impact:** Keep packages/modules isolated with clean interfaces. Avoid database-level cross-module joins where possible; utilize services for lookup logic.

---

## 2.2 Decision DL-002 — Relational Database: PostgreSQL

- **Status:** Approved
- **Problem Statement:** Choose the main data storage system for structured encyclopedia and user collection data.
- **Alternatives Considered:**
  1. *MongoDB / Document Store:* Flexible schema but lacks referential integrity and is less optimized for complex relational search.
  2. *Neo4j / Graph Database:* Fits complex relationships (evolutions, regions) but lacks general tooling support and is overkill for basic tabular content.
- **Selected Option:** *PostgreSQL.*
- **Trade-offs & Rationale:**
  - *Benefits:* Excellent support for Third Normal Form (3NF) relational constraints, full-text search indices, JSONB for flexible extensions, and the `pg_trgm` extension for fuzzy matching.
  - *Drawbacks:* Schema changes require migrations. Strict tabular schemas require initial design overhead.
- **Future Impact:** Schema validation via Prisma Migrate is required for all updates.

---

## 2.3 Decision DL-003 — ORM Selection: Prisma ORM

- **Status:** Approved
- **Problem Statement:** Choose a database mapping tool for NestJS.
- **Alternatives Considered:**
  1. *TypeORM:* Standard in NestJS but lacks type safety without massive boilerplate.
  2. *Drizzle ORM:* Highly performant but has a smaller ecosystem and less mature migration workflows.
  3. *Raw SQL Client (pg):* Maximum control but high maintenance burden and zero compile-time checks.
- **Selected Option:** *Prisma ORM.*
- **Trade-offs & Rationale:**
  - *Benefits:* Schema-first approach, auto-generated type safety, stable migration tools, and easy integration with TypeScript.
  - *Drawbacks:* Performance overhead on bulk relations query generation. Lacks native support for advanced PostgreSQL full-text search operators (requires `$queryRaw` bypass).
- **Future Impact:** Use standard Prisma queries for CRUD; write raw SQL only for advanced search execution.

---

## 2.4 Decision DL-004 — Frontend Tooling: React 19 + Vite

- **Status:** Approved
- **Problem Statement:** Select the UI framework and bundler.
- **Alternatives Considered:**
  1. *Next.js (App Router):* Strong SSR support but introduces deployment complexity, Hydration mismatch errors, and complicates offline-first/PWA strategies.
  2. *Vue / Nuxt:* Alternative paradigm but React has a larger ecosystem (specifically for 3D loaders like React Three Fiber).
- **Selected Option:** *React 19 + Vite.*
- **Trade-offs & Rationale:**
  - *Benefits:* Vite offers fast HMR. React 19 provides concurrent rendering performance. Pure CSR structure aligns with PWA asset caching strategies.
  - *Drawbacks:* SEO is client-side dependent without build-time prerendering.
- **Future Impact:** Configure SSG (Static Site Generation) or route prerendering inside Vite for critical index routes.

---

## 2.5 Decision DL-005 — Styling Framework: Tailwind CSS v4

- **Status:** Approved
- **Problem Statement:** Select CSS architecture.
- **Alternatives Considered:**
  1. *Styled Components / CSS-in-JS:* Good isolation but runtime performance cost.
  2. *Vanilla CSS / CSS Modules:* High control but slower implementation velocity.
- **Selected Option:** *Tailwind CSS v4.*
- **Trade-offs & Rationale:**
  - *Benefits:* CSS-native configuration. Fast design compilation. Easy dark-mode toggle configuration out-of-the-box. Low CSS bundle size.
  - *Drawbacks:* Utility class verbosity in templates.
- **Future Impact:** Encapsulate common classes into clean components.

---

## 2.6 Decision DL-006 — State Management: TanStack Query (React Query)

- **Status:** Approved
- **Problem Statement:** Select mechanism for caching, refreshing, and fetching backend data.
- **Alternatives Considered:**
  1. *Redux Toolkit:* Powerful but verbose. Requires manual fetch-action mappings.
  2. *Zustand:* Excellent local client state, but doesn't handle server cache invalidation, polling, or loading states automatically.
- **Selected Option:** *TanStack Query.*
- **Trade-offs & Rationale:**
  - *Benefits:* Handles caching, background updates, retry states, pagination caches, and optimistic UI updates automatically.
  - *Drawbacks:* Focuses solely on server state.
- **Future Impact:** Use Zustand or React Context for local state (e.g., Team Builder workspace); use TanStack Query for encyclopedia and user DB caches.

---

# 3. API & Communication Decisions

## 3.1 Decision DL-007 — API Protocol: REST

- **Status:** Approved
- **Problem Statement:** Define how client and server communicate.
- **Alternatives Considered:**
  1. *GraphQL:* Client selects data shape, reducing payload sizes. However, it increases backend schema complexity and conflicts with standard REST route guards.
  2. *gRPC:* Highly performant but complex browser support and overkill for public knowledge databases.
- **Selected Option:** *REST API.*
- **Trade-offs & Rationale:**
  - *Benefits:* Industry-standard caching configurations, direct integration with NestJS guards/interceptors, and simple debugging.
  - *Drawbacks:* Potential for over-fetching or under-fetching compared to GraphQL.
- **Future Impact:** Implement pagination, select properties query filters, and clean DTO layouts to manage payload size.

---

# 4. Content & Sourcing Decisions

## 4.1 Decision DL-008 — Offline Data Ownership (No Runtime API Dependency)

- **Status:** Approved
- **Problem Statement:** Choose whether to fetch Pokémon data dynamically from PokeAPI at runtime or seed the data locally.
- **Alternatives Considered:**
  1. *Dynamic PokeAPI integration:* No storage requirement on our end, but introduces runtime availability risk, rate-limit failures, and latency.
- **Selected Option:** *Offline Data Ownership.*
- **Trade-offs & Rationale:**
  - *Benefits:* Zero runtime dependencies on third parties. Immediate local DB query speeds. Full control over data schemas.
  - *Drawbacks:* High initial database storage setup and data sourcing/seeding effort.
- **Future Impact:** Maintain data versioning and seed scripts inside scripts/ directory.

---

# 5. Reference Links and ADR Cross-References

This Decision Log acts as a summary registry. High-impact architectural adjustments will trigger individual Architecture Decision Records (ADRs) inside `docs/15_ADR/`.

| Decision ID | Summary | ADR Reference |
|-------------|---------|---------------|
| DL-001 | Modular Monolith | [ADR-001](file:///home/pranish/code-main-h/mix/Pokedex/docs/15_ADR/001_Modular_Monolith.md) |
| DL-002 | PostgreSQL Relational | [ADR-002](file:///home/pranish/code-main-h/mix/Pokedex/docs/15_ADR/002_PostgreSQL_Database.md) |
| DL-004 | React 19 CSR | [ADR-003](file:///home/pranish/code-main-h/mix/Pokedex/docs/15_ADR/003_React_Vite_CSR.md) |
| DL-008 | Offline Data Seeding | [ADR-004](file:///home/pranish/code-main-h/mix/Pokedex/docs/15_ADR/004_Data_Ownership.md) |

---

# 6. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Charter | `docs/00_Project_Management/00_Project_Charter.md` |
| Project Context | `docs/00_Project_Management/01_Project_Context.md` |
| Vision and Goals | `docs/00_Project_Management/02_Vision_and_Goals.md` |
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Assumptions & Constraints | `docs/00_Project_Management/05_Assumptions_and_Constraints.md` |

---

# Next Document

```
docs/01_Requirements/README.md
```

This completes the `00_Project_Management` documentation phase. The next document is `docs/01_Requirements/README.md`, which kicks off the Requirements engineering phase by providing an overview of functional, non-functional, business, and data requirements for the platform.
