# Architecture

## Pattern

**Clean Architecture** with feature-first folder structure.

```
lib/
├── main.dart
├── app.dart                    # MaterialApp + GoRouter setup
├── core/
│   ├── constants/              # API URLs, app strings, colors
│   ├── theme/                  # Material 3 light/dark themes
│   ├── utils/                  # Helpers, extensions
│   └── network/                # Dio client, interceptors
├── features/
│   ├── pokedex/
│   │   ├── data/               # Models, repositories, data sources
│   │   ├── domain/             # Entities, use cases (optional)
│   │   └── presentation/       # Screens, widgets, providers
│   ├── pokemon_detail/
│   ├── search/
│   ├── favorites/
│   ├── compare/
│   └── team_builder/
└── shared/
    ├── widgets/                # Reusable UI components
    ├── models/                 # Shared data models
    └── providers/              # Global providers
```

## Data Flow

```
UI (Widget) → Provider/Riverpod → Repository → DataSource (API / Local DB)
```

- **Remote:** PokéAPI via Dio HTTP client
- **Local:** Hive/Isar for offline cache & favorites
- **State:** Riverpod for reactive state management

## Navigation

GoRouter with typed routes. Deep-linking supported for:
- `/pokedex` — main list
- `/pokemon/:id` — detail view
- `/search` — search page
- `/favorites` — saved Pokémon
- `/compare` — comparison view
