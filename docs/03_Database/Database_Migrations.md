# Database Migrations

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-DM-003 |
| Document Name | Database Migrations |
| Version | 1.0.0 |
| Status | Draft |
| Documentation Standard | IEEE 29148 + Prisma |
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
2. Migration Management & Standards
3. Idempotent Seeding Workflow
4. Reversion and Rollback Protocols
5. References

---

# 1. Purpose and Scope

This Database Migrations document defines the database migration standards, version control procedures, idempotent seeding workflows, and rollback protocols for the Pokémon Knowledge Management Platform (PKMP) v1.0.0. All schema mutations must follow these procedures.

---

# 2. Migration Management & Standards

- **Migration Tool:** Use Prisma Migrate to track schema changes.
- **Naming Standards:** Migration folders are generated automatically with a timestamp prefix and a descriptive suffix (e.g., `prisma/migrations/20260630120000_init_pokedex/`).
- **Review Pipeline:**
  - Raw SQL migration files (`migration.sql`) must be reviewed and checked into the version control repository.
  - Manual alterations inside production database instances are strictly prohibited.
- **Local Dev Sync:** Devs synchronize their local environments with the schema state using `npx prisma migrate dev`.

---

# 3. Idempotent Seeding Workflow

Seeding populates the database with initial encyclopedia records.

- **Storage Location:** Raw JSON seed files are stored in the `/datasets` directory.
- **Seeding Execution:** The seeding script is run via `npx prisma db seed`.
- **Idempotency Rule:** The seeding script must be idempotent. It checks for the existence of records using unique columns (e.g., `nationalNum` for Pokémon) and performs an `upsert` operation:

```typescript
await prisma.pokemon.upsert({
  where: { nationalNum: item.nationalNum },
  update: { ...itemData },
  create: { ...itemData },
});
```

---

# 4. Reversion and Rollback Protocols

If a migration fails in production, the system must trigger a rollback.

- **Transactional Rollback:** Prisma Migrate executes migration scripts inside SQL transactions. If a script fails midway, PostgreSQL automatically rollbacks all updates, leaving the schema in its pre-migration state.
- **Manual Schema Recovery:** If database schema drift is detected, Super Admins can restore the schema state to a previous version using:

```bash
# Mark a failed migration as rolled back in Prisma tracking tables
npx prisma migrate resolve --rolled-back "20260630120000_failed_migration"

# Re-apply the target schema migrations
npx prisma migrate deploy
```

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Database Requirements | `docs/01_Requirements/18_Database_Requirements.md` |
| System Architecture | `docs/02_Architecture/System_Architecture.md` |
| Schema Design | `docs/03_Database/Schema_Design.md` |
| Relational Mappings | `docs/03_Database/Relational_Mappings.md` |

---

# Next Document

```
docs/03_Database/Performance_Tuning.md
```

The Performance Tuning document defines the caching strategies, query optimizations, connection pooling settings, and indexing parameters.
