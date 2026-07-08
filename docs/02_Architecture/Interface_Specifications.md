# Interface Specifications

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-IS-001 |
| Document Name | Interface Specifications |
| Version | 1.0.0 |
| Status | Draft |
| Documentation Standard | IEEE 29148 + Arc42 |
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
2. Core Service Contracts
3. Frontend API Client Interfaces
4. References

---

# 1. Purpose and Scope

This Interface Specifications document defines the backend NestJS service method signatures, class parameters, return types, and frontend API client methods of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. These contracts guide development to maintain clean boundaries between modules.

---

# 2. Core Service Contracts

Services communicate across module boundaries using typed signatures.

## 2.1 Pokémon Service (`PokemonService`)

Responsible for fetching, updating, and listing encyclopedia entries.

```typescript
export interface IPokemonService {
  /**
   * Retrieves a paginated list of Pokémon.
   */
  findAll(query: {
    page?: number;
    limit?: number;
    type?: string;
    generation?: number;
    includeCommunity?: boolean;
  }): Promise<{ data: PokemonSummary[]; total: number }>;

  /**
   * Retrieves detailed specifications of a Pokémon by ID or unique slug.
   */
  findOne(idOrSlug: string): Promise<PokemonDetails>;

  /**
   * Creates a new Pokémon entry (CMS/Admin only).
   */
  create(data: CreatePokemonDto, editorId: string): Promise<PokemonDetails>;

  /**
   * Updates an existing entry (CMS/Admin only).
   */
  update(id: string, data: UpdatePokemonDto, editorId: string): Promise<PokemonDetails>;
}
```

---

## 2.2 Search Service (`SearchService`)

Responsible for NLP query parsing and FTS SQL execution.

```typescript
export interface ISearchService {
  /**
   * Parses natural language search strings into structured queries.
   */
  parseQueryString(query: string): SearchFilters;

  /**
   * Runs the parsed search query on the database.
   */
  executeSearch(
    parsedQuery: SearchFilters,
    pagination: { cursor?: string; limit?: number }
  ): Promise<SearchResult[]>;

  /**
   * Fetches autocomplete suggestions as the user types.
   */
  getSuggestions(query: string): Promise<SuggestionResult[]>;
}
```

---

## 2.3 Import Service (`ImportService`)

Responsible for validating and seeding external JSON files.

```typescript
export interface IImportService {
  /**
   * Validates a JSON payload against Zod schemas and reference parameters.
   */
  validateDataset(fileContent: string, schemaType: 'pokemon' | 'moves' | 'abilities'): Promise<ValidationReport>;

  /**
   * Commits the JSON dataset inside a single SQL transaction.
   */
  executeImportTransaction(
    fileContent: string,
    schemaType: 'pokemon' | 'moves' | 'abilities',
    editorId: string
  ): Promise<ImportSummary>;
}
```

---

# 3. Frontend API Client Interfaces

The frontend utilizes a typed fetch client wrapper to handle API requests.

```typescript
export class ApiClient {
  /**
   * Performs an authenticated API call, automatically handling access token refreshes.
   */
  private async request<T>(path: string, options?: RequestInit): Promise<T>;

  /**
   * Authenticates the user and sets up session states.
   */
  login(credentials: LoginCredentialsDto): Promise<UserSession>;

  /**
   * Retrieves a list of Pokémon.
   */
  getPokemon(filters: PokemonQueryFilters): Promise<PaginatedResponse<PokemonSummary>>;

  /**
   * Saves a custom team configuration.
   */
  saveTeam(teamData: SaveTeamDto): Promise<TeamSummary>;
}
```

---

# 4. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Decision Log | `docs/00_Project_Management/10_Decision_Log.md` |
| API Requirements | `docs/01_Requirements/14_API_Requirements.md` |
| System Architecture | `docs/02_Architecture/System_Architecture.md` |
| Component Design | `docs/02_Architecture/Component_Design.md` |

---

# Next Document

```
docs/03_Database/README.md
```

This completes the `02_Architecture` documentation phase. The next document is `docs/03_Database/README.md`, which kicks off the Database design phase by outlining schema models, relational mappings, data migration guides, and indexing setups.
