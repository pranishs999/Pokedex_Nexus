# Database & Local Storage

## Strategy: Offline-First

All fetched Pokémon data is cached locally so the app works without internet after initial load.

## Storage

| Purpose | Technology | Details |
|---------|-----------|---------|
| Pokémon cache | Hive / Isar | Persisted boxes for list + detail data |
| Favorites | Hive / Isar | User's saved Pokémon IDs |
| Team data | Hive / Isar | Team compositions |
| Settings | SharedPreferences | Theme, language prefs |

## Cache Policy

1. On first launch → fetch from PokéAPI → store locally
2. On subsequent launches → load from cache → background refresh if online
3. Cache TTL: 7 days for Pokémon data (rarely changes)

## Models

Key data models stored locally:

- `PokemonSummary` — id, name, types, sprite URL
- `PokemonDetail` — full stats, abilities, moves, evolution chain
- `FavoriteEntry` — pokemon ID + timestamp
- `Team` — name + list of pokemon IDs
