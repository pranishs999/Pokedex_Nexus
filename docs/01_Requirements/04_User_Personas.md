# User Personas

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-UP-001 |
| Document Name | User Personas |
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
2. Persona Overview Table
3. Persona Profiles
4. Persona Scenarios & Platform Response
5. References

---

# 1. Purpose and Scope

This User Personas document outlines the detailed characteristics, technical experience levels, goals, and frustrations of the five primary target user groups for the Pokémon Knowledge Management Platform (PKMP) v1.0.0. These personas serve as the basis for user stories, UI/UX designs, and functional feature prioritizing.

---

# 2. Persona Overview Table

| ID | Name | Role | Tech Skill | Primary Device | Key Motivation |
|----|------|------|------------|----------------|----------------|
| **UP-01** | Liam Chen | Casual Fan | Low | iPhone / Mobile | Browse artwork, lore, and simple evolution paths |
| **UP-02** | Sarah Jenkins | Competitive Player | High | Desktop (Mac) | Build teams, compare stats, check type matchups |
| **UP-03** | Marcus Diaz | Collector | Medium | Android Phone | Track shiny collections and complete Living Dex |
| **UP-04** | Dr. Elena Rostova | Researcher | High | Desktop (Linux) | Export clean datasets, parse natural search parameters |
| **UP-05** | Christopher Vance | Administrator / Editor | High | Laptop (Windows) | Manage user profiles, import JSON seeds, moderate submissions |

---

# 3. Persona Profiles

## 3.1 UP-01 — Liam Chen (The Casual Fan)

- **Demographics:** Age 19, University Student.
- **Biography:** Liam has played Pokémon games since childhood. He is not interested in statistics or competitive IV breeding; he browses details to see regional variant artwork, read pokedex flavor entries, and look up evolution levels while playing casually.
- **Technical Environment:** iPhone 14 running Safari, standard 4G connection.
- **Core Goals:**
  - Locate evolution requirements (e.g., "how to evolve Galarian Slowpoke") quickly.
  - Browse Pokémon art assets and sprite histories easily.
  - Read lore across different game version releases.
- **Frustrations:**
  - Slow loading times on mobile devices.
  - Inundated with technical battle statistics (EVs, base stats totals) instead of core creature data.
  - Non-responsive layouts that require horizontal scrolling.

---

## 3.2 UP-02 — Sarah Jenkins (The Competitive Player)

- **Demographics:** Age 26, Software Engineer.
- **Biography:** Sarah participates in VGC tournaments. She requires precise data to model damage and optimize speed tiers. She builds teams dynamically, testing type coverage, status combinations, and move pool dependencies.
- **Technical Environment:** MacBook Pro running Chrome, high-speed fiber internet.
- **Core Goals:**
  - Build teams with custom item assignments, Natures, EVs, and IV variables.
  - Map weakness charts for custom teams to isolate defensive holes.
  - Compare statistics of similar Pokémon side-by-side.
- **Frustrations:**
  - Outdated or incorrect move databases.
  - Clunky user interfaces that slow down team building.
  - Inability to quickly share built teams via clean URL templates.

---

## 3.3 UP-03 — Marcus Diaz (The Collector)

- **Demographics:** Age 31, Marketing Manager.
- **Biography:** Marcus is dedicated to creating a "Living Dex" of shiny Pokémon across multiple game releases. He needs a reliable, visual tracking sheet to see which Pokémon he has collected and which remain.
- **Technical Environment:** Google Pixel 8 running Chrome Mobile, mixed WiFi and mobile data.
- **Core Goals:**
  - Maintain a persistent, visual checklist of all Pokémon.
  - Toggle and track shiny captures separately.
  - Keep checksheets synchronized between mobile and desktop devices.
- **Frustrations:**
  - Data loss due to browser storage clear-outs.
  - Inability to filter checklists by specific game versions or regions.
  - Complicated backup and export mechanisms.

---

## 3.4 UP-04 — Dr. Elena Rostova (The Researcher)

- **Demographics:** Age 38, Data Analyst.
- **Biography:** Elena creates analytical reports and content regarding the design evolution of the Pokémon franchise. She queries relationships across multiple datasets (e.g., matching Pokémon by generation, region, movie appearance, and TCG artist).
- **Technical Environment:** Ubuntu Linux Desktop running Firefox, stable connection.
- **Core Goals:**
  - Execute multi-parameter queries using natural language formatting (e.g., "Fire-types from Gen II with Mega Evolution").
  - Cross-reference movie datasets to see which Pokémon starred in which releases.
  - Export query results as clean JSON files.
- **Frustrations:**
  - Basic search inputs limited to single name lookups.
  - Missing cross-references between game data and media data (anime, manga).
  - Web scraping blocks on traditional wiki resources.

---

## 3.5 UP-05 — Christopher Vance (The Editor / Administrator)

- **Demographics:** Age 29, Systems Administrator.
- **Biography:** Christopher is a volunteer editor who helps compile datasets. He also acts as a site administrator, reviewing user-submitted Fakemon entries and checking system logging.
- **Technical Environment:** Windows 11 Laptop running Edge, corporate network.
- **Core Goals:**
  - Run JSON import pipelines, reviewing clear validation logs to fix parsing failures.
  - Audit database changes when errors are flagged.
  - Moderate community content queue items efficiently.
- **Frustrations:**
  - Poor feedback during import failures (opaque errors with no line number flags).
  - Lack of version history or rollback capabilities.
  - Convoluted moderation interfaces that require multiple tab clicks.

---

# 4. Persona Scenarios & Platform Response

To demonstrate how the platform responds to the needs of these personas, the following scenarios are mapped to functional design decisions.

| Persona | Scenario | Architectural / Design Response |
|---------|----------|--------------------------------|
| **UP-01 (Liam)** | Liam is playing on his phone and wants to find how to evolve his Pokémon. | Mobile-first responsive detail views, clear evolution chain visualization component, progressive disclosure of battle stats. |
| **UP-02 (Sarah)** | Sarah wants to optimize her competitive VGC team stats. | Interactive Team Builder with EV/IV sliders, type effectiveness analytics calculations, and dynamic comparison grid views. |
| **UP-03 (Marcus)** | Marcus wants to update his Living Dex tracker while traveling. | PWA offline capability, server-side persistence for authenticated users, optimistic UI state updates, local storage sync. |
| **UP-04 (Elena)** | Elena wants to find all Pokémon introduced in Sinnoh that appeared in a specific movie. | Intelligent search query parser converting natural language strings into filtered Prisma search criteria, cross-module media indexing. |
| **UP-05 (Christopher)** | Christopher needs to import Generation X data from JSON. | Strict Zod validation reporting line-by-line JSON failures, transactional import execution, database rollback, and unified CMS audit trail. |

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Context | `docs/00_Project_Management/01_Project_Context.md` |
| Vision and Goals | `docs/00_Project_Management/02_Vision_and_Goals.md` |
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Stakeholders | `docs/00_Project_Management/06_Stakeholders.md` |
| Functional Requirements | `docs/01_Requirements/02_Functional_Requirements.md` |

---

# Next Document

```
docs/01_Requirements/05_User_Stories.md
```

The User Stories document details the specific user stories mapping to user needs, complete with priorities, dependencies, and acceptance criteria.
