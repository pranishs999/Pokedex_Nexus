# Pokédex Nexus (PKMP)

A full-stack Pokémon Knowledge Management Platform — Pokédex, search, compare, favorites, and auth.

## Stack

- **Frontend**: React 19 + Vite + Tailwind CSS v4 + TanStack Query + Framer Motion (`artifacts/pkmp`)
- **Backend**: Express + TypeScript + Pino (`artifacts/api-server`)
- **Database**: PostgreSQL via Drizzle ORM (`lib/db`)
- **Shared libs**: `lib/api-spec` (OpenAPI), `lib/api-zod` (Zod schemas), `lib/api-client-react` (TanStack Query hooks)
- **Monorepo**: pnpm workspaces

## Running on Replit

Two workflows run automatically:

| Workflow | Command | Port |
|---|---|---|
| API Server | `PORT=8080 pnpm --filter @workspace/api-server run dev` | 8080 |
| PKMP Frontend | `PORT=25137 BASE_PATH=/ pnpm --filter @workspace/pkmp run dev` | 25137 |

The API server loads all 1025 Pokémon from PokéAPI into memory on startup (~60s). The database stores only users and favorites.

## First-time setup

```bash
pnpm install
pnpm --filter @workspace/db run push   # apply schema to DB
```

## Key facts

- Pokémon data: fetched from PokéAPI at startup, cached in memory — no seed script needed
- DB tables: `users`, `favorites` (favorites use `dex_number` integer, not a FK)
- Auth: bcrypt (12 rounds) password hashing, cookie-based sessions
- Port 25137 is hardcoded in `artifacts/pkmp/.replit-artifact/artifact.toml` — don't change it

## User preferences

_None recorded yet._
