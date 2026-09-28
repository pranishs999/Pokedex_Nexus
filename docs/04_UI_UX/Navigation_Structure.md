# Navigation Structure

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-NS-001 |
| Document Name | Navigation Structure |
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
2. Application Routing Hierarchy
3. Menu & Layout Navigation Bars
4. Route Guard Authorization Gates
5. References

---

# 1. Purpose and Scope

This Navigation Structure document defines the sitemap, URL paths, routing hierarchies, navigation menus, and authorization gate assignments for the frontend application of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. All client-side route paths must match this layout.

---

# 2. Application Routing Hierarchy

The application routing is structured as a file-based tree managed via TanStack Router.

```
/ (Home / Search Landing)
├── /pokemon (Pokedex Grid Browse)
│   ├── /:id_or_slug (Pokemon Detail - stats, moves, evolution)
│   └── /compare (Pokemon Comparator workspace)
├── /moves (Moves Catalog List)
│   └── /:id_or_slug (Move details & learning pokemon list)
├── /abilities (Abilities Catalog List)
├── /teams (Team Builder Workspace)
├── /collections (Living Dex Checksheet Dashboard)
│   └── /shiny (Shiny Collector Checklist)
└── /admin (Admin / Moderator Workspace Portal)
    ├── /submissions (Moderation queue list)
    └── /logs (System Audit Log reader)
```

---

# 3. Menu & Layout Navigation Bars

## 3.1 Header Navigation
Visible on all routes, the sticky top-header hosts navigation options:
- **Left Region:** Logo (clickable to route home `/`) and core links (`Pokédex`, `Team Builder`, `Collections`).
- **Center Region:** Debounced autocomplete search bar input.
- **Right Region:** Authenticated status action dropdown (Login link or User Profile avatar menu showing user settings and Logout option).

## 3.2 Mobile Navigation Drawer
On viewport sizes `< 768px` (sm/md), header links collapse into a hamburger menu button. Clicking the button opens a full-screen drawer displaying navigation items, styled with backdrop filters.

---

# 4. Route Guard Authorization Gates

To prevent unauthorized access, route navigation is checked against user session tokens.

- **Public Routes:** `/`, `/pokemon/*`, `/moves/*`, `/abilities/*`. Accessible to all actors.
- **User Protected Routes:** `/teams`, `/collections/*`. Navigating to these paths checks for a valid access token. If missing, the router redirects the request to the `/login` path with a return URL query parameter.
- **Admin/Moderator Protected Routes:** `/admin/*`. Requires role clearance (BR-300). Attempting to load these paths without authorization triggers a redirection to the home page with an access denied alert.

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Functional Requirements | `docs/01_Requirements/02_Functional_Requirements.md` |
| Business Rules | `docs/01_Requirements/08_Business_Rules.md` |
| UI/UX Requirements | `docs/01_Requirements/15_UI_UX_Requirements.md` |
| Component Design | `docs/02_Architecture/Component_Design.md` |

---

# Next Document

```
docs/04_UI_UX/Page_Layouts.md
```

The Page Layouts document defines wireframes, grid dimensions, sidebar structures, and responsive layouts for each core view.
