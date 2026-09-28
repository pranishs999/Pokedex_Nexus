# Version Control

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-CMS-VC-001 |
| Document Name | Version Control |
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
2. Audit Logs Schema & Trigger Actions
3. Version History UI & Delta Diffing
4. Reversion & Rollback Execution
5. References

---

# 1. Purpose and Scope

This Version Control document defines the database auditing models, transaction logs, historical version log views, side-by-side JSON diff interfaces, and rollback execution triggers for the Content Management System (CMS) of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. This ensures all administrative mutations are auditable and reversible.

---

# 2. Audit Logs Schema & Trigger Actions

All write operations on official data tables are audited.

- **Storage Target:** The `audit_logs` table (CMS-4.1) records transactions.
- **Trigger Injection:** Database hooks or Prisma middleware intercept write calls (CREATE, UPDATE, DELETE) and log the event.
- **Delta Generation:** For updates, the system compares the original record and the modified payload, generating a JSON delta containing only mutated fields.

```
[Record Update Payload] ──► [Prisma Middleware] ──► [Write Pokemon Record]
                                      │
                                      └──► [Generate Delta & Write Audit Log]
```

---

# 3. Version History UI & Delta Diffing

Authorized editors inspect historical edits via the Admin Console.

- **Change Log Grid:** A paginated table showing log IDs, timestamps, table names, mutation types, and editor identities.
- **Side-by-Side Diff View:** Selecting a log item opens a modal view rendering the pre-mutation and post-mutation JSON values, with color coding (red background for deleted fields, green for inserted fields).

---

# 4. Reversion & Rollback Execution

If an import or edit introduces errors, Super Admins can rollback changes.

- **Reversion Process:**
  1. Super Admin selects a target log ID in the console.
  2. The system fetches the log record and reads the `data_before` state.
  3. The system executes a write transaction applying the values to the record, logging the reversion as a new `UPDATE` event.
- **Safety Gate:** Reverting a record updates only the target row; it does not cascade delete related records unless necessary.

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Business Rules | `docs/01_Requirements/08_Business_Rules.md` |
| Data Requirements | `docs/01_Requirements/09_Data_Requirements.md` |
| CMS Requirements | `docs/01_Requirements/11_CMS_Requirements.md` |
| Admin Requirements | `docs/01_Requirements/12_Admin_Requirements.md` |
| Database Requirements | `docs/01_Requirements/18_Database_Requirements.md` |
| Database Migrations | `docs/03_Database/Database_Migrations.md` |

---

# Next Document

```
docs/07_Search/README.md
```

This completes the `06_CMS` documentation phase. The next document is `docs/07_Search/README.md`, which kicks off the Search phase by outlining indexing architectures, query tokenization rules, fuzzy matching parameters, relevance scoring, and query caching policies.
