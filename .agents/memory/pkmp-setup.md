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

## Database

Schema: push with `pnpm --filter @workspace/db run push`
Seed: `pnpm --filter @workspace/db run seed` (runs `lib/db/src/seed.ts`)
Seed is idempotent — it deletes and re-inserts all data.
Currently seeded: 1025 Pokémon (Gen I–IX), 18 types, 284 abilities, 484 evolutions, 326 alternate forms (Mega, Gmax, Regional). Seed fetches live from PokéAPI — takes ~2–4 min to run.

## Auth

Password hashing upgraded from SHA-256 (static salt) to bcrypt (12 rounds).
Existing users with SHA-256 hashes cannot log in until rehash migration is done (Task #2).

**Why:** SHA-256 with static salt has no work factor — vulnerable to offline cracking.
