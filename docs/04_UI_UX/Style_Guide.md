# Style Guide

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-SG-001 |
| Document Name | Style Guide |
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
2. Core Theme Variables (CSS)
3. Type-Specific Color Matrix
4. Typography & Scaling
5. Design System Classes (Tailwind)
6. Animation & Transition Curves
7. References

---

# 1. Purpose and Scope

This Style Guide document specifies the CSS variables, HSL color palettes, typography scales, glassmorphic component styles, and animation curves for the design system of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. All elements must follow these variables to maintain design consistency.

---

# 2. Core Theme Variables (CSS)

Configured within `index.css` under the `@theme` directive in Tailwind CSS v4.

```css
@theme {
  --color-bg-base: hsl(220, 20%, 8%);
  --color-bg-surface: hsl(220, 20%, 14%);
  --color-bg-surface-glass: hsla(220, 20%, 14%, 0.6);
  --color-border-subtle: hsl(220, 15%, 22%);
  --color-text-primary: hsl(210, 20%, 98%);
  --color-text-secondary: hsl(210, 10%, 70%);
  --color-accent-red: hsl(350, 80%, 55%);
  --color-accent-blue: hsl(200, 85%, 60%);
  
  --backdrop-blur-glass: blur(12px);
  --shadow-premium: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

---

# 3. Type-Specific Color Matrix

To ensure consistency across the encyclopedia, use these standardized HSL color tokens for the 18 Pokémon elements.

| Type | HSL Value | Hex Code Reference |
|------|-----------|--------------------|
| **Normal** | `hsl(60, 5%, 60%)` | `#909090` |
| **Fire** | `hsl(18, 90%, 55%)` | `#F08030` |
| **Water** | `hsl(210, 90%, 55%)` | `#6890F0` |
| **Grass** | `hsl(120, 75%, 45%)` | `#78C850` |
| **Electric** | `hsl(45, 95%, 50%)` | `#F8D030` |
| **Ice** | `hsl(180, 75%, 65%)` | `#98D8D8` |
| **Fighting** | `hsl(0, 85%, 40%)` | `#C03028` |
| **Poison** | `hsl(300, 70%, 40%)` | `#A040A0` |
| **Ground** | `hsl(35, 75%, 60%)` | `#E0C068` |
| **Flying** | `hsl(250, 80%, 70%)` | `#A890F0` |
| **Psychic** | `hsl(340, 95%, 55%)` | `#F85888` |
| **Bug** | `hsl(75, 80%, 45%)` | `#A8B820` |
| **Rock** | `hsl(40, 60%, 45%)` | `#B8A038` |
| **Ghost** | `hsl(260, 50%, 40%)` | `#705898` |
| **Dragon** | `hsl(255, 85%, 50%)` | `#7038F8` |
| **Dark** | `hsl(20, 20%, 25%)` | `#705848` |
| **Steel** | `hsl(210, 20%, 70%)` | `#B8B8D0` |
| **Fairy** | `hsl(330, 85%, 70%)` | `#EE99AC` |

---

# 4. Typography & Scaling

- **Font Family:** `font-sans: 'Outfit', sans-serif;`
- **Sizing Scale:**
  - `text-xs`: `0.75rem` (12px) | Helper labels
  - `text-sm`: `0.875rem` (14px) | Table cells, body copy
  - `text-base`: `1rem` (16px) | Default text
  - `text-lg`: `1.125rem` (18px) | Subheaders
  - `text-2xl`: `1.5rem` (24px) | Card titles
  - `text-4xl`: `2.25rem` (36px) | Section headers
  - `text-6xl`: `3.75rem` (60px) | Large hero stats

---

# 5. Design System Classes (Tailwind)

Use these utility abstractions to maintain styling consistency:

- **Glassmorphic Card Panel (`.card-premium`):**
  `bg-[var(--color-bg-surface-glass)] border border-[var(--color-border-subtle)] backdrop-blur-[var(--backdrop-blur-glass)] shadow-[var(--shadow-premium)] rounded-xl`
- **Input Focus State (`.input-premium`):**
  `focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-accent-blue)] transition-all duration-200`

---

# 6. Animation & Transition Curves

- **Ease Curve:** Use cubic-bezier curves for smooth UI transitions:
  `transition-all duration-200 cubic-bezier(0.4, 0, 0.2, 1)`
- **Loading Pulse:** Skeletons must use a custom opacity keyframe:
  `@keyframes skeleton-pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.3; } }`

---

# 7. References

## Internal Documents

| Document | Path |
|----------|------|
| Vision and Goals | `docs/00_Project_Management/02_Vision_and_Goals.md` |
| UI/UX Requirements | `docs/01_Requirements/15_UI_UX_Requirements.md` |
| Accessibility Requirements | `docs/01_Requirements/16_Accessibility_Requirements.md` |
| Component Design | `docs/02_Architecture/Component_Design.md` |
| Page Layouts | `docs/04_UI_UX/Page_Layouts.md` |

---

# Next Document

```
docs/04_UI_UX/Component_Design.md
```

The UI Component Design document defines layout boundaries, interaction triggers, states, and accessibility properties for individual reusable components.
