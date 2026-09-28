# Database Requirements

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-DB-002 |
| Document Name | Database Requirements |
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
2. Referential Integrity & Normalization
3. Indexing Strategies
4. Connection Pooling and Scaling
5. Schema Migration & Seeding
6. References

---

# 1. Purpose and Scope

This Database Requirements document defines the constraints for referential integrity, indexing strategies, audit log tables, connection pool sizing, and data migration workflows for the PostgreSQL database of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. The schema must enforce 100% data consistency at the engine level.

---

# 2. Referential Integrity & Normalization

- **Normalization:** The database must be structured in Third Normal Form (3NF) to eliminate data redundancy.
- **Foreign Key Constraints:** All relations must be enforced at the database level using foreign keys.
- **Cascading Rules:**
  - **No Cascade Deletion for Core Data:** Deleting a Type, Move, or Ability must block (`ON DELETE RESTRICT`) if dependent Pokémon records exist.
  - **Cascade Deletion for User Data:** Deleting a user account must cascade delete their associated teams and collections (`ON DELETE CASCADE`).

---

# 3. Indexing Strategies

Indexes must be configured to support the 100 ms read query budget.

- **Primary Keys:** Auto-indexed B-Tree on all `id` UUID columns.
- **Lookup Fields:**
  - B-Tree indexes on unique slug columns (`slug` in `pokemon`, `moves`, `abilities` tables) for route routing.
  - Foreign key columns must have B-Tree indexes to accelerate relational joins.
- **Search Optimization:**
  - GIN indexes on the pre-compiled FTS column (`search_vector`) in `pokemon` and `moves` tables.
  - Trigram GIN indexes (`gin_trgm_ops`) on name columns to accelerate fuzzy searches.

---

# 4. Connection Pooling and Scaling

- **Prisma Configuration:** Set maximum connection pool limits in the connection string configuration parameters (`connection_limit=10`).
- **Connection Sizing:** The connection pool size must be calculated based on the maximum concurrent API threads to prevent database exhaustion.
- **Read/Write Separation:** Not implemented in v1.0.0. A single PostgreSQL instance handles both read and write operations.

---

# 5. Schema Migration & Seeding

- **Migrations:** All schema changes must be managed through Prisma Migrate. Manual schema modifications inside PostgreSQL are strictly prohibited.
- **Migration Files:** Every migration must be version-controlled in the repository (`prisma/migrations/`) containing the raw SQL diff and a description.
- **Idempotent Seeds:** Seeding scripts must be idempotent. Re-running the seed script must update existing records and insert new records without duplicating entries.

---

# 6. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Decision Log | `docs/00_Project_Management/10_Decision_Log.md` |
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| Data Requirements | `docs/01_Requirements/09_Data_Requirements.md` |
| Search Requirements | `docs/01_Requirements/10_Search_Requirements.md` |

---

# Next Document

```
docs/01_Requirements/19_Reporting_Requirements.md
```

The Reporting Requirements document outlines specifications for data metrics collection, csv exports, and user progress indicators.
