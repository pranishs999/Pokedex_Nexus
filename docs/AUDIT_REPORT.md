# PKMP Repository Audit Report

**Date:** July 8, 2026  
**Auditor:** Antigravity AI pair programmer  
**Project Version:** 1.0.0  
**Status:** Discovery & Assessment  

---

## 1. Executive Summary

This audit report compares the active implementation of the **Pokémon Knowledge Management Platform (PKMP)** against the documentation inside the `docs/` folder (the single source of truth). 

As instructed by the project guidelines (**"Do not redesign the project. Improve the implementation to match the documentation"**), the goal of this audit is to identify all gaps, mismatches, and architectural discrepancies without rewriting the primary tech stack (which remains Express.js + Drizzle ORM + Wouter), while identifying concrete code improvements that align the project behavior, styling, and design with the documentation standards.

---

## 2. Technical Stack & Structure Discrepancies

The following core differences exist in the folder structures, frameworks, and packages between the current repository and the documentation:

| Dimension | Documentation Standard | Active Implementation | Resolution Strategy |
| :--- | :--- | :--- | :--- |
| **Monorepo Directory** | `/apps/web/`, `/apps/api/`, `/packages/types/` | `/artifacts/pkmp/`, `/artifacts/api-server/`, `/lib/` | Keep current directory names to prevent workspace disruption. |
| **API Framework** | NestJS | Express.js | Maintain Express.js backend; enforce modularity & route rules via clean folder routes. |
| **Database ORM** | Prisma | Drizzle ORM | Maintain Drizzle ORM; align fields and tables to represent the documented schema. |
| **Client Router** | TanStack Router (File-based) | Wouter (Client-side routing) | Maintain Wouter; map all requested paths under `App.tsx` routes. |

---

## 3. Database Schema & Data Sourcing Gaps

### 3.1 Schema Differences
The current Drizzle database schema (`lib/db/src/schema/`) differs from the specifications in `docs/03_Database/Schema_Design.md`:
* **ID Format:** The documentation specifies UUIDs for all primary keys (e.g., `id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid`). The current database schema uses auto-incrementing serial integers (`serial("id").primaryKey()`).
* **Column Naming:** 
  * The documentation specifies `nationalNum` (UUID/integer, unique) in the `pokemon` table. The codebase uses `nationalDexNumber`.
  * The documentation specifies stat fields like `baseHp`, `baseAttack`, `baseDefense`, etc. The codebase uses `statHp`, `statAttack`, etc.
* **Missing Fields:**
  * The `pokemon` table lacks `sourceType` (default: `"OFFICIAL"`).
  * The `pokemon` table lacks `searchVector` for Full-Text Search indexing.
* **Role Mappings:** The documentation specifies a five-level role enum (`USER`, `MODERATOR`, `EDITOR`, `ADMIN`, `SUPERADMIN`). The database schema only specifies two roles (`"user"`, `"admin"`).

### 3.2 Data Sourcing & Dependency Gap
* **Critical Issue:** `docs/README.md` states: *"Unlike traditional Pokédex websites, PKMP does not depend on third-party runtime APIs. All data is validated, version-controlled, imported into a PostgreSQL database, and served by the platform itself."*
* **Active Code:** The running backend currently initializes `pokeapiService` which fetches and caches all 1,025 Pokémon from `pokeapi.co` in-memory on startup. Routes query this memory cache directly rather than query the PostgreSQL database.
* **Resolution:** Ensure routes pull directly from the PostgreSQL database populated by the seed script, using the database as the runtime source of truth.

---

## 4. UI/UX & Styling Gaps

The styling defined in the design system has several key mismatches with `docs/04_UI_UX/Style_Guide.md` and `docs/04_UI_UX/Component_Design.md`:

### 4.1 Typography & Fonts
* **Font Family:** The Style Guide requires `'Outfit', sans-serif` as the primary typography face. The current `index.css` imports and uses `'Inter'` and `'Rajdhani'`.
* **Sizing/Weight Scale:** Minor scale adjustments are needed to enforce standard Outfit font utility mappings.

### 4.2 Color System
* **Core Palette:** The Style Guide defines HSL variables like `--color-bg-base`, `--color-bg-surface-glass`, `--color-border-subtle`. These are missing in the CSS theme layers.
* **Type Color Mapping:** The codebase uses custom static hex values (e.g., `#A8A878` for Normal). The Style Guide requires precise HSL colors (e.g., `hsl(60, 5%, 60%)`).

### 4.3 Key Components
* **PokemonCard Component:** Uses `.glass-card` instead of the documented `.card-premium` class token.
* **StatBar Component:** The stat strengths are currently colored using different threshold values (`<50`, `<90`, `<120`). They must be updated to match the documentation:
  * **Weak (< 60):** Red (`hsl(350, 80%, 55%)`)
  * **Average (60–99):** Yellow (`hsl(45, 95%, 50%)`)
  * **Strong (≥ 100):** Green (`hsl(120, 75%, 45%)`)
* **SearchAutocomplete:** Autocomplete dropdown results overlay panel under the search input is missing.

---

## 5. Routing & Page Navigation Gaps

Multiple paths defined in the navigation sitemap (`docs/04_UI_UX/Navigation_Structure.md`) are completely missing from the client application router:

| Route Path | Specification Description | Active Frontend Status |
| :--- | :--- | :--- |
| `/moves` | Moves Catalog List page | ❌ Missing |
| `/moves/:id` | Move Details page | ❌ Missing |
| `/abilities` | Abilities Catalog List page | ❌ Missing |
| `/teams` | Team Builder Workspace page | ❌ Missing |
| `/collections` | Living Dex Checksheet Dashboard | ❌ Missing |
| `/collections/shiny` | Shiny Collector Checklist | ❌ Missing |
| `/admin` | Admin Health Dashboard / Log Console | ❌ Missing |
| `/admin/submissions` | Moderation queue list | ❌ Missing |
| `/admin/logs` | System Audit Log Reader | ❌ Missing |
| `/login` / `/register` | Authentication page views | ❌ Missing |
| `/profile` | User Profile settings management page | ❌ Missing |

Additionally, the frontend AuthContext is implemented as a static mock, meaning user login, register, profile update, and admin guard checks are non-functional in the UI.

---

## 6. Audit Recommendations & Alignment Plan

To align the implementation with the documentation without breaking the structural Express/Drizzle choices, the following fixes are proposed:

1. **Update component logic:** Fix threshold mappings in `StatBar.tsx` and classes in `PokemonCard.tsx`.
2. **Standardize index.css:** Import the `Outfit` Google Font, add the `@theme` variables, and define utility classes (`.card-premium`, `.input-premium`) as requested.
3. **Bridge AuthContext to Backend API:** Wire up frontend authentication context to utilize the generated `useLogin`, `useRegister`, `useLogout`, and `useGetMe` React Query hooks.
4. **Implement Missing Core Pages:** Create simple, beautiful placeholder/MVP page components for `/login`, `/register`, `/profile`, `/moves`, `/abilities`, `/teams`, `/collections`, and `/admin` so they load successfully when accessed.
5. **Update Task Logs:** Mark all audit tasks as completed.
