# Pokédex Nexus — Documentation

> **Version:** 2.0.0
> **Platform:** Android (APK)
> **Stack:** Flutter + Dart
> **Status:** In Development

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Flutter (latest stable) |
| Language | Dart |
| State Management | Riverpod / Provider |
| Networking | Dio + Retrofit |
| Local Storage | Hive / Isar |
| Navigation | GoRouter |
| UI | Material 3 + Custom Widgets |
| Build Target | Android APK |

---

## Docs Index

| File | Description |
|------|-------------|
| [README.md](./README.md) | This file — project overview & stack |
| [Architecture.md](./Architecture.md) | App architecture & folder structure |
| [Database.md](./Database.md) | Local data storage & caching strategy |
| [API.md](./API.md) | PokéAPI integration & endpoints |
| [Build_and_Release.md](./Build_and_Release.md) | APK build, signing & release steps |

---

## Features (Planned)

- Full Pokédex browser (Gen I–IX)
- Pokémon detail view (stats, types, evolutions, moves)
- Offline-first with local caching
- Search with filters (type, generation, name)
- Team builder
- Favorites
- Compare Pokémon side-by-side
- Dark / Light theme

---

## Quick Start

```bash
# Clone
git clone https://github.com/pranishs999/Pokedex_Nexus.git
cd Pokedex_Nexus

# Get dependencies
flutter pub get

# Run on connected device / emulator
flutter run

# Build release APK
flutter build apk --release
```

---

## License

Non-commercial fan project. Pokémon IP belongs to Nintendo / The Pokémon Company / Game Freak.