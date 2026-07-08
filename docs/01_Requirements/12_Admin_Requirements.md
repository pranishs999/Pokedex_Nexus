# Admin Requirements

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-AD-002 |
| Document Name | Admin Requirements |
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
2. User Account Management & Controls
3. System Health Monitoring
4. Audit Log Access & Query Tools
5. Backup & Recovery Operations
6. References

---

# 1. Purpose and Scope

This Admin Requirements document defines the specifications for user account control, system health dashboard monitoring, operational logs, and database backup/restore operations of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. The administrative interface is restricted to users with Admin or Super Admin roles (BR-300).

---

# 2. User Account Management & Controls

Administrators must be able to manage user profiles to maintain platform security.

## 2.1 User CRUD Specifications
- **User Search:** Admins must be able to search user lists by username, email, or role.
- **Account Actions:**
  - **Suspend:** Temporarily block account login access.
  - **Deactivate:** Soft-delete the account.
  - **Promote/Demote (Super Admin only):** Update user roles using a secure dropdown.
- **Enforcement Rules:**
  - An Admin cannot modify another Admin or Super Admin account.
  - Changing a user's role must revoke their active JWT access tokens on next API request.

---

# 3. System Health Monitoring

The Admin Dashboard must display high-level system metrics to monitor platform operations.

```
┌────────────────────────────────────────────────────────┐
│                   Admin System Health                  │
├───────────────┬────────────────────────┬───────────────┤
│ CPU: 12%      │ Memory: 512MB / 1GB    │ Disk: 45%     │
├───────────────┴────────────────────────┴───────────────┤
│ API Error Logs (Last 24h):                             │
│ [12:04] 500 - Internal Server Error - db connection    │
│ [14:22] 404 - Pokemon not found - slug: missing-no     │
└────────────────────────────────────────────────────────┘
```

- **Metrics Tracked:**
  - Database connection status.
  - Server CPU and memory utilization.
  - API endpoint response times (average, p95).
  - API error counts categorized by HTTP status code (4xx, 5xx).
- **Log Stream:** Display a real-time stream of server exception logs, with filtering options for error level and source module.

---

# 4. Audit Log Access & Query Tools

Administrators must be able to search and view the system audit logs to trace modifications.

- **Query Interface:** Admins must be able to filter audit logs by:
  - Timestamp range.
  - Target table.
  - Action type (`CREATE`, `UPDATE`, `DELETE`).
  - User ID.
- **JSON Delta View:** Selecting an audit log entry must display a side-by-side JSON comparison of the modified fields.
- **Export Utility:** Admins must be able to export query results as CSV or JSON files.

---

# 5. Backup & Recovery Operations

Administrators must be able to manage database backups to prevent data loss.

- **Scheduled Backups:** Configure daily PostgreSQL database dumps (`pg_dump`) automatically.
- **Manual Backups:** Allow Super Admins to trigger database backups on demand via the dashboard.
- **Restore Points:** Super Admins must be able to restore the database from a backup file. Triggering a restore forces the application to enter a temporary read-only maintenance mode.

---

# 6. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Stakeholders | `docs/00_Project_Management/06_Stakeholders.md` |
| Business Rules | `docs/01_Requirements/08_Business_Rules.md` |
| CMS Requirements | `docs/01_Requirements/11_CMS_Requirements.md` |

---

# Next Document

```
docs/01_Requirements/13_Security_Requirements.md
```

The Security Requirements document defines requirements for database encryption, user authentication, role check guards, rate limits, and network safety.
