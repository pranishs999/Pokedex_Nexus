# Coding Standards

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-DEV-CS-001 |
| Document Name | Coding Standards |
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
2. TypeScript & Code Compiler Configurations
3. ESLint & Prettier Formatting Rules
4. Code Naming & Structure Conventions
5. References

---

# 1. Purpose and Scope

This Coding Standards document defines the TypeScript compiler settings, ESLint constraints, code formatting rules, directory naming conventions, and coding patterns for the applications and packages of the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. TypeScript & Code Compiler Configurations

Both the frontend and backend applications enforce strict TypeScript compiler options.

- **Compiler Options (`tsconfig.json`):**
  - `"strict": true` (Enables all strict type-checking options).
  - `"noImplicitAny": true` (Raises error on expressions and declarations with an implied 'any' type).
  - `"strictNullChecks": true` (Ensures `null` and `undefined` are handled explicitly).
  - `"noUnusedLocals": true` & `"noUnusedParameters": true` (Flags unused variables and parameters).
- **TypeScript Version:** Enforce TypeScript v5.x or higher across the workspace.

---

# 3. ESLint & Prettier Formatting Rules

Linting and formatting configurations are managed centrally in `/packages/config`.

- **ESLint Profile:** Extends `eslint:recommended`, `plugin:@typescript-eslint/recommended`, and `plugin:react-hooks/recommended`.
- **Prettier Code Layout Configuration:**
  - Single Quotes: `true`.
  - Trailing Commas: `'all'`.
  - Print Width Limit: `100` characters.
  - Tab Width: `2` spaces.
  - Semicolons: `true`.

---

# 4. Code Naming & Structure Conventions

To keep the codebase maintainable, developers must follow these naming conventions:

- **Files & Directories:**
  - Folders: lowercase, kebab-case (e.g., `pokemon-details`).
  - React Component Files: PascalCase (e.g., `PokemonCard.tsx`).
  - Service/Controller Files: camelCase with dot descriptors (e.g., `pokemon.service.ts`, `pokemon.controller.ts`).
- **Variables & Functions:** camelCase (e.g., `getPokemonDetails`).
- **Classes & Interfaces:** PascalCase (e.g., `class AuthController`, `interface IPokemonService`). Prefix interfaces with `I` to distinguish them from concrete classes.
- **Enums & Constants:** UPPERCASE with snake_case (e.g., `enum Role { ADMIN = 'ADMIN' }`, `const DEFAULT_PAGE_LIMIT = 20`).

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| Component Design | `docs/02_Architecture/Component_Design.md` |
| Interface Specifications | `docs/02_Architecture/Interface_Specifications.md` |
| Directory Structure | `docs/05_Modules/Directory_Structure.md` |
| Dependency Isolation | `docs/05_Modules/Dependency_Isolation.md` |

---

# Next Document

```
docs/08_Development/Git_Workflow.md
```

The Git Workflow document defines branch naming rules, commit conventions, and pull request requirements.
