# Integration Requirements

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-IN-002 |
| Document Name | Integration Requirements |
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
2. Monorepo Package Integration
3. Database & ORM Integration
4. File System Dataset Import Integration
5. Cross-Module Content Integration
6. References

---

# 1. Purpose and Scope

This Integration Requirements document defines the specifications for package sharing in the monorepo, backend database connections, and JSON dataset import interfaces of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. The platform is built as a self-contained modular monolith with zero runtime dependencies on external third-party data APIs.

---

# 2. Monorepo Package Integration

The system uses a pnpm workspaces monorepo structure to share code between the frontend client and the backend server.

- **Shared Configuration Packages:**
  - `packages/config`: Share ESLint rules, Prettier formatting parameters, and TypeScript configurations across apps.
  - `packages/styles`: Share Tailwind CSS v4 variables and custom brand design tokens.
- **Shared Types:**
  - Share Prisma-generated database types and Zod validation schemas between `/apps/api` and `/apps/web` to ensure end-to-end type safety.
- **Dependency Isolation:** Apps must declare their local dependency mappings in their `package.json` configurations (e.g., `"@pkmp/styles": "workspace:*"`).

---

# 3. Database & ORM Integration

- **Prisma Client:** The NestJS API connects to the PostgreSQL database using the auto-generated Prisma Client service layer.
- **Connection Configuration:**
  - Load the database URL from environment variables (`DATABASE_URL`).
  - Configure the connection pool to limit active connections to `connection_limit=10` in development and a scaled amount in production.
- **Health Checks:** NestJS must provide health check endpoints (`/api/v1/health`) that ping the database using Terminus to verify connectivity.

---

# 4. File System Dataset Import Integration

The JSON dataset import pipeline is executed via CLI command scripts.

- **Data Sourcing Directory:** Place raw JSON files in the `/datasets` directory in the root of the workspace.
- **Parser Interface:** The NestJS seeding script loads the JSON files, validates the structure using Zod schemas, maps records to DTO models, and writes the records to the database using transactional Prisma queries.

---

# 5. Cross-Module Content Integration

To maintain database integrity, cross-module lookup queries must follow strict conventions.

- **Encyclopedia to Media Integrations:**
  - Map relationships between Pokémon records and media records (Anime episodes, Manga volumes, Movies, TCG cards) in the database using foreign keys.
  - Querying a Pokémon detail page must fetch its associated media records using database joins.
- **Community Content Isolation:** Enforce a query filter `source_type = OFFICIAL` by default. Community content submissions are only visible in public views when explicitly opted in by the user.

---

# 6. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Decision Log | `docs/00_Project_Management/10_Decision_Log.md` |
| Data Requirements | `docs/01_Requirements/09_Data_Requirements.md` |
| Database Requirements | `docs/01_Requirements/18_Database_Requirements.md` |

---

# Next Document

```
docs/01_Requirements/21_Deployment_Requirements.md
```

The Deployment Requirements document defines requirements for containerization, environment setup, and release pipelines.
