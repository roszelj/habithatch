# Data Model: Update Habitat Images

**Feature**: 021-habitat-images | **Date**: 2026-04-07

## Entities

### Habitat

| Field  | Type      | Description                                           | Constraints              |
|--------|-----------|-------------------------------------------------------|--------------------------|
| id     | HabitatId | Unique identifier (slug, e.g. `water-park`)           | Required, unique         |
| name   | string    | Display name shown in store (e.g. `Water Park`)       | Required, non-empty      |
| image  | string    | Absolute path to PNG (e.g. `/creature-habitats/01_water_park.png`) | Required, non-empty |
| price  | number    | Cost in coins                                         | Required, 20–35          |

**Changed field**: `emoji: string` → `image: string`

### ChildProfile (affected fields only)

| Field          | Type           | Description                                      |
|----------------|----------------|--------------------------------------------------|
| habitatId      | HabitatId \| null | ID of currently equipped habitat              |
| ownedHabitats  | HabitatId[]    | IDs of purchased habitats                        |

Both fields must be filtered on load to contain only valid new habitat IDs.

## Catalog: 9 Habitats

| ID                  | Name              | Image Path                                          | Price |
|---------------------|-------------------|-----------------------------------------------------|-------|
| `water-park`        | Water Park        | `/creature-habitats/01_water_park.png`              | 20    |
| `beach`             | Beach             | `/creature-habitats/02_beach.png`                   | 20    |
| `cosy-bedroom`      | Cosy Bedroom      | `/creature-habitats/03_cosy_bedroom.png`            | 20    |
| `waterfall-forest`  | Waterfall Forest  | `/creature-habitats/04_waterfall_forest.png`        | 25    |
| `candy-village`     | Candy Village     | `/creature-habitats/05_candy_village.png`           | 25    |
| `magic-forest-pond` | Magic Forest      | `/creature-habitats/06_magic_forest_pond.png`       | 25    |
| `sunny-farm`        | Sunny Farm        | `/creature-habitats/07_sunny_farm.png`              | 30    |
| `snowy-cabin`       | Snowy Cabin       | `/creature-habitats/08_snowy_cabin.png`             | 30    |
| `fairytale-castle`  | Fairytale Castle  | `/creature-habitats/09_fairytale_castle.png`        | 35    |

## Migration Map

| Old ID       | Action           |
|--------------|------------------|
| `beach`      | Keep (id unchanged) |
| `bedroom`    | Clear → null     |
| `forest`     | Clear → null     |
| `desert`     | Clear → null     |
| `rainforest` | Clear → null     |
| `space`      | Clear → null     |
| `amusement`  | Clear → null     |

## State Transitions

```
Profile load
  → for habitatId: if not in VALID_HABITAT_IDS → null
  → for ownedHabitats: filter to only VALID_HABITAT_IDS members
```

No new state transitions. Purchase and equip flows are unchanged.
