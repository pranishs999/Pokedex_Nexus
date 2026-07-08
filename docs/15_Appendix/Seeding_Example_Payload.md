# Seeding Example Payload

| Document Information | |
|----------------------|------------------------------------------------|
| Document ID | PKMP-APP-SP-001 |
| Document Name | Seeding Example Payload |
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
2. Pokémon Seed Payload Example (`pokemon-seed.json`)
3. Move Seed Payload Example (`moves-seed.json`)
4. Ability Seed Payload Example (`abilities-seed.json`)
5. References

---

# 1. Purpose and Scope

This Seeding Example Payload document provides complete JSON mock data arrays for Pokémon species, moves, and abilities. These mock payloads match the Zod validation schemas and can be used to test the seeding and import pipelines during development.

---

# 2. Pokémon Seed Payload Example (`pokemon-seed.json`)

Save this file as `/datasets/pokemon-seed.json` for testing:

```json
[
  {
    "national_num": 1,
    "slug": "bulbasaur",
    "name": "Bulbasaur",
    "base_hp": 45,
    "base_attack": 49,
    "base_defense": 49,
    "base_sp_attack": 65,
    "base_sp_defense": 65,
    "base_speed": 45,
    "height": 0.7,
    "weight": 6.9,
    "gender_ratio": 0.125,
    "catch_rate": 45,
    "base_exp": 64,
    "types": ["Grass", "Poison"],
    "abilities": [
      { "name": "Overgrow", "is_hidden": false },
      { "name": "Chlorophyll", "is_hidden": true }
    ]
  }
]
```

---

# 3. Move Seed Payload Example (`moves-seed.json`)

Save this file as `/datasets/moves-seed.json` for testing:

```json
[
  {
    "name": "Tackle",
    "slug": "tackle",
    "type": "Normal",
    "category": "PHYSICAL",
    "power": 40,
    "accuracy": 100,
    "pp": 35,
    "description": "A physical charge attack."
  }
]
```

---

# 4. Ability Seed Payload Example (`abilities-seed.json`)

Save this file as `/datasets/abilities-seed.json` for testing:

```json
[
  {
    "name": "Overgrow",
    "slug": "overgrow",
    "description": "Boosts Grass-type moves when HP is low."
  }
]
```

---

# 5. References

## Internal Documents

| Document | Path |
|----------|------|
| Data Requirements | `docs/01_Requirements/09_Data_Requirements.md` |
| Database Requirements | `docs/01_Requirements/18_Database_Requirements.md` |
| Schema Design | `docs/03_Database/Schema_Design.md` |
| Editor Console | `docs/06_CMS/Editor_Console.md` |
| Import Validation | `docs/06_CMS/Import_Validation.md` |

---

# Next Document

*This completes the PKMP documentation suite.*
