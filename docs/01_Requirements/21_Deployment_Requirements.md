# Deployment Requirements

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-DP-002 |
| Document Name | Deployment Requirements |
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
2. Containerization and Docker Configuration
3. Environment Setup & Configuration Variables
4. Host Infrastructure & SSL Configuration
5. CI/CD Release Pipeline
6. References

---

# 1. Purpose and Scope

This Deployment Requirements document defines the containerization rules, host configurations, environment setups, and GitHub Actions pipelines for the deployment of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. The platform is designed for a single-instance Docker deployment.

---

# 2. Containerization and Docker Configuration

The application is deployed using Docker containers to ensure environment consistency.

- **Multi-Stage Builds:**
  - **apps/api (Backend):** Use a multi-stage Dockerfile starting from `node:20-alpine`. Stage 1 compiles TypeScript using pnpm. Stage 2 copies only compiled files and production dependencies, minimizing image size.
  - **apps/web (Frontend):** Use a multi-stage build where Stage 1 builds the static assets. Stage 2 copies the assets to an Nginx image for optimized static file serving.
- **Docker Compose:** The repository must include a `docker-compose.yml` file to spin up the backend server, Nginx proxy, and a PostgreSQL instance in development.

---

# 3. Environment Setup & Configuration Variables

All environment-specific configurations must be loaded from variables at runtime.

- **Variables Required:**
  - `NODE_ENV`: Application environment (`development`, `production`).
  - `PORT`: API server port.
  - `DATABASE_URL`: PostgreSQL connection string.
  - `JWT_ACCESS_SECRET`: Secret key for access token generation.
  - `JWT_REFRESH_SECRET`: Secret key for refresh token rotation.
- **Secrets Management:** Do not store environment files (`.env`) in git. Add them to `.gitignore`. In production, inject secrets securely from the hosting environment.

---

# 4. Host Infrastructure & SSL Configuration

- **Target Instance:** A single virtual private server (VPS) running Linux (Ubuntu LTS).
- **Reverse Proxy:** Configure Nginx as a reverse proxy on the host to route traffic to the container ports, handle SSL/TLS termination, and manage rate limiting.
- **SSL Certificates:** Use Let's Encrypt certificates to enforce HTTPS on port 443, with automated renewal tasks.

---

# 5. CI/CD Release Pipeline

Continuous integration and deployment are automated using GitHub Actions.

```
┌────────────────────────────────────────────────────────┐
│               GitHub Actions CI Pipeline               │
├───────────────┬────────────────────────┬───────────────┤
│ Lint Checks   │ Unit Test Runner       │ Build Check   │
│ (pnpm lint)   │ (pnpm test)            │ (pnpm build)  │
└───────────────┴────────────────────────┴───────────────┘
```

- **Trigger Event:** Push events on the `main` branch or pull requests targeting `main`.
- **Pipeline Actions:**
  - Check out the repository.
  - Set up Node.js and cache pnpm dependencies.
  - Run lint checks, type checks, and automated tests.
  - Verify that both apps/api and apps/web compile without errors.
  - Build production Docker images and push them to the registry.

---

# 6. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Assumptions & Constraints | `docs/00_Project_Management/05_Assumptions_and_Constraints.md` |
| Project Timeline | `docs/00_Project_Management/08_Project_Timeline.md` |
| Security Requirements | `docs/01_Requirements/13_Security_Requirements.md` |

---

# Next Document

```
docs/01_Requirements/22_Legal_Requirements.md
```

The Legal Requirements document defines requirements for copyright compliance, fair use disclosures, user data handling, and licensing constraints.
