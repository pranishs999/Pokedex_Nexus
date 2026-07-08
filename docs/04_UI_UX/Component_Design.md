# UI Component Design

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-UCD-001 |
| Document Name | UI Component Design |
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
2. Reusable UI Components
3. Interactive States and Keyboards
4. References

---

# 1. Purpose and Scope

This UI Component Design document defines the layout parameters, interactive behaviors, states, focus treatments, and accessibility properties for individual reusable components on the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. Reusable UI Components

## 2.1 Pokémon Card Widget (`PokemonCard`)
Renders Pokémon species in grid layouts.

- **Structure:** Card panel container with image frame, National Dex ID badge, species name, and type badges.
- **Styling:** Glassmorphic background (`card-premium`) with a fixed height and border.
- **Aesthetic Hover:** Scaling transform (`hover:scale-102`) and border lighting transitions.

---

## 2.2 Advanced Search Dialog (`SearchAutocomplete`)
Renders the dropdown autocomplete interface.

- **Structure:** Absolute positioned overlay panel rendering dynamically beneath the search input.
- **Behavior:** Renders dynamic search matches as the user types, debounced by 200 ms.
- **Dismiss Control:** Closes on clicking outside the container or pressing `Escape`.

---

## 2.3 Interactive Stat Bar (`StatBar`)
Displays numeric stats dynamically.

- **Structure:** Label, actual numeric value, and progress track containing a colored indicator bar.
- **Color Coding:** Bar fills are colored according to stat strength:
  - **Weak (< 60):** Red (`hsl(350, 80%, 55%)`).
  - **Average (60–99):** Yellow (`hsl(45, 95%, 50%)`).
  - **Strong (≥ 100):** Green (`hsl(120, 75%, 45%)`).

---

# 3. Interactive States and Keyboards

To ensure WCAG 2.2 AA compliance (REQ-NFR-300), interactive components must support keyboard navigation and focus management:

- **Button States:** Focus indicators must be visible when navigating with tabs. Buttons must trigger actions on pressing `Enter` or `Space`.
- **Form Focus Traps:** Tab actions in modal panels (such as the Pokémon comparator selection) must cycle within the modal container.
- **Transition Timelines:** Tooltip overlays and details disclosures must open and close with a fade animation (duration: 150 ms, ease curve: ease-out).

---

# 4. References

## Internal Documents

| Document | Path |
|----------|------|
| Component Design | `docs/02_Architecture/Component_Design.md` |
| Navigation Structure | `docs/04_UI_UX/Navigation_Structure.md` |
| Page Layouts | `docs/04_UI_UX/Page_Layouts.md` |
| Style Guide | `docs/04_UI_UX/Style_Guide.md` |

---

# Next Document

```
docs/05_Modules/README.md
```

This completes the `04_UI_UX` documentation phase. The next document is `docs/05_Modules/README.md`, which kicks off the Modules phase by detailing module directories, service registries, dependency isolations, and public API interfaces.
