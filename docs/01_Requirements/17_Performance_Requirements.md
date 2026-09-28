# Performance Requirements

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-PE-002 |
| Document Name | Performance Requirements |
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
2. Core Web Vitals Budgets
3. API & Server Response Budgets
4. Database Execution Limits
5. Asset Size Budgets
6. References

---

# 1. Purpose and Scope

This Performance Requirements document defines the page load metrics, database queries, memory limitations, and caching thresholds for the Pokémon Knowledge Management Platform (PKMP) v1.0.0. The frontend and backend architectures must adhere to these metrics to ensure a highly responsive user experience.

---

# 2. Core Web Vitals Budgets

The client-side React 19 application must satisfy Google's Core Web Vitals criteria.

- **Largest Contentful Paint (LCP):** ≤ 2.5 seconds on simulated slow 4G connection with cold caches.
- **Interaction to Next Paint (INP):** ≤ 200 milliseconds.
- **Cumulative Layout Shift (CLS):** ≤ 0.1 across all routing transitions.

---

# 3. API & Server Response Budgets

Backend API routes must process requests within defined server-side response times.

- **Standard GET Requests:**
  - p95 latency: ≤ 100 ms.
  - p99 latency: ≤ 200 ms.
- **FTS Search & Advanced Queries:**
  - p95 latency: ≤ 200 ms.
  - p99 latency: ≤ 500 ms.
- **Write Operations (Auth, Team Saves):**
  - p95 latency: ≤ 250 ms.
  - p99 latency: ≤ 600 ms.

---

# 4. Database Execution Limits

The PostgreSQL database must execute queries within strict timing constraints.

- **Index Reads:** ≤ 50 ms.
- **Complex Joins / FTS:** ≤ 150 ms.
- **Write Transactions:** ≤ 200 ms.
- **Index Overhead:** Total index size must not exceed 40% of the active database size. GIN search indices must be optimized to prevent performance degradation under concurrent search loads.

---

# 5. Asset Size Budgets

To minimize initial page load times, strict file size budgets are enforced.

- **Main JS Bundle (gzipped):** ≤ 200 KB.
- **Lazy Route JS Bundles (gzipped):** ≤ 50 KB per route.
- **CSS Bundle (gzipped):** ≤ 40 KB.
- **3D glTF Models:** ≤ 500 KB per model. Models must use Draco compression.
- **2D Image Assets:** All official artwork and sprites must use modern web formats (WebP, AVIF) and be optimized to ≤ 100 KB per asset.

---

# 6. References

## Internal Documents

| Document | Path |
|----------|------|
| Vision and Goals | `docs/00_Project_Management/02_Vision_and_Goals.md` |
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Assumptions & Constraints | `docs/00_Project_Management/05_Assumptions_and_Constraints.md` |
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| UI/UX Requirements | `docs/01_Requirements/15_UI_UX_Requirements.md` |

---

# Next Document

```
docs/01_Requirements/18_Database_Requirements.md
```

The Database Requirements document defines the constraints for referential integrity, indexing strategies, audit log tables, and connection pool sizing.
