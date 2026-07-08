# Search Requirements

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-SR-002 |
| Document Name | Search Requirements |
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
2. Core Search Features
3. Query Parser Specifications
4. Indexing & Database Requirements
5. Performance and Response Budgets
6. References

---

# 1. Purpose and Scope

This Search Requirements document defines the indexing criteria, text tokenizer logic, natural language parsing behavior, database query patterns, and performance limits for the search engine of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. The search system must operate entirely within the PostgreSQL database layer (C-05) while meeting strict latency budgets.

---

# 2. Core Search Features

The platform must support three distinct query mechanisms:

## 2.1 Full-Text Search (FTS)
- **Engine:** PostgreSQL built-in FTS.
- **Language Dictionary:** English (`english` search config).
- **Target Fields:** Pokémon name, description, moves, ability descriptions, and location details.
- **Lexeme Weighting:** Search fields are weighted as follows to optimize result ranking:
  - **Weight A (High):** Pokémon Name, Move Name, Ability Name.
  - **Weight B (Medium):** Category, Type, Region Name.
  - **Weight C (Low):** Pokédex flavor text, lore description, effect descriptions.

## 2.2 Trigram Fuzzy Search
- **Extension:** `pg_trgm`.
- **Trigger:** Initiates automatically if the FTS query returns zero matches, or when executing autocomplete inputs.
- **Threshold:** Similarity score must be ≥ 0.3 to be returned as a fuzzy match.

## 2.3 Search Autocomplete
- **Interface:** Dynamic input dropdown.
- **Debounce Window:** 200 ms client-side debounce delay before hitting API.
- **Result Caps:** Maximum of 8 matched entries displayed in the dropdown.

---

# 3. Query Parser Specifications

The backend must intercept raw text search entries and tokenize them to map entities, avoiding simple string matching.

## 3.1 Tokenization Mapping Rules

| Token Pattern | Target DB Entity | Action |
|---------------|------------------|--------|
| Matches Type name (e.g., "Water", "Fire") | `types.name` | Apply relational type filter. |
| Matches Generation (e.g., "Gen 3", "Generation III")| `pokemon.generation` | Filter by corresponding generation index. |
| Matches Ability (e.g., "Intimidate") | `abilities.name` | Join and filter by ability association. |
| Matches Move name (e.g., "Tackle") | `moves.name` | Join and filter by move associations. |
| Contains comparison stats (e.g., "Speed > 100") | `pokemon.base_speed` | Add numeric database comparison clause. |

### Parser Flow

```
"Fire-types from Gen III with Speed > 100"
   │
   ├── Token 1: "Fire-types" ────► Filter: Type = "Fire"
   ├── Token 2: "Gen III" ────────► Filter: Generation = 3
   └── Token 3: "Speed > 100" ────► Filter: base_speed > 100
```

---

# 4. Indexing & Database Requirements

To support search capabilities without a dedicated search cluster (e.g., Elasticsearch), the PostgreSQL database must configure GIN (Generalized Inverted Index) indices.

## 4.1 Index Setup

- **`idx_pokemon_fts`:** A GIN index on a pre-generated `tsvector` column (`search_vector`) in the `pokemon` table. The column concatenates name, type, and description.
- **`idx_pokemon_name_trgm`:** A GIN index using `gin_trgm_ops` on the `pokemon.name` column for fuzzy matches.
- **`idx_moves_fts`:** A GIN index on `to_tsvector('english', name || ' ' || description)` in the `moves` table.

## 4.2 Search Database Configuration
Database migrations must configure a PostgreSQL function and trigger to keep the `search_vector` column synchronized on update.

```sql
CREATE FUNCTION pokemon_tsvector_trigger() RETURNS trigger AS $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.classification, '')), 'B');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
ON pokemon FOR EACH ROW EXECUTE FUNCTION pokemon_tsvector_trigger();
```

---

# 5. Performance and Response Budgets

- **Execution Latency:** Search queries must execute at the database level in ≤ 150 ms (REQ-NFR-102).
- **API Boundary Latency:** Server-side search API response times must meet the p95 ≤ 200 ms and p99 ≤ 500 ms targets (REQ-NFR-101).
- **Memory Footprint:** Cache indexes must limit RAM consumption to prevent database performance degradation under load.

---

# 6. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Assumptions & Constraints | `docs/00_Project_Management/05_Assumptions_and_Constraints.md` |
| Decision Log | `docs/00_Project_Management/10_Decision_Log.md` |
| Functional Requirements | `docs/01_Requirements/02_Functional_Requirements.md` |
| Non-Functional Requirements | `docs/01_Requirements/03_Non_Functional_Requirements.md` |
| Data Requirements | `docs/01_Requirements/09_Data_Requirements.md` |

---

# Next Document

```
docs/01_Requirements/11_CMS_Requirements.md
```

The CMS Requirements document defines requirements for the content editor panel, import validation interfaces, version control tracking, and database rollback tools.
