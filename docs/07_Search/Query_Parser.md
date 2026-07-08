# Query Parser

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-SE-QP-001 |
| Document Name | Query Parser |
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
2. Tokenization & Regular Expression Mapping
3. Parameter Matching Engine
4. Prisma SQL Query Construction
5. References

---

# 1. Purpose and Scope

This Query Parser document specifies the query tokenization rules, regular expression parsing models, parameter matching engine, and Prisma SQL query builders for the search engine of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. The parser translates natural language search strings into structured database queries.

---

# 2. Tokenization & Regular Expression Mapping

The parser extracts key parameters from search strings.

- **Splitter Step:** The query is parsed using regular expressions to extract keywords and numeric comparison blocks.
- **Regex Patterns:**
  - **Type Extraction:** `/([a-zA-Z]+)-type/i` matches type descriptions (e.g., "Fire-type").
  - **Generation Extraction:** `/gen\s*(10|[1-9])/i` or `/generation\s*(x|ix|viii|vii|vi|v|iv|iii|ii|i)/i` matches generation filters.
  - **Stat Comparisons:** `/(speed|hp|attack|defense|spatk|spdef)\s*(>|<|=)\s*(\d+)/i` matches base stat criteria.

---

# 3. Parameter Matching Engine

Extracted tokens are mapped to database filter parameters:

- **Type Token:** Lookup matching records in the `types` table (e.g., "Water" -> Type ID UUID).
- **Generation Token:** Maps Roman/Arabic numerals to generation values (e.g., "Gen III" -> 3).
- **Keyword Tokens:** Remaining text is processed as a standard FTS keyword search (e.g., "Swift Swim").

---

# 4. Prisma SQL Query Construction

The matching engine compiles these parameters into a structured Prisma search payload:

```typescript
const searchFilters = {
  where: {
    generation: 3,
    types: {
      some: {
        type: { name: 'Water' }
      }
    },
    baseSpeed: { gt: 100 },
    searchVector: {
      matches: 'Swift & Swim'
    }
  }
};
```

- **Sanitization:** String tokens are parameterized to prevent SQL injection.
- **Empty Result Fallback:** If the structured query returns zero results, the system executes a fallback trigram similarity search on the search term.

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| System Features | `docs/01_Requirements/07_System_Features.md` |
| Data Requirements | `docs/01_Requirements/09_Data_Requirements.md` |
| Search Requirements | `docs/01_Requirements/10_Search_Requirements.md` |
| Interface Specifications | `docs/02_Architecture/Interface_Specifications.md` |
| Indexing Strategy | `docs/07_Search/Indexing_Strategy.md` |

---

# Next Document

```
docs/07_Search/Relevance_Scoring.md
```

The Relevance Scoring document defines keyword weighting equations, search result sorting structures, and query caching policies.
