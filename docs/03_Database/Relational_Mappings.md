# Relational Mappings

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-RM-002 |
| Document Name | Relational Mappings |
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
2. Primary and Foreign Keys Mapping
3. Join Tables and Custom Metadata
4. Cascade Rules & Referral Integrity
5. Indexing on Foreign Keys
6. References

---

# 1. Purpose and Scope

This Relational Mappings document defines the primary and foreign key constraints, join table configurations, cascading delete actions, and relational indexing strategies for the PostgreSQL database of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. These mappings are enforced at the database layer via Prisma.

---

# 2. Primary and Foreign Keys Mapping

All tables must configure explicit primary and foreign keys to preserve data associations.

- **Primary Keys:** Every table must designate a single UUID primary key column. By default, keys are auto-generated on insertion using the database function `gen_random_uuid()`.
- **Foreign Keys:** Must reference the exact primary key of the target table. All foreign keys must have corresponding B-Tree indexes to optimize query execution during joins.

---

# 3. Join Tables and Custom Metadata

Many-to-Many relationships are implemented using explicit join tables.

## 3.1 `pokemon_moves` Table
Maps which moves a Pokémon can learn, including learning conditions.

```prisma
model PokemonMove {
  pokemonId   String   @map("pokemon_id") @db.Uuid
  moveId      String   @map("move_id") @db.Uuid
  learnMethod String   @map("learn_method") // LEVELUP, TM, EGG, TUTOR
  levelLearned Int     @default(0) @map("level_learned")
  pokemon     Pokemon  @relation(fields: [pokemonId], references: [id], onDelete: Cascade)
  move        Move     @relation(fields: [moveId], references: [id], onDelete: Restrict)

  @@id([pokemonId, moveId, learnMethod, levelLearned])
  @@map("pokemon_moves")
}
```

---

# 4. Cascade Rules & Referral Integrity

To prevent orphaned records and maintain referential integrity, delete constraints are configured based on data category.

```
          Delete Trigger Action
                    │
      ┌─────────────┴─────────────┐
      ▼                           ▼
[Core Data]                 [User Data]
(Pokemon, Moves, Types)     (Profiles, Teams)
      │                           │
  Restrict                     Cascade
```

- **Restrict Delete (`onDelete: Restrict`):**
  - Attempting to delete a Core entity (e.g., Type, Move, Ability) that is referenced by a Pokémon record will throw a database exception.
- **Cascade Delete (`onDelete: Cascade`):**
  - Deleting a User account automatically deletes all associated user teams, collections, and session records.

---

# 5. Indexing on Foreign Keys

To prevent sequential table scans during relational queries, B-Tree indexes are configured on all foreign key columns:

- `idx_pokemon_types_type_id` on `pokemon_types(type_id)`
- `idx_pokemon_abilities_ability_id` on `pokemon_abilities(ability_id)`
- `idx_pokemon_moves_move_id` on `pokemon_moves(move_id)`
- `idx_user_teams_user_id` on `user_teams(user_id)`

---

# 6. References

## Internal Documents

| Document | Path |
|----------|------|
| Data Requirements | `docs/01_Requirements/09_Data_Requirements.md` |
| Database Requirements | `docs/01_Requirements/18_Database_Requirements.md` |
| System Architecture | `docs/02_Architecture/System_Architecture.md` |
| Component Design | `docs/02_Architecture/Component_Design.md` |
| Schema Design | `docs/03_Database/Schema_Design.md` |

---

# Next Document

```
docs/03_Database/Database_Migrations.md
```

The Database Migrations document defines the rules, script numbering standards, seeding workflows, and schema rollback procedures.
