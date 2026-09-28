# Business Rules

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-BR-002 |
| Document Name | Business Rules |
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
2. Core Business Rules Index
3. Content & Separation Rules
4. Team Builder Validation Rules
5. User Role & Authorization Rules
6. Data Import & Integrity Rules
7. References

---

# 1. Purpose and Scope

This Business Rules document defines the validation constraints, authorization levels, content separations, and data mutation boundaries for the Pokémon Knowledge Management Platform (PKMP) v1.0.0. These rules must be enforced across both frontend validation schemas and backend service logic.

---

# 2. Core Business Rules Index

| ID | Title | Description | Domain |
|----|-------|-------------|--------|
| **BR-100** | Content Segregation | Separation of official and community content | Database, Search |
| **BR-200** | Team EV Constraint | Maximum Effort Value (EV) allocations | Team Builder |
| **BR-201** | Team Item Clause | Item restrictions within a single team | Team Builder |
| **BR-202** | Team Size | Team size boundary limit | Team Builder |
| **BR-300** | RBAC Hierarchy | Role permission levels | Authentication |
| **BR-400** | Transactional Seeding | Import execution atomicity | CMS |
| **BR-401** | Data Mutation Tracking | Audit log enforcement | CMS |

---

# 3. Content & Separation Rules

## BR-100 — Content Segregation
- **Rule:** Official franchise content and community-submitted content must be separated at the database schema level.
- **Enforcement:**
  - Database records must include the `source_type` enum parameter (`OFFICIAL` or `COMMUNITY`).
  - Search queries default to `source_type = OFFICIAL`. Community content is only fetched when the query contains an explicit opt-in parameter.
  - UI components displaying community content must show a visual "Community Content" badge.

---

# 4. Team Builder Validation Rules

## BR-200 — Team EV Constraint
- **Rule:** A Pokémon's Effort Values (EVs) must not exceed 510 total points, and no single stat (HP, Atk, Def, SpA, SpD, Spe) may exceed 252 points.
- **Enforcement:**
  - The UI input sliders must prevent selections exceeding these limits.
  - The backend validation DTO must reject team payloads that violate these constraints with an HTTP 400 Bad Request error.

## BR-201 — Team Item Clause
- **Rule:** A team can only assign a specific hold item to a single Pokémon at a time (e.g., no two Pokémon on the same team can hold "Leftovers").
- **Enforcement:**
  - The Team Builder UI must highlight duplicates and show validation errors.
  - If validation fails, the team cannot be saved to the database.

## BR-202 — Team Size
- **Rule:** A team must contain between 0 and 6 Pokémon.
- **Enforcement:**
  - The UI must block adding more than six slots.
  - The backend must reject arrays containing more than six objects.

---

# 5. User Role & Authorization Rules

## BR-300 — RBAC Hierarchy
- **Rule:** Access to system features is controlled by a hierarchical role system.
- **Enforcement:**
  - Roles inherit permissions from lower levels.
  - Permissions are mapped as follows:

```
[Guest] ──► [User] ──► [Moderator] ──► [Editor] ──► [Admin] ──► [Super Admin]
```

| Role | Permissions |
|------|-------------|
| **Guest** | Read official encyclopedia, basic/advanced search, compare Pokémon. |
| **User** | Inherits Guest + save teams, manage personal collections, submit Fakemon. |
| **Moderator** | Inherits User + review and approve/reject pending Fakemon submissions. |
| **Editor** | Inherits Moderator + access CMS forms, update official Pokémon/move lists, trigger imports. |
| **Admin** | Inherits Editor + suspend users, view system health dashboard, access audit logs. |
| **Super Admin**| Inherits Admin + assign/modify user roles, trigger database rollbacks. |

---

# 6. Data Import & Integrity Rules

## BR-400 — Transactional Seeding
- **Rule:** All database import actions must execute within a transactional scope.
- **Enforcement:**
  - If an import fails (due to validation errors, key constraints, or database timeouts), the system must rollback the entire transaction.
  - The database must not save partial imports.

## BR-401 — Data Mutation Tracking
- **Rule:** All database write operations on official data tables must be logged in the system audit logs.
- **Enforcement:**
  - The system must capture the timestamp, user ID, operation type (CREATE, UPDATE, DELETE), table name, and a before/after JSON delta representation of the data.
  - Audit logs are read-only and cannot be updated or deleted.

---

# 7. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Stakeholders | `docs/00_Project_Management/06_Stakeholders.md` |
| Functional Requirements | `docs/01_Requirements/02_Functional_Requirements.md` |
| Use Cases | `docs/01_Requirements/06_Use_Cases.md` |

---

# Next Document

```
docs/01_Requirements/09_Data_Requirements.md
```

The Data Requirements document defines the structural constraints, relations, data types, and synchronization logic for all PKMP core schemas and datasets.
