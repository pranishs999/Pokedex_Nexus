# Component Design

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-CD-001 |
| Document Name | Component Design |
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
2. Frontend Client Component Tree
3. Backend NestJS Module Component Maps
4. Shared Data Contracts (DTOs)
5. References

---

# 1. Purpose and Scope

This Component Design document specifies the frontend React component hierarchy, client-side routing structures, backend NestJS controller-service layouts, and shared DTO parameters of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. These design configurations serve as the basis for code implementation.

---

# 2. Frontend Client Component Tree

The React 19 application uses TanStack Router's file-based routing and a component layout design.

```
/apps/web/src/
├── main.tsx
├── routes/
│   ├── __root.tsx            (Main App shell, layout header & footer)
│   ├── index.tsx             (Home Landing search route)
│   ├── pokemon/
│   │   ├── index.tsx         (Pokedex Grid list route)
│   │   ├── $id.tsx           (Pokemon detailed specifications route)
│   ├── teams/
│   │   ├── index.tsx         (Team Builder layout workspace)
│   ├── collections/
│   │   ├── index.tsx         (Living Dex grid matrix dashboard)
│   ├── admin/
│       ├── index.tsx         (Admin health dashboard log console)
```

## 2.1 Core UI Component Modules

- **Navigation (Header):** Responsive navbar, search bar with debounce autocomplete dropdown (SF-200), theme toggler, and authenticated profile options.
- **Model3D Canvas:** React Three Fiber canvas utilizing GLTFLoader to render 3D models with fallback loaders.
- **TypeWeaknessChart:** SVG matrix calculating type matchups dynamically based on active team stats or comparator selections.
- **FormControls:** Unified inputs wrapping react-hook-form + Zod validation triggers.

---

# 3. Backend NestJS Module Component Maps

The backend API is divided into domain modules. Each module isolates endpoints, business logic, and database operations.

```
/apps/api/src/
├── app.module.ts             (Bootstrap module linking dependencies)
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts    (Auth API endpoint handler)
│   ├── auth.service.ts       (JWT generation, password verify)
│   ├── jwt.strategy.ts       (Access token verification handler)
├── pokemon/
│   ├── pokemon.module.ts
│   ├── pokemon.controller.ts (Pokedex, variant details endpoint)
│   ├── pokemon.service.ts    (DB queries via Prisma client)
├── search/
│   ├── search.module.ts
│   ├── search.controller.ts  (NLP search endpoints)
│   ├── search.service.ts     (FTS GIN SQL triggers)
```

- **Controller to Service Boundary:** Controllers handle HTTP validation and parameter extraction, then call Services to execute business logic. Services use Prisma Client providers to read/write records.

---

# 4. Shared Data Contracts (DTOs)

Endpoints exchange data using strict DTO schemas shared between client and server.

## 4.1 Save Team DTO Example (`SaveTeamDto`)
Used to validate payload arrays when saving teams (`POST /api/v1/teams`).

```typescript
import { z } from 'zod';

export const SaveTeamSchema = z.object({
  name: z.string().min(1).max(100),
  slots: z.array(
    z.object({
      pokemonId: z.string().uuid(),
      abilityId: z.string().uuid(),
      heldItemId: z.string().uuid().nullable(),
      natureId: z.string().uuid(),
      moves: z.array(z.string().uuid()).max(4),
      evs: z.object({
        hp: z.number().min(0).max(252),
        atk: z.number().min(0).max(252),
        def: z.number().min(0).max(252),
        spa: z.number().min(0).max(252),
        spd: z.number().min(0).max(252),
        spe: z.number().min(0).max(252),
      }).refine((ev) => Object.values(ev).reduce((a, b) => a + b, 0) <= 510, {
        message: "Total EVs must not exceed 510",
      }),
      ivs: z.object({
        hp: z.number().min(0).max(31),
        atk: z.number().min(0).max(31),
        def: z.number().min(0).max(31),
        spa: z.number().min(0).max(31),
        spd: z.number().min(0).max(31),
        spe: z.number().min(0).max(31),
      }),
    })
  ).max(6),
});

export type SaveTeamDto = z.infer<typeof SaveTeamSchema>;
```

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Decision Log | `docs/00_Project_Management/10_Decision_Log.md` |
| Data Requirements | `docs/01_Requirements/09_Data_Requirements.md` |
| API Requirements | `docs/01_Requirements/14_API_Requirements.md` |
| UI/UX Requirements | `docs/01_Requirements/15_UI_UX_Requirements.md` |
| System Architecture | `docs/02_Architecture/System_Architecture.md` |

---

# Next Document

```
docs/02_Architecture/Interface_Specifications.md
```

The Interface Specifications document defines the code signatures, module boundaries, database repository interfaces, and shared utility definitions.
