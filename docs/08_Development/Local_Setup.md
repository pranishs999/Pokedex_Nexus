# Local Setup

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-DEV-LS-001 |
| Document Name | Local Setup |
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
2. System Prerequisites
3. Repository Initialization & Installation
4. Database & Seeding Configuration
5. Execution and Dev Verification
6. References

---

# 1. Purpose and Scope

This Local Setup document details the step-by-step installation instructions, environment configurations, and verification tasks for developers initializing the development workspace of the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. System Prerequisites

Before checking out the repository, ensure your development machine has these tools installed:

- **Node.js:** v20.x LTS or higher.
- **pnpm:** v8.x or higher (Enforces workspace resolution).
- **Docker Engine & Compose:** Required for running the database container locally without native installations.
- **Git:** v2.x or higher.

---

# 3. Repository Initialization & Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/username/pokedex-pkmp.git
   cd pokedex-pkmp
   ```

2. **Install Workspace Dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment template to create your local variables configuration file:
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

---

# 4. Database & Seeding Configuration

To spin up the database and populate it with official data, run:

1. **Start PostgreSQL Container:**
   ```bash
   docker-compose up -d postgres redis
   ```

2. **Execute Database Migrations:**
   Applies the 3NF table schemas to the local database:
   ```bash
   pnpm --filter @pkmp/types db:migrate
   ```

3. **Execute Idempotent Seeding Pipeline:**
   Reads JSON datasets and imports entries into the database:
   ```bash
   pnpm --filter @pkmp/types db:seed
   ```

---

# 5. Execution and Dev Verification

Verify your environment by launching the local development servers:

- **Launch All Services:**
  Starts the React client on port `5173` and the NestJS API on port `3000`:
  ```bash
   pnpm dev
   ```

- **Verification Tests:**
  Confirm that services compile and communicate by checking the logs:
  - React Web Page: Navigating to `http://localhost:5173` displays the Home search view.
  - NestJS Swagger Docs: Navigating to `http://localhost:3000/api/docs` displays the API playground interface.

---

# 6. References

## Internal Documents

| Document | Path |
|----------|------|
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| System Features | `docs/01_Requirements/07_System_Features.md` |
| Performance Requirements | `docs/01_Requirements/17_Performance_Requirements.md` |
| Database Requirements | `docs/01_Requirements/18_Database_Requirements.md` |
| Database Migrations | `docs/03_Database/Database_Migrations.md` |
| Coding Standards | `docs/08_Development/Coding_Standards.md` |
| Git Workflow | `docs/08_Development/Git_Workflow.md` |

---

# Next Document

```
docs/09_Testing/README.md
```

This completes the `08_Development` documentation phase. The next document is `docs/09_Testing/README.md`, which kicks off the Testing phase by detailing backend testing configurations, frontend React component specs, E2E playbooks, and load testing criteria.
