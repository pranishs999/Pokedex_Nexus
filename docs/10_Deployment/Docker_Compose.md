# Docker Compose Configuration

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-DEP-DC-001 |
| Document Name | Docker Compose Configuration |
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
2. Dockerfile Configurations (Apps)
3. Multi-container Compose Specification
4. Volumes & Network Mappings
5. References

---

# 1. Purpose and Scope

This Docker Compose Configuration document defines the Dockerfile configurations, multi-container orchestration rules, networks, volumes, and deployment scripts for the applications and services of the Pokémon Knowledge Management Platform (PKMP) v1.0.0.

---

# 2. Dockerfile Configurations (Apps)

To ensure small footprints, containers utilize multi-stage build files.

- **Backend API Dockerfile (`/apps/api/Dockerfile`):**
  - **Stage 1 (Build):** Starts from `node:20-alpine`, installs `pnpm`, copies files, and compiles TypeScript.
  - **Stage 2 (Run):** Copies only compiled JavaScript files and production dependencies, minimizing image sizes (≤ 150 MB).
- **Frontend Client Dockerfile (`/apps/web/Dockerfile`):**
  - **Stage 1 (Build):** Compiles static assets using Vitest/Vite.
  - **Stage 2 (Run):** Copies assets to an optimized `nginx:alpine` image for serving.

---

# 3. Multi-container Compose Specification

The platform is orchestrated locally and in staging using a single `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: pkmp
      POSTGRES_USER: pkmp_admin
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - pkmp-net
    restart: always

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    environment:
      DATABASE_URL: postgresql://pkmp_admin:password@postgres:5432/pkmp
      PORT: 3000
    depends_on:
      - postgres
    networks:
      - pkmp-net
    restart: always

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "80:80"
    depends_on:
      - api
    networks:
      - pkmp-net
    restart: always

volumes:
  pgdata:

networks:
  pkmp-net:
    driver: bridge
```

---

# 4. Volumes & Network Mappings

- **Volumes (`pgdata`):** Persists PostgreSQL database directories on the host system to prevent data loss when containers are restarted or rebuilt.
- **Networks (`pkmp-net`):** An isolated bridge network that secures container-to-container communication. Containers are referenced internally using service names (e.g., `postgres:5432`), preventing exposure of ports on the host system.

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| System Architecture | `docs/02_Architecture/System_Architecture.md` |
| Component Design | `docs/02_Architecture/Component_Design.md` |
| Deployment Requirements | `docs/01_Requirements/21_Deployment_Requirements.md` |
| Local Setup | `docs/08_Development/Local_Setup.md` |

---

# Next Document

```
docs/10_Deployment/Nginx_Configuration.md
```

The Nginx Configuration document defines reverse proxy routing settings, SSL certification automation, and rate limiting rules.
