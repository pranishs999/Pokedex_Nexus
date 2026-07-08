# Data Requirements

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-DR-002 |
| Document Name | Data Requirements |
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
2. Core Entity Data Structures
3. Media Entity Data Structures
4. User Entity Data Structures
5. Localization and Text Formats
6. References

---

# 1. Purpose and Scope

This Data Requirements document defines the schemas, properties, data types, database relationships, and validation constraints for the database layers of the Pokémon Knowledge Management Platform (PKMP) v1.0.0. These requirements serve as the direct specification for the Prisma schema file (`schema.prisma`) and Zod validation layers.

---

# 2. Core Entity Data Structures

## 2.1 Pokémon Table (`pokemon`)

Stores the core data for each Pokémon species and its variants.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | UUID | Primary Key, Default: gen_random_uuid() | Unique identifier. |
| `national_num` | Integer | Unique, Not Null | The National Pokédex number. |
| `slug` | String | Unique, Not Null | URL-safe identifier. |
| `name` | String | Not Null, Limit: 100 | The official name. |
| `base_hp` | Integer | Not Null, Range: 1–255 | Base HP stat. |
| `base_attack` | Integer | Not Null, Range: 1–255 | Base Attack stat. |
| `base_defense` | Integer | Not Null, Range: 1–255 | Base Defense stat. |
| `base_sp_attack`| Integer | Not Null, Range: 1–255 | Base Special Attack stat. |
| `base_sp_defense`| Integer | Not Null, Range: 1–255 | Base Special Defense stat. |
| `base_speed` | Integer | Not Null, Range: 1–255 | Base Speed stat. |
| `height` | Float | Not Null | Height in meters. |
| `weight` | Float | Not Null | Weight in kilograms. |
| `gender_ratio` | Float | Not Null, Range: -1 to 1 | Ratio of male/female (-1 for genderless). |
| `catch_rate` | Integer | Not Null, Range: 1–255 | Base capture rate. |
| `base_exp` | Integer | Not Null, Range: 0–1000 | Experience awarded upon defeat. |
| `source_type` | Enum | Not Null, Default: OFFICIAL | Source origin (`OFFICIAL`, `COMMUNITY`). |
| `created_at` | Timestamp | Default: now() | Record creation timestamp. |
| `updated_at` | Timestamp | Default: now(), On Update | Record modification timestamp. |

### Relationships
- **Types:** Many-to-Many relation with `types` (mapped via intermediate join table `pokemon_types` containing `slot` identifier: 1 or 2).
- **Abilities:** Many-to-Many relation with `abilities` (mapped via join table `pokemon_abilities` with `is_hidden` boolean).
- **Evolution Chain:** Self-referencing relationship with foreign key `evolves_from_id` pointing to `pokemon.id`, along with evolution triggers (level, item, condition).

---

## 2.2 Moves Table (`moves`)

Stores the attributes of moves learnable by Pokémon.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier. |
| `name` | String | Not Null, Limit: 100 | The official name. |
| `type_id` | UUID | Foreign Key -> `types.id` | Elemental type of the move. |
| `category` | Enum | Not Null | Category (`PHYSICAL`, `SPECIAL`, `STATUS`). |
| `power` | Integer | Nullable, Range: 0–250 | Base attack power. |
| `accuracy` | Integer | Nullable, Range: 0–100 | Base accuracy percentage (Null for sure-hit). |
| `pp` | Integer | Not Null, Range: 1–40 | Power Points. |
| `priority` | Integer | Not Null, Default: 0 | Execution order priority (-7 to +5). |

### Relationships
- **Learned By:** Many-to-Many relationship with `pokemon` via join table `pokemon_moves` with fields `learn_method` (Level Up, TM, HM, Egg, Tutor) and `level_learned` (optional).

---

# 3. Media Entity Data Structures

## 3.1 TCG Cards Table (`tcg_cards`)

Stores collectible cards data.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier. |
| `card_id` | String | Unique, Not Null | External unique set identifier. |
| `name` | String | Not Null | Card name. |
| `set_name` | String | Not Null | Name of the set. |
| `rarity` | String | Not Null | Rarity tier. |
| `pokemon_id` | UUID | Foreign Key -> `pokemon.id` | Target Pokémon referenced on the card. |
| `image_url` | String | Not Null | High-definition card art URL. |

---

# 4. User Entity Data Structures

## 4.1 User Account Table (`users`)

Stores user credentials and profile details.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier. |
| `username` | String | Unique, Not Null, Limit: 30 | Unique login username. |
| `email` | String | Unique, Not Null | Registration email. |
| `password_hash`| String | Not Null | Salted and hashed password. |
| `role` | Enum | Not Null, Default: USER | Permissions role. |
| `created_at` | Timestamp | Default: now() | Profile creation timestamp. |

---

## 4.2 User Teams Table (`user_teams`)

Stores custom teams built by users.

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier. |
| `user_id` | UUID | Foreign Key -> `users.id` | Team owner reference. |
| `name` | String | Not Null, Limit: 100 | Custom team name. |
| `pokemon_slots`| JSONB | Not Null | Serialized array of up to 6 Pokémon configurations. |

### Serialized JSONB Schema
Each slot object contains:
- `pokemon_id`: UUID
- `ability_id`: UUID
- `held_item_id`: UUID
- `nature_id`: UUID
- `moves`: Array of UUIDs (max 4)
- `evs`: Object containing HP, Atk, Def, SpA, SpD, Spe (total ≤ 510, max 252 per stat)
- `ivs`: Object containing HP, Atk, Def, SpA, SpD, Spe (range 0–31)

---

# 5. Localization and Text Formats

- **Multilingual Support:** Pokédex flavor text entries must support multiple languages. This is handled using a translation join table `pokemon_flavor_text` containing:
  - `pokemon_id`: UUID
  - `language`: Enum (`EN`, `JA`, `FR`, `DE`, `ES`, `IT`, `KO`, `ZH`)
  - `flavor_text`: Text
  - `game_id`: UUID (reference to version game)
- **Text Sanitization:** All text entries must be sanitized to strip control characters (e.g., carriage returns, page breaks) introduced in retro game data dumps.

---

# 6. References

## Internal Documents

| Document | Path |
|----------|------|
| Project Scope | `docs/00_Project_Management/03_Project_Scope.md` |
| Glossary | `docs/00_Project_Management/04_Glossary.md` |
| Functional Requirements | `docs/01_Requirements/02_Functional_Requirements.md` |
| Business Rules | `docs/01_Requirements/08_Business_Rules.md` |

---

# Next Document

```
docs/01_Requirements/10_Search_Requirements.md
```

The Search Requirements document outlines the system performance, indexing criteria, synonym schemas, and query logic for the search modules.
