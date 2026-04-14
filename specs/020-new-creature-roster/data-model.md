# Data Model: New Creature Roster

**Feature**: 020-new-creature-roster
**Date**: 2026-04-07

## Modified Types

### `CreatureType` (src/models/types.ts)

**Before**: `'bird' | 'turtle' | 'cat' | 'dog'` (4 types)

**After**: 18 string literal union type:

```
'corgi' | 'samoyed' | 'husky' | 'panda' | 'chick' | 'bunny'
| 'calico' | 'tiger' | 'monkey'
| 'sloth' | 'dragon' | 'snake' | 'gecko' | 'cockatoo' | 'fish'
| 'giraffe' | 'elephant' | 'leopard'
```

### `CreatureSpritePosition` — New Interface (src/models/types.ts)

Replaces the old `Record<Mood, string>` emoji structure:

| Field | Type | Description |
|-------|------|-------------|
| `pack` | `1 \| 2` | Which PNG file (pack 1 or pack 2) |
| `col` | `0 \| 1 \| 2` | Column in the 3×3 sprite grid (0=left, 1=center, 2=right) |
| `row` | `0 \| 1 \| 2` | Row in the 3×3 sprite grid (0=top, 1=middle, 2=bottom) |

### `CREATURE_SPRITES` (src/models/types.ts)

**Before**: `Record<CreatureType, Record<Mood, string>>` — emoji strings per mood

**After**: `Record<CreatureType, CreatureSpritePosition>` — grid position for each of the 18 creatures

### `Mood` type — No change

Mood type (`'happy' | 'neutral' | 'sad' | 'distressed'`) and `getMood()` function are unchanged. Mood continues to drive CSS animation classes (bounce, wobble). No per-mood images are needed.

### `DEFAULT_NAMES`, `CREATURE_LABELS`, `ALL_CREATURE_TYPES`

All updated to include 18 entries (one per new creature type). `ALL_CREATURE_TYPES` grows from 4 to 18 items.

## Removed

- The `Record<Mood, string>` emoji structure for creature sprites is fully removed.
- The emoji strings for bird, turtle, cat, dog are deleted.

## Migration Mapping

Used in `src/firebase/migration.ts` and local save loader to update persisted `creatureType` values on existing profiles:

| Old `creatureType` | New `creatureType` |
|--------------------|-------------------|
| `'bird'` | `'chick'` |
| `'turtle'` | `'gecko'` |
| `'cat'` | `'calico'` |
| `'dog'` | `'corgi'` |

## New Static Asset

| File | Source | Destination |
|------|--------|-------------|
| `creature-happy-pack1.png` | `creature-charactors/` (repo root) | `public/creature-charactors/` |
| `creature-happy-pack2.png` | `creature-charactors/` (repo root) | `public/creature-charactors/` |

Accessible at runtime as `/creature-charactors/creature-happy-pack1.png`.
