# Service Registry

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-SR-003 |
| Document Name | Service Registry |
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
2. NestJS Module Registry Map
3. Core Module Exports & Imports
4. Custom Factory Providers
5. References

---

# 1. Purpose and Scope

This Service Registry document specifies the NestJS dependency injection registry configurations, module exports, and service bindings for the backend API of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. These registries manage module instantiation and service visibility.

---

# 2. NestJS Module Registry Map

The backend application boots by loading the `AppModule`, which imports and configures all domain modules.

```
                  ┌──────────────────────┐
                  │      AppModule       │
                  └──────────┬───────────┘
      ┌──────────────────────┼──────────────────────┐
      ▼                      ▼                      ▼
┌───────────┐          ┌───────────┐          ┌───────────┐
│AuthModule │          │PokemonMod │          │ImportMod  │
└───────────┘          └───────────┘          └───────────┘
```

- **AppModule Configuration (`app.module.ts`):**
  Imports: `ConfigModule.forRoot()`, `PrismaModule`, `AuthModule`, `PokemonModule`, `SearchModule`, `ImportModule`, `AuditModule`.

---

# 3. Core Module Exports & Imports

To maintain dependency isolation, services must be explicitly exported from their parent module before they can be imported and consumed by other modules.

## 3.1 Prisma Module (`prisma.module.ts`)
Registers and exports the Prisma Client instance.

- **Providers:** `PrismaService` (implements `OnModuleInit` to handle database connections).
- **Exports:** `PrismaService`.

## 3.2 Pokémon Module (`pokemon.module.ts`)
Registers encyclopedia services.

- **Imports:** `PrismaModule`.
- **Providers:** `PokemonService`.
- **Exports:** `PokemonService` (required by the Search Module to fetch Pokémon details during indexing).

---

# 4. Custom Factory Providers

For dynamic service configurations, NestJS custom factory providers are configured.

## 4.1 Search Parser Provider
The Search Module configures a custom provider for the natural language parser:

```typescript
import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { QueryParser } from './parser/query-parser';

@Module({
  imports: [PokemonModule, MovesModule],
  controllers: [SearchController],
  providers: [
    SearchService,
    {
      provide: 'QUERY_PARSER',
      useFactory: () => {
        // Factory logic to initialize the dictionary parser
        return new QueryParser();
      },
    },
  ],
  exports: [SearchService],
})
export class SearchModule {}
```

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| System Architecture | `docs/02_Architecture/System_Architecture.md` |
| Component Design | `docs/02_Architecture/Component_Design.md` |
| Interface Specifications | `docs/02_Architecture/Interface_Specifications.md` |
| Directory Structure | `docs/05_Modules/Directory_Structure.md` |

---

# Next Document

```
docs/05_Modules/Dependency_Isolation.md
```

The Dependency Isolation document defines the boundary guidelines, import constraints, and encapsulation rules to prevent architectural erosion in the monorepo.
