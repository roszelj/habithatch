# Data Model: Food Feeding Menu

**Feature**: 034-food-feeding-menu
**Date**: 2026-04-11

## New Entities

### FoodItem

A static food option displayed in the feeding menu.

| Field     | Type       | Description                                      |
|-----------|------------|--------------------------------------------------|
| id        | string     | Unique identifier (e.g., "eggs", "pizza")        |
| name      | string     | Display name (e.g., "Eggs", "Pizza")             |
| emoji     | string     | Emoji visual (e.g., "\u{1F373}", "\u{1F355}")            |
| messages  | string[]   | 2-3 speech bubble messages when this food is fed |

**Storage**: Static array in `src/models/foods.ts`. Not persisted — no database or localStorage changes needed.

## Modified Entities

### CreatureAction (union type)

**Added variant**:

| Variant             | Fields        | Description                        |
|---------------------|---------------|------------------------------------|
| `{ type: 'feed' }`  | (none extra)  | Restores fixed HP, triggered by food selection |

Existing variants (`morning`, `afternoon`, `evening`, `decay`, `earn`, `load`) are unchanged.

### CreatureState (no structural change)

Health is modified by the `'feed'` action using the same `clamp(health + FEED_HEALTH_RESTORE, 0, 100)` pattern as existing time actions.

## New Constants

| Constant            | Value | Description                             |
|---------------------|-------|-----------------------------------------|
| FEED_COIN_COST      | 2     | Coins deducted per feeding              |
| FEED_HEALTH_RESTORE | 10    | HP restored per feeding                 |

## Data Flow

1. Child taps "Feed" button → FoodMenu popup opens (no state change)
2. Child selects a food item → popup closes
3. Game.tsx: deducts `FEED_COIN_COST` from coins via `setCoins`
4. Game.tsx: dispatches `{ type: 'feed' }` to creature reducer → health increases by `FEED_HEALTH_RESTORE`
5. Game.tsx: shows food-specific speech bubble message
6. Auto-save effect triggers (coins changed) → profile persisted

## No Changes Required

- **ChildProfile**: No new fields. Coins and health are already persisted.
- **CategoryPoints**: Unchanged. Points still earned via chores, just no longer spent on feeding.
- **Firestore schema**: No changes. All modifications are to ephemeral UI state and existing persisted fields.
