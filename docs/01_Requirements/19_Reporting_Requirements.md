# Reporting Requirements

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-RP-002 |
| Document Name | Reporting Requirements |
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
2. User Collection & Progress Metrics
3. Data Export Specifications
4. Administrative Operational Analytics
5. References

---

# 1. Purpose and Scope

This Reporting Requirements document defines the specifications for collection progress metrics, user-facing CSV/JSON data exports, and administrative dashboard analytics for the Pokémon Knowledge Management Platform (PKMP) v1.0.0. The platform must compile statistics and export datasets without degrading database performance.

---

# 2. User Collection & Progress Metrics

The system must compile statistics on user collection lists.

- **Completion Rates:**
  - Calculate percentage indicators for the National Pokédex and regional Pokédexes (e.g., "75% of Kanto Dex captured").
  - Display shiny capture counts separately.
- **Distribution Analysis:**
  - Compile type distribution metrics of captured Pokémon (e.g., bar chart showing the breakdown of types in the user's collection).
  - Compile statistical averages of base stats for Saved Teams.

---

# 3. Data Export Specifications

Users must be able to export their data for external analysis or backup.

- **Format Options:** Export collections and team data as CSV and JSON files.
- **Payload Models:**
  - **Living Dex CSV Schema:** `national_dex_number, pokemon_name, form_name, is_captured, is_shiny, date_added`.
  - **Team JSON Schema:** Export the full serialized JSONB team object structure (BR-202).
- **Enforcement Rules:** Exports must be triggered asynchronously to prevent database locks on large datasets.

---

# 4. Administrative Operational Analytics

The Admin Dashboard must display high-level system logs and usage metrics.

- **Activity Statistics:**
  - Daily active users and registration rates.
  - Number of active Saved Teams and collection sizes.
- **Search Key Metrics:** Display a list of the top 50 most searched keyword entries.
- **CMS Audit Reports:** Summarize monthly updates to official records and moderation queue volumes (items pending, items approved/rejected).

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Stakeholders | `docs/00_Project_Management/06_Stakeholders.md` |
| Use Cases | `docs/01_Requirements/06_Use_Cases.md` |
| Data Requirements | `docs/01_Requirements/09_Data_Requirements.md` |
| CMS Requirements | `docs/01_Requirements/11_CMS_Requirements.md` |
| Admin Requirements | `docs/01_Requirements/12_Admin_Requirements.md` |

---

# Next Document

```
docs/01_Requirements/20_Integration_Requirements.md
```

The Integration Requirements document outlines requirements for monorepo package sharing, backend API endpoints, and raw dataset import pipelines.
