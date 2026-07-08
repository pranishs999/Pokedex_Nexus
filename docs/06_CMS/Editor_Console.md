# Editor Console

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-CMS-EC-001 |
| Document Name | Editor Console |
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
2. CMS Layout and Navigation
3. Content Forms & Field Mappings
4. State Transitions (Draft vs. Published)
5. References

---

# 1. Purpose and Scope

This Editor Console document specifies the user interface design, form layout fields, validation triggers, and state transitions of the Content Management System (CMS) Editor Console for the Pokémon Knowledge Management Platform (PKMP) v1.0.0. The console allows authorized Editors and Admins to modify encyclopedia content without direct database manipulation.

---

# 2. CMS Layout and Navigation

The Editor Console is nested within the `/admin` path and restricted by authentication route guards.

```
┌────────────────────────────────────────────────────────┐
│ CMS Console: [Dashboard] [Entries] [Imports] [Logs]     │
├────────────────────────────────────────────────────────┤
│ Active Workspace: Editing Pokemon [Bulbasaur]           │
│                                                        │
│  ┌───────────────────────┐  ┌───────────────────────┐  │
│  │ Core Fields Form      │  │ Live Markdown Preview │  │
│  │ Name: [ Bulbasaur   ] │  │                       │  │
│  │ Height: [ 0.7       ] │  │ # Bulbasaur           │  │
│  │ Weight: [ 6.9       ] │  │ Height: 0.7m          │  │
│  │                       │  │ Weight: 6.9kg         │  │
│  └───────────────────────┘  └───────────────────────┘  │
│                                                        │
│ [ Save Draft ]                              [ Publish ]│
└────────────────────────────────────────────────────────┘
```

- **Dual-Pane Layout:** Splitting the input form on the left pane from the live Markdown/HTML preview on the right pane.
- **Auto-Save Buffer:** Draft data is stored locally in IndexedDB every 30 seconds to prevent data loss in the event of browser crashes or network timeouts.

---

# 3. Content Forms & Field Mappings

CMS forms validate input values against Zod definitions prior to network transmission.

- **Pokémon Edit Form Fields:**
  - Name (Text, length: 1–100, required).
  - Classification (Text, length: 1–50, required).
  - Height & Weight (Floating point numbers > 0, required).
  - Base Stats (6-field Integer grid, range: 1–255, required).
  - Description / Flavor Text (Markdown text field, required).
- **Relational Selectors:** Type, Ability, and Move allocations must utilize search-and-select tags, querying existing database UUIDs to preserve referential integrity.

---

# 4. State Transitions (Draft vs. Published)

Encyclopedia entries support three status values:

```
[Create Entry] ──► [Draft] ──► [Published] ──(Soft Delete)──► [Archived]
```

1. **Draft:** Saved in the database with status `DRAFT`. Hidden from search queries, autocomplete lists, and public listings. Visible only to editors in the CMS Dashboard.
2. **Published:** Saved with status `PUBLISHED`. Loaded in search caches and rendered in public encyclopedia routes.
3. **Archived:** Soft-deleted records (`deleted_at IS NOT NULL`). Replaced with placeholders in public listings, but preserved in the audit log for recovery.

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Functional Requirements | `docs/01_Requirements/02_Functional_Requirements.md` |
| Business Rules | `docs/01_Requirements/08_Business_Rules.md` |
| Data Requirements | `docs/01_Requirements/09_Data_Requirements.md` |
| CMS Requirements | `docs/01_Requirements/11_CMS_Requirements.md` |
| System Architecture | `docs/02_Architecture/System_Architecture.md` |

---

# Next Document

```
docs/06_CMS/Import_Validation.md
```

The Import Validation document specifies the Zod validation criteria, bulk transaction checkpoints, and reference integrity verification procedures for dataset seeding.
