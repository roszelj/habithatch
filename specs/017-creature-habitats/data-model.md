# Data Model: Creature Habitats

## New Type: `HabitatId`

```
HabitatId = string   (e.g. "bedroom", "space", "beach")
```

## New Type: `Habitat`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `HabitatId` | Unique string identifier |
| `name` | `string` | Display name (e.g. "Rain Forest") |
| `emoji` | `string` | Themed emoji(s) for visual representation |
| `price` | `number` | Coin cost to purchase |

## Habitat Catalog (static, in `src/models/habitats.ts`)

| id | name | emoji | price |
|----|------|-------|-------|
| `bedroom` | Bedroom | 🛏️🪟 | 20 |
| `beach` | Beach | 🏖️🌊 | 20 |
| `forest` | Forest | 🌲🌿 | 25 |
| `desert` | Desert | 🏜️🌵 | 25 |
| `rainforest` | Rain Forest | 🌴🦜 | 30 |
| `space` | Space | 🌌🚀 | 30 |
| `amusement` | Amusement Park | 🎡🎢 | 35 |

## `ChildProfile` Extensions

Two new fields added to the existing `ChildProfile` interface:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `habitatId` | `HabitatId \| null` | `null` | Currently equipped habitat (null = no habitat) |
| `ownedHabitats` | `HabitatId[]` | `[]` | All purchased habitat IDs for this profile |

## State Transitions

```
Not owned  ──[purchase]──▶  Owned + auto-equipped
Owned      ──[equip]──────▶  Active (habitatId set)
Active     ──[equip other]──▶  Previous deactivated, new one active
Active     ──[equip None]──▶  habitatId = null (default background)
```

## Validation Rules

- Purchase: `coins >= habitat.price` AND `habitatId not in ownedHabitats`
- Equip: `habitatId in ownedHabitats` OR `habitatId === null`
- `coins` must not go below 0 after purchase (enforced in `handleBuyItem`)

## Migration

Existing `ChildProfile` records missing these fields default to:
- `habitatId: null`
- `ownedHabitats: []`
