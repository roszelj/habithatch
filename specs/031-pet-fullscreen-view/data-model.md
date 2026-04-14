# Data Model: Pet Fullscreen Interactive View

## Overview

This feature introduces **no new data entities or persistence**. It is a purely presentational feature that reads existing data from the `ChildProfile` model.

## Existing Entities Used

### ChildProfile (read-only)

| Field | Type | Usage in Fullscreen View |
|-------|------|--------------------------|
| `creatureType` | `CreatureType` | Determines which creature sprite to render |
| `creatureName` | `string` | Fallback name for greeting when childName is null |
| `childName` | `string \| null` | Primary name for greeting (if set) |
| `habitatId` | `HabitatId \| null` | Determines background image; null = default background |

### Habitat (read-only, from habitats.ts)

| Field | Type | Usage |
|-------|------|-------|
| `id` | `HabitatId` | Matches profile's `habitatId` |
| `image` | `string` | Path to background image (e.g., `/creature-habitats/01_water_park.png`) |

## Derived Data (computed at render time)

### Time-of-Day Greeting

| Condition | Greeting |
|-----------|----------|
| Hour 5–11 | "Good Morning, [name]!" |
| Hour 12–16 | "Good Afternoon, [name]!" |
| Hour 17–23 or 0–4 | "Good Evening, [name]!" |

Where `[name]` = `childName ?? creatureName`

## State (ephemeral, component-local)

| State | Type | Purpose |
|-------|------|---------|
| `showFullscreen` | `boolean` | Controls whether the fullscreen overlay is visible (in Game.tsx) |

No database changes. No migration needed. No new Firestore documents.
