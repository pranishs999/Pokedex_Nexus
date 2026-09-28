---
name: PKMP project setup
description: How the PKMP (Pokémon Knowledge Management Platform) monorepo is wired up and running on Replit
---

## Runtime setup

Artifacts exist in `.replit-artifact/artifact.toml` but are NOT registered via `createArtifact` (dirs already existed on import — that call fails). Replit's proxy reads the toml files directly, so routing works without registration.

**Ports (from artifact.toml — must match workflow commands)**
- API server: `localPort = 8080`, paths = `["/api"]`
- Frontend: `localPort = 25137`, paths = `["/"]`

**Workflow commands**
- `API Server`: `PORT=8080 pnpm --filter @workspace/api-server run dev`
- `PKMP Frontend`: `PORT=25137 BASE_PATH=/ pnpm --filter @workspace/pkmp run dev`

**Why port 25137 matters**: The pkmp artifact.toml hardcodes PORT=25137. If the workflow runs on any other port (e.g. 3000), the proxy routes to 25137 and the page appears blank. Always match the artifact.toml localPort.

## Data architecture

Pokémon data comes from PokéAPI at runtime — no seed script needed for pokemon data.
The `PokeAPIService` (artifacts/api-server/src/pokeapi/service.ts) loads all 1025 Pokémon
into memory on server startup (batches of 30, takes ~60s). Routes query the in-memory cache.

Local DB (PostgreSQL) stores only: users, favorites.
Favorites schema uses `dex_number` (integer, no FK) — NOT `pokemon_id`.

## Auth

Password hashing: bcrypt (12 rounds).

**Why:** SHA-256 with static salt has no work factor — vulnerable to offline cracking.
