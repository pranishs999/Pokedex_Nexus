# Dependency Isolation

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-DI-001 |
| Document Name | Dependency Isolation |
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
2. Encapsulation & Boundary Rules
3. Circular Dependency Mitigation
4. Automated Boundary Verification
5. References

---

# 1. Purpose and Scope

This Dependency Isolation document defines the boundary guidelines, import constraints, encapsulation rules, and linting policies to prevent modular erosion in the modular monolith architecture of the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. Encapsulation & Boundary Rules

To ensure modules can be extracted into microservices in the future, developers must adhere to strict boundary rules.

- **Service-Only Communication:** Modules must access other module domains only by calling their exported services. Direct imports of another module's repositories, internal helper classes, or Prisma models are prohibited.
- **No Shared Database Joins:** Avoid cross-module SQL joins at the Prisma query level where possible. For instance, the `TeamBuilder` module must not perform a direct database join on the `pokemon` table; it must fetch Pokémon attributes by calling the `PokemonService` and mapping the IDs in memory.

```
[Forbidden Cross-Module Query]
Prisma.userTeam.findMany({ include: { pokemon: true } })

[Allowed Decoupled Workflow]
const teams = await prisma.userTeam.findMany();
const pokemon = await pokemonService.findByIds(teams.map(t => t.pokemonId));
```

---

# 3. Circular Dependency Mitigation

Circular dependencies occur when Module A imports Module B, and Module B simultaneously imports Module A.

- **Mitigation Strategies:**
  - **Extract Shared Code:** Extract shared data contracts (interfaces, helpers) into `/packages/types` or a dedicated shared service module.
  - **Forward References:** Use NestJS's `forwardRef` utility only as a last resort. If multiple forward references are required, it indicates a design flaw requiring refactoring.

---

# 4. Automated Boundary Verification

To prevent dependency violations, the build pipeline runs automated verification tools.

- **ESLint Import Rules:** The project ESLint configuration enforces directory boundary checks using the `eslint-plugin-import` plugin. Standard rules block importing files from outside the declared module boundary:

```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          "**/auth/*",
          "!**/auth/auth.module",
          "!**/auth/auth.service"
        ]
      }
    ]
  }
}
```

- **Dependency Cruiser:** The CI pipeline runs `dependency-cruiser` on every pull request to analyze the import graph and block merges if cross-module violations are detected.

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| System Architecture | `docs/02_Architecture/System_Architecture.md` |
| Component Design | `docs/02_Architecture/Component_Design.md` |
| Interface Specifications | `docs/02_Architecture/Interface_Specifications.md` |
| Directory Structure | `docs/05_Modules/Directory_Structure.md` |
| Service Registry | `docs/05_Modules/Service_Registry.md` |

---

# Next Document

```
docs/06_CMS/README.md
```

This completes the `05_Modules` documentation phase. The next document is `docs/06_CMS/README.md`, which kicks off the CMS design phase by detailing page configurations, form layouts, content fields, validation patterns, and version log displays.
