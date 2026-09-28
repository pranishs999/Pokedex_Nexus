# API Integration

## Data Source

**PokéAPI v2** — https://pokeapi.co/api/v2/

Free, open, no auth required.

## Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `GET /pokemon?limit=20&offset=0` | Paginated Pokémon list |
| `GET /pokemon/{id}` | Full Pokémon detail |
| `GET /pokemon-species/{id}` | Flavor text, evolution chain URL |
| `GET /evolution-chain/{id}` | Evolution tree |
| `GET /type/{id}` | Type effectiveness |
| `GET /ability/{id}` | Ability description |
| `GET /move/{id}` | Move details |
| `GET /generation/{id}` | Pokémon by generation |

## HTTP Client

- **Dio** with interceptors for logging, error handling, and retry
- Base URL: `https://pokeapi.co/api/v2/`
- Timeout: 15s connect, 30s receive

## Error Handling

| Code | Action |
|------|--------|
| 200 | Parse & cache |
| 404 | Show "not found" UI |
| 429 | Retry with backoff |
| 5xx | Fall back to local cache |
| No network | Serve cached data |
