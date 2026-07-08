# Non-Functional Requirements

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-NFR-001 |
| Document Name | Non-Functional Requirements |
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

1. Executive Summary
2. Performance and Responsiveness Requirements
3. Security and Compliance Requirements
4. Accessibility Requirements
5. Reliability and Data Integrity Requirements
6. Maintainability and Portability Requirements
7. References

---

# 1. Executive Summary

This Non-Functional Requirements (NFR) document specifies the quality attributes, performance budgets, security baselines, and operational targets for the Pokémon Knowledge Management Platform (PKMP) v1.0.0. These requirements represent strict engineering criteria that must be satisfied during implementation, testing, and deployment to ensure the platform remains secure, performant, and maintainable.

---

# 2. Performance and Responsiveness Requirements

| ID | Title | Requirement Specification | Priority | Verification |
|----|-------|---------------------------|----------|--------------|
| **REQ-NFR-100** | Initial Page Load | The initial Largest Contentful Paint (LCP) must occur in ≤ 2.5 seconds over a simulated 4G mobile connection with cold browser caches. | High | Analysis (Lighthouse) |
| **REQ-NFR-101** | API Response Latency | Backend API endpoints must return data with a 95th percentile (p95) latency of ≤ 200 ms under typical concurrent loads. | High | Analysis (Load tests) |
| **REQ-NFR-102** | Database Query Budget | Common database read queries must execute in ≤ 100 ms. Complex search queries using FTS must execute in ≤ 150 ms. | High | Analysis (Prisma logs) |
| **REQ-NFR-103** | JS Bundle Budget | The initial main bundle sent to the client (gzipped) must not exceed 200 KB. Dynamic route bundles must not exceed 50 KB. | Medium | Inspection (Build logs) |
| **REQ-NFR-104** | Cumulative Layout Shift | The Cumulative Layout Shift (CLS) on all core browser routes must not exceed 0.1 during navigation transitions. | Medium | Analysis (Lighthouse) |

---

# 3. Security and Compliance Requirements

| ID | Title | Requirement Specification | Priority | Verification |
|----|-------|---------------------------|----------|--------------|
| **REQ-NFR-200** | OWASP ASVS Compliance | The platform must achieve Level 1 compliance with the OWASP Application Security Verification Standard. | High | Inspection / Audit |
| **REQ-NFR-201** | Password Protection | User passwords must be salted and hashed using bcrypt with a work factor of ≥ 10. | High | Testing |
| **REQ-NFR-202** | Token Lifetime Limits | JWT access tokens must expire in 15 minutes. Refresh tokens must rotate on usage and expire in 7 days. | High | Testing |
| **REQ-NFR-203** | Injection Mitigation | All database operations must utilize Prisma ORM parameterized queries to prevent SQL injection. | High | Inspection |
| **REQ-NFR-204** | Security Headers | The NestJS API must configure secure HTTP headers including CORS whitelist filters, Rate Limiting, and Helmet protections. | High | Testing |
| **REQ-NFR-205** | Transport Encryption | All production client-server communication must be encrypted using TLS 1.3, rejecting insecure HTTP ports. | High | Analysis |

---

# 4. Accessibility Requirements

| ID | Title | Requirement Specification | Priority | Verification |
|----|-------|---------------------------|----------|--------------|
| **REQ-NFR-300** | WCAG 2.2 Compliance | All public user interfaces must comply with WCAG 2.2 AA standards. | High | Inspection / Demo |
| **REQ-NFR-301** | Lighthouse Access Score | Every public route must maintain a Lighthouse Accessibility score of ≥ 95. | High | Analysis (Lighthouse) |
| **REQ-NFR-302** | Keyboard Navigation | All interactive components (search bars, comparative checklists, builders) must support keyboard navigation without mouse dependencies. | High | Demonstration |
| **REQ-NFR-303** | Screen Reader Support | All UI controls must include descriptive ARIA attributes and follow semantic HTML tags to ensure correct screen reader voiceover translation. | Medium | Demonstration |

---

# 5. Reliability and Data Integrity Requirements

| ID | Title | Requirement Specification | Priority | Verification |
|----|-------|---------------------------|----------|--------------|
| **REQ-NFR-400** | Data Consistency | The database must maintain 100% referential integrity at the database engine level (foreign keys, cascading actions, check constraints). | High | Testing |
| **REQ-NFR-401** | Fail-Safe Imports | Dataset import operations must be transactional. Any validation failure during import must trigger a complete database rollback. | High | Testing |
| **REQ-NFR-402** | Soft-Delete Actions | Data entries deleted via the CMS must utilize soft deletes (adding a `deleted_at` timestamp) to prevent cascading database deletions. | Medium | Testing |
| **REQ-NFR-403** | System Availability | The production platform target uptime is 99% (excluding scheduled maintenance windows). | Medium | Analysis |

---

# 6. Maintainability and Portability Requirements

| ID | Title | Requirement Specification | Priority | Verification |
|----|-------|---------------------------|----------|--------------|
| **REQ-NFR-500** | Test Coverage Minimum | The backend service and business logic layers must maintain an automated line test coverage threshold of ≥ 80%. | High | Analysis (CI coverage) |
| **REQ-NFR-501** | Container Portability | The backend and frontend applications must be deployable as isolated Docker containers on standard Linux engines. | High | Demonstration |
| **REQ-NFR-502** | Zero-Configuration Build | Local environment initialization must be achievable using a single command: `docker-compose up`. | High | Demonstration |
| **REQ-NFR-503** | Documentation Parity | All changes affecting database schemas, API routes, or role scopes must be documented within the repository prior to code merge. | High | Inspection |

---

# 7. References

## Internal Documents

| Document | Path |
|----------|------|
| Vision and Goals | `docs/00_Project_Management/02_Vision_and_Goals.md` |
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Assumptions & Constraints | `docs/00_Project_Management/05_Assumptions_and_Constraints.md` |
| Requirements Overview | `docs/01_Requirements/00_Requirements_Overview.md` |

---

# Next Document

```
docs/01_Requirements/04_User_Personas.md
```

The User Personas document outlines the detailed characteristics, behaviors, technical experience levels, goals, and frustrations of the primary target users of the PKMP platform.
