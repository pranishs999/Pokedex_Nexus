# Import Validation

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-CMS-IV-001 |
| Document Name | Import Validation |
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
2. Zod Parsing Specifications
3. Database Transaction Boundaries
4. Error Reporting Format
5. References

---

# 1. Purpose and Scope

This Import Validation document defines the Zod schema criteria, validation pipelines, bulk transaction check points, database transaction boundaries, and verification logging formats for dataset ingestion into the Pokémon Knowledge Management Platform (PKMP) v1.0.0. The pipeline prevents corrupt data from contaminating the database.

---

# 2. Zod Parsing Specifications

The import engine parses raw JSON files, running strict schema checks on each object:

```typescript
import { z } from 'zod';

export const ImportPokemonSchema = z.object({
  national_num: z.number().int().positive(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  base_hp: z.number().int().min(1).max(255),
  base_attack: z.number().int().min(1).max(255),
  base_defense: z.number().int().min(1).max(255),
  base_sp_attack: z.number().int().min(1).max(255),
  base_sp_defense: z.number().int().min(1).max(255),
  base_speed: z.number().int().min(1).max(255),
  height: z.number().positive(),
  weight: z.number().positive(),
  gender_ratio: z.number().min(-1).max(1),
  catch_rate: z.number().int().min(1).max(255),
  base_exp: z.number().int().nonnegative(),
  types: z.array(z.string().min(1)).min(1).max(2),
  abilities: z.array(z.object({
    name: z.string().min(1),
    is_hidden: z.boolean().default(false),
  })).min(1),
});
```

---

# 3. Database Transaction Boundaries

To maintain data integrity, imports execute in a single SQL transaction block.

- **Transactional Scope:** Prisma executes all write operations inside `prisma.$transaction()`.
- **Validation Gates:** If a validation or reference check fails, the transaction is aborted. PostgreSQL performs a rollback, leaving database records in their pre-import state.
- **Reference Resolution:** Before writing a Pokémon record, the import service verifies that all assigned types, moves, and abilities exist in the database.

---

# 4. Error Reporting Format

When an import fails, the server must return a structured JSON report:

```json
{
  "status": "FAILED",
  "fileName": "pokemon-gen10.json",
  "timestamp": "2026-06-30T16:09:33Z",
  "errorCount": 1,
  "failures": [
    {
      "index": 12,
      "name": "MissingNo",
      "field": "base_hp",
      "value": -10,
      "issue": "Number must be greater than or equal to 1"
    }
  ]
}
```

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Business Rules | `docs/01_Requirements/08_Business_Rules.md` |
| Data Requirements | `docs/01_Requirements/09_Data_Requirements.md` |
| CMS Requirements | `docs/01_Requirements/11_CMS_Requirements.md` |
| Database Requirements | `docs/01_Requirements/18_Database_Requirements.md` |
| Integration Requirements | `docs/01_Requirements/20_Integration_Requirements.md` |
| Schema Design | `docs/03_Database/Schema_Design.md` |

---

# Next Document

```
docs/06_CMS/Version_Control.md
```

The Version Control document defines the database auditing models, history log interfaces, and database rollback execution rules.
