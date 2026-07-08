# Page Layouts

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-PL-001 |
| Document Name | Page Layouts |
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
2. Home Landing Layout
3. Pokédex Grid View Layout
4. Pokémon Detail Page Layout
5. Team Builder Workspace Layout
6. Living Dex Checklist Layout
7. References

---

# 1. Purpose and Scope

This Page Layouts document defines the wireframes, grid layout guides, side-panel parameters, and responsive page structures for the core views of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. All user interfaces must adhere to these structural guides.

---

# 2. Home Landing Layout

Designed to focus user attention on search.

```
┌────────────────────────────────────────────────────────┐
│                   App Navigation Bar                   │
├────────────────────────────────────────────────────────┤
│                                                        │
│                    [ Brand Logo ]                      │
│                                                        │
│             ┌─────────────────────────────┐            │
│             │ Search Pokemon, moves...  🔍│            │  ◄── Debounced input
│             └─────────────────────────────┘            │
│                                                        │
│        [Fire] [Water] [Grass] [Electric] [More...]     │  ◄── Quick filters
│                                                        │
└────────────────────────────────────────────────────────┘
```

- **Search Bar:** Centered with a dynamic dropdown panel for autocomplete suggestions.
- **Quick Links:** Icon buttons for types that execute a pre-filtered search upon interaction.

---

# 3. Pokédex Grid View Layout

Utilizes a dual-column layout on desktop viewports.

- **Sidebar (Width: 280px):** Sticky side-panel containing search filters (Type checkboxes, Generation dropdowns, and Community content toggles). Collapses into a floating action button on mobile screens.
- **Main Grid Container:** Dynamic grid rendering Pokémon cards (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`). Cards display species sprites, names, ID badges, and type pills.

---

# 4. Pokémon Detail Page Layout

Utilizes a multi-panel layout.

```
┌────────────────────────────────────────────────────────┐
│                   App Navigation Bar                   │
├────────────────────────────────────────────────────────┤
│  ┌───────────────────────┐  ┌───────────────────────┐  │
│  │   3D Canvas Panel     │  │   Stats Summary Card  │  │
│  │                       │  │   - Name / ID         │  │
│  │   - glTF Model        │  │   - Types / Height    │  │
│  │   - Drag controls     │  │   - HP: ▒▒▒▒ (80)     │  │
│  └───────────────────────┘  └───────────────────────┘  │
├────────────────────────────────────────────────────────┤
│  Tab Navigation: [Evolution Chain] [Move Pool] [Media] │
├────────────────────────────────────────────────────────┤
│  Active Tab Content Panel                              │
└────────────────────────────────────────────────────────┘
```

- **Top Grid:** Dual-panel layout splitting the 3D model canvas on the left from core stats tables on the right.
- **Tab Navigation:** Toggles the lower section content (e.g., evolution flowcharts, move tables, media links) without reloading the page.

---

# 5. Team Builder Workspace Layout

Designed for complex stats planning.

- **Team Matrix:** A six-card grid representing team slots. Each card displays selection fields for species, move slots, held items, and EV/IV stats sliders.
- **Coverage Summary (Sticky Right Panel):** Displays cumulative stats and type weakness matrices. Updates dynamically as team slots are modified.

---

# 6. Living Dex Checklist Layout

Designed for high-density tracking.

- **Checklist Matrix:** Grid layout rendering small visual icon tiles for every Pokémon species (`grid-cols-6 sm:grid-cols-12 md:grid-cols-16`).
- **Completion Indicator:** Sticky top bar displaying total capture percentage trackers, shiny counts, and filter options.

---

# 7. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| UI/UX Requirements | `docs/01_Requirements/15_UI_UX_Requirements.md` |
| Component Design | `docs/02_Architecture/Component_Design.md` |
| Navigation Structure | `docs/04_UI_UX/Navigation_Structure.md` |

---

# Next Document

```
docs/04_UI_UX/Style_Guide.md
```

The Style Guide document specifies the CSS variables, animation timelines, color matrices, and typography rules for the project design system.
