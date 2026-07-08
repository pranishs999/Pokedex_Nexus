# Indexing Strategy

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-SE-IS-001 |
| Document Name | Indexing Strategy |
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
2. GIN Index Architecture
3. Trigram Fuzzy Search Indexes
4. Sync Triggers and Database Functions
5. References

---

# 1. Purpose and Scope

This Indexing Strategy document defines the database indexing structures, trigram configurations, sync triggers, and query matching models for the search module of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. The search indexes are configured within the PostgreSQL database layer to meet performance targets.

---

# 2. GIN Index Architecture

The system uses GIN (Generalized Inverted Index) indexes to support fast full-text queries.

- **FTS Vector Target:** The `pokemon` and `moves` tables include a `search_vector` column of type `tsvector`.
- **Concat Model:** The vector concatenates columns to support single-query lookups:
  - **Weight A (High):** Name.
  - **Weight B (Medium):** Classification, Types, Abilities.
  - **Weight C (Low):** Flavor text.
- **Index Definition:** The GIN index is created using:

```sql
CREATE INDEX idx_pokemon_search_vector ON pokemon USING gin(search_vector);
```

---

# 3. Trigram Fuzzy Search Indexes

To handle typos and partial matches, the system uses the PostgreSQL `pg_trgm` extension.

- **Fuzzy Target:** The `name` columns of the `pokemon`, `moves`, and `abilities` tables.
- **Index Definition:** The trigram index is configured using `gin_trgm_ops`:

```sql
CREATE INDEX idx_pokemon_name_trgm ON pokemon USING gin(name gin_trgm_ops);
```

- **Execution Gate:** If the initial FTS search returns zero matches, the query fallback route triggers a trigram check matching names where `similarity(name, query) >= 0.3`.

---

# 4. Sync Triggers and Database Functions

To keep search vector columns synchronized, the system uses database triggers.

- **Trigger Function:** A PostgreSQL function is executed on INSERT or UPDATE events. It recalculates the `search_vector` by concatenating columns:

```sql
CREATE OR REPLACE FUNCTION pokemon_tsvector_trigger() RETURNS trigger AS $$
BEGIN
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.slug, '')), 'B');
  return new;
END
$$ LANGUAGE plpgsql;
```

- **Trigger Application:** The trigger is applied to the target table:

```sql
CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
ON pokemon FOR EACH ROW EXECUTE FUNCTION pokemon_tsvector_trigger();
```

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| System Features | `docs/01_Requirements/07_System_Features.md` |
| Data Requirements | `docs/01_Requirements/09_Data_Requirements.md` |
| Search Requirements | `docs/01_Requirements/10_Search_Requirements.md` |
| Performance Requirements | `docs/01_Requirements/17_Performance_Requirements.md` |
| Database Requirements | `docs/01_Requirements/18_Database_Requirements.md` |
| Schema Design | `docs/03_Database/Schema_Design.md` |

---

# Next Document

```
docs/07_Search/Query_Parser.md
```

The Query Parser document defines query tokenization models, regex parsers, parameter mappings, and SQL query builders.
