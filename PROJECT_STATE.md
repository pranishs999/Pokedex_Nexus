# PKMP Project State

_Last updated: 2026-07-07_

## Status: ✅ MVP Complete

All core features are built and seeded. The app runs end-to-end.

---

## What's Built

### Backend (Express + Drizzle + PostgreSQL)
| Feature | Status | Notes |
|---|---|---|
| Pokémon CRUD (list, detail) | ✅ | Paginated, filterable by gen/type/search |
| Featured & Random endpoints | ✅ | Randomized every request |
| Evolution chain endpoint | ✅ | Recursive tree structure |
| Alternate / Mega forms | ✅ | 6 Mega forms seeded |
| Type effectiveness chart | ✅ | Full 18×18 matrix inline in route |
| Abilities list + detail | ✅ | |
| Moves list + detail | ✅ | Filter by type/category |
| Global search | ✅ | Across Pokémon, moves, abilities |
| Compare endpoint | ✅ | Up to 4 Pokémon |
| Favorites (auth-gated) | ✅ | Add/remove/list per user |
| Auth (register/login/logout) | ✅ | SHA-256 + in-memory session |
| Profile management | ✅ | PATCH /auth/me |
| Stats/Dashboard aggregates | ✅ | Overview, by-generation, by-type |
| Trading cards endpoint | ✅ | Returns empty until cards are seeded |

### Frontend (React + Vite + Framer Motion)
| Page | Status | Notes |
|---|---|---|
| Home (`/`) | ✅ | Hero, stats overview, featured grid |
| Pokédex (`/pokedex`) | ✅ | Grid with gen/type filters, sorting, pagination |
| Pokémon Detail (`/pokemon/:id`) | ✅ | Hero glow, tabbed stats/moves/forms/cards |
| Evolution Chain | ✅ | Interactive chain renderer |
| Search (`/search`) | ✅ | Live debounce, category filter |
| Compare (`/compare`) | ✅ | Side-by-side stat bars for ≤4 Pokémon |
| Favorites (`/favorites`) | ✅ | Auth-guarded, optimistic updates |
| Login / Register | ✅ | Glassmorphism auth pages |
| Profile (`/profile`) | ✅ | Edit username/avatar |
| Admin (`/admin`) | ✅ | Placeholder admin panel |
| Not Found | ✅ | 404 page |

### Database Seed Data
| Table | Count |
|---|---|
| Pokémon | 151 (Gen I complete) |
| Types | 18 |
| Abilities | 49 |
| Moves | 62 |
| Pokémon↔Types | 220 |
| Pokémon↔Abilities | 79 |
| Pokémon↔Moves | 66 |
| Evolutions | 72 edges |
| Alternate Forms | 6 (Mega Charizard X/Y, Mega Blastoise, Mega Venusaur, Mega Mewtwo X/Y) |
| Trading Cards | 0 (endpoint ready) |

---

## Known Gaps / Future Work

1. **More seed data**: Gen II–IX Pokémon, more moves, more TCG cards
2. **Trading cards**: Seed real card data (or integrate a TCG API at seed time)
3. **Admin panel**: Implement CRUD operations for admin role users
4. **Session persistence**: Replace in-memory Map with Redis or DB sessions for production
5. **Password hashing**: Upgrade from SHA-256 to bcrypt/argon2 for production use
6. **Favorites realtime**: Add WebSocket or SSE for live favorite updates across tabs
7. **Search fuzzy**: Add trigram/full-text search (PostgreSQL `pg_trgm`) for typo tolerance
8. **Image upload**: Allow users to upload custom avatars (S3/Object Storage)
9. **Sprites**: Add animated sprites (PokeAPI has `.gif` animated sprites)
10. **Gen filters**: Expand filter dropdowns as more generations are seeded

---

## Running the Project

```bash
# Install deps
pnpm install

# Apply DB schema (first time only)
pnpm --filter @workspace/db run push

# Start all services
# Workflows are auto-managed by Replit:
# - artifacts/api-server: API Server  →  port 8080
# - artifacts/pkmp: web               →  port 25137
```

---

## File Structure
```
artifacts/
  api-server/src/
    routes/       # pokemon, types, abilities, moves, search, favorites, auth, stats
    app.ts        # Express app with session middleware
    index.ts      # Server entrypoint
  pkmp/src/
    pages/        # home, pokedex, pokemon-detail, search, compare, favorites, auth, admin
    components/   # shared UI + layout
    contexts/     # AuthContext
lib/
  db/src/schema/  # Drizzle schema tables
  api-spec/       # openapi.yaml
  api-client-react/  # Generated TanStack Query hooks
  api-zod/           # Generated Zod schemas
```
