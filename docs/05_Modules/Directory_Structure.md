# Directory Structure

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-DS-001 |
| Document Name | Directory Structure |
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
2. Monorepo Root Directory Structure
3. Backend NestJS App Directory Structure
4. Frontend React App Directory Structure
5. Shared Packages Directory Structure
6. References

---

# 1. Purpose and Scope

This Directory Structure document specifies the workspace organization, module directories, app layouts, package structures, and file locations for the Pokémon Knowledge Management Platform (PKMP) v1.0.0. The repository uses a monorepo structure.

---

# 2. Monorepo Root Directory Structure

The repository uses pnpm workspaces to manage applications and shared packages.

```
/PKMP/
├── apps/                     (Application folders)
│   ├── api/                  (NestJS backend API service)
│   └── web/                  (React 19 / Vite frontend client)
├── packages/                 (Shared package workspaces)
│   ├── config/               (ESLint, Prettier configurations)
│   ├── styles/               (Tailwind CSS v4 variables)
│   └── types/                (Shared Prisma/Zod types)
├── datasets/                 (Raw JSON seeding files)
├── scripts/                  (Operational CLI tool scripts)
├── infrastructure/           (Docker, Nginx configuration files)
├── tests/                    (Global integration and performance tests)
├── package.json              (Monorepo workspace package config)
├── pnpm-workspace.yaml       (Workspace directory mapping configuration)
└── README.md
```

---

# 3. Backend NestJS App Directory Structure

The backend application `/apps/api` groups business logic by module.

```
/apps/api/src/
├── main.ts                   (Bootstrap server entry)
├── app.module.ts             (Core module linking app imports)
├── auth/                     (Authentication & session module)
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/                  (Data transfer validation files)
│   └── tests/                (Unit/Integration specs)
├── pokemon/                  (Pokemon encyclopedia core module)
│   ├── pokemon.module.ts
│   ├── pokemon.controller.ts
│   ├── pokemon.service.ts
│   ├── entities/             (Domain data classes)
│   └── tests/
```

---

# 4. Frontend React App Directory Structure

The frontend application `/apps/web` uses a file-based routing structure.

```
/apps/web/src/
├── main.tsx                  (Bootstrap React entry)
├── index.css                 (Tailwind style sheet injection)
├── routes/                   (TanStack Router routes tree)
│   ├── __root.tsx            (Main layout framework)
│   ├── index.tsx
│   └── pokemon/
├── components/               (Reusable UI components widgets)
│   ├── PokemonCard.tsx
│   ├── Model3D.tsx
│   └── StatBar.tsx
├── hooks/                    (Custom state/fetching hooks)
└── services/                 (Typed API client adapters)
```

---

# 5. Shared Packages Directory Structure

Shared workspace libraries reside within `/packages`.

- **`/packages/types`:** Auto-generated Prisma Client files, Zod schema specifications, and type helpers.
- **`/packages/styles`:** Central style files containing Tailwind CSS v4 variables, HSL color tokens, and design layouts.
- **`/packages/config`:** Configurations for ESLint, TypeScript (`tsconfig.json`), and Prettier.

---

# 6. References

## Internal Documents

| Document | Path |
|----------|------|
| System Architecture | `docs/02_Architecture/System_Architecture.md` |
| Component Design | `docs/02_Architecture/Component_Design.md` |
| Navigation Structure | `docs/04_UI_UX/Navigation_Structure.md` |

---

# Next Document

```
docs/05_Modules/Service_Registry.md
```

The Service Registry document defines the NestJS dependency injection registry configurations, module exports, and service bindings.
