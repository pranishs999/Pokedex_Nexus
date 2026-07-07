# Pokémon Knowledge Management Platform (PKMP)

A premium, full-stack fan-made Pokémon encyclopedia with comprehensive Gen I data, dark Pokédex UI, and rich interactive features.

## Architecture

### Monorepo packages
- `artifacts/api-server` — Express + Drizzle ORM REST API (port 8080)
- `artifacts/pkmp` — React + Vite frontend (port 25137)
- `lib/db` — Drizzle schema + migrations (PostgreSQL)
- `lib/api-spec` — OpenAPI spec (`openapi.yaml`)
- `lib/api-client-react` — Orval-generated TanStack Query hooks
- `lib/api-zod` — Orval-generated Zod schemas

### Key tech choices
- **Auth**: SHA-256 hash + in-memory session store (cookie-based, fan-app grade)
- **Images**: PokeAPI CDN sprite/artwork URLs as static references
- **UI**: Dark navy-black theme, electric gold accent, Framer Motion animations, glassmorphism panels
- **Type system**: Full 18-type Gen I-IX chart with effectiveness pre-computed in routes

## Running locally
```
pnpm install
pnpm --filter @workspace/db run push   # apply schema
pnpm run dev                           # starts all workflows
```

## API endpoints
- `GET /api/pokemon` — paginated list with type/generation filters
- `GET /api/pokemon/:id` — full detail with types, abilities, moves
- `GET /api/pokemon/:id/evolution-chain` — evolution tree
- `GET /api/pokemon/:id/forms` — alternate/mega forms
- `GET /api/pokemon/featured` — homepage featured grid
- `GET /api/pokemon/random` — random Pokémon
- `POST /api/pokemon/compare` — side-by-side stat comparison
- `GET /api/types` — all 18 types with effectiveness
- `GET /api/abilities` — paginated abilities
- `GET /api/moves` — paginated moves with filters
- `GET /api/search` — global search across Pokémon/moves/abilities
- `GET/POST/DELETE /api/favorites` — user favorites (auth required)
- `POST /api/auth/register|login|logout` — authentication
- `GET/PATCH /api/auth/me` — profile management
- `GET /api/stats/overview|by-generation|by-type` — dashboard aggregates

## Database
PostgreSQL via Replit's managed database. Tables: `pokemon`, `types`, `abilities`, `moves`, `pokemon_types`, `pokemon_abilities`, `pokemon_moves`, `evolutions`, `forms`, `trading_cards`, `favorites`, `users`.

Seeded with: 151 Gen I Pokémon, 18 types, 49 abilities, 62 moves, full evolution chains (72 edges), 6 Mega forms.

## User preferences
- Dark mode only — no light mode toggle
- No emojis in UI
- Tailwind v4 (native, no config file)
- All API calls through generated hooks (`@workspace/api-client-react`), no raw fetch
