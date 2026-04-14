# Research: New Creature Roster

**Feature**: 020-new-creature-roster
**Date**: 2026-04-07

## Impacted Code Locations

`CREATURE_SPRITES[type].happy` is used as emoji text in 4 components:

| Component | Usage |
|-----------|-------|
| `src/components/Creature.tsx` | Main game creature display (line 20) |
| `src/components/SelectionScreen.tsx` | Creature picker card image (line 26) |
| `src/components/NamingStep.tsx` | Creature preview during naming (line 34) |
| `src/components/ProfilePicker.tsx` | Profile card creature image (line 23) |

All 4 must switch from emoji-text rendering to image-based sprite rendering.

---

## Decision 1: How to render individual creatures from the sprite sheets

**Decision**: CSS background-image sprite technique. Each creature is displayed in a fixed-size `<div>` with:
- `background-image` pointing to the pack PNG
- `background-size: 300% 300%` (3×3 grid means 3× scale to fill the display div)
- `background-position: [col * 50%] [row * 50%]` (for a 3-column, 3-row grid: 0%/50%/100% per axis)

**Rationale**: No additional image processing needed. The two PNG files are the only assets required. The math is clean for a 3×3 grid. Works with existing CSS module approach.

**Alternatives considered**:
- Pre-slice the PNG into 18 individual files — rejected; requires external tooling and bloats the asset tree. The sprite sheet approach achieves the same result purely in CSS.
- `<img>` with `object-fit: none` and `object-position` — rejected; harder to control sizing and requires setting explicit image dimensions that may not match the natural image size.
- Import images as Vite assets — acceptable, but URL strings keep the model data simpler and don't require TypeScript asset imports.

---

## Decision 2: Sprite position data structure

**Decision**: Replace `Record<CreatureType, Record<Mood, string>>` with `Record<CreatureType, { pack: 1 | 2; col: 0 | 1 | 2; row: 0 | 1 | 2 }>`. Mood variants (happy/neutral/sad/distressed) are no longer separate images; the same illustration is used for all moods. Mood state is communicated via existing CSS animations (bounce = happy action, wobble = distressed) — this already matches the current `Creature.tsx` behavior which uses `.happy` exclusively.

**Rationale**: The new illustrations only have "happy" poses. The current code already only uses the happy sprite for the body (line 20 in Creature.tsx). Mood is entirely communicated through CSS effects, not image swaps. This change simplifies the data model.

**Alternatives considered**:
- Keep the `Record<Mood, string>` structure with the same position for all moods — rejected as misleading; mood keys have no meaning when pointing to the same image.

---

## Decision 3: Asset location for PNG files

**Decision**: Copy both PNG files from the repo root `/creature-charactors/` into `public/creature-charactors/`. Vite serves `public/` directly — files there are accessible at runtime as `/creature-charactors/creature-happy-pack1.png`.

**Rationale**: Vite's `public/` directory is designed for static assets that need predictable URLs. No import or bundling needed; just reference the URL string.

**Alternatives considered**:
- Leave files in repo root and import via Vite's asset system — rejected; importing images from outside `src/` or `public/` is not standard Vite practice and causes resolution issues.

---

## Decision 4: Shared sprite rendering component

**Decision**: Create a shared `CreatureSprite` React component in `src/components/CreatureSprite.tsx` that accepts `creatureType` and `size` props and handles the CSS background sprite rendering. All 4 existing components replace their emoji `<span>` with `<CreatureSprite>`.

**Rationale**: The sprite CSS logic (background-image URL, background-size, background-position calculation) would be duplicated across 4 components without a shared component. One place to update if the asset paths or sizing change.

---

## Decision 5: Migration of old creature types

**Decision**: Add a `migrateCreatureType` function that maps old types to the closest new equivalent:

| Old | New | Rationale |
|-----|-----|-----------|
| `bird` | `chick` | Small yellow bird — closest visual match |
| `turtle` | `gecko` | Small reptile — closest thematic match |
| `cat` | `calico` | Same species, new art |
| `dog` | `corgi` | Same species, new art |

Apply this migration in `src/firebase/migration.ts` and in the local save data loader so both cloud and local profiles are handled.

---

## Creature Roster (18 total)

Based on visual analysis of the provided PNG files:

### Pack 1 — `creature-happy-pack1.png`

| Type Key | Col | Row | Name | Description |
|----------|-----|-----|------|-------------|
| `corgi` | 0 | 0 | Corgi | Orange/brown corgi, pink bow |
| `samoyed` | 1 | 0 | Samoyed | Cream fluffy dog, teal flower bow |
| `husky` | 2 | 0 | Husky | Black/white husky, blue bow |
| `panda` | 0 | 1 | Panda | Black/white panda, donut, pink bow |
| `chick` | 1 | 1 | Chick | Yellow fluffy chick, yellow bow |
| `bunny` | 2 | 1 | Bunny | Fluffy bunny/rabbit |
| `calico` | 0 | 2 | Calico | Orange/white cat, strawberry |
| `tiger` | 1 | 2 | Tiger | Orange striped tiger, teal bow |
| `monkey` | 2 | 2 | Monkey | Brown monkey, banana |

> **Note**: Grid positions are approximate based on visual analysis. Exact col/row positions MUST be verified during implementation by visually checking each sprite position renders correctly.

### Pack 2 — `creature-happy-pack2.png`

| Type Key | Col | Row | Name | Description |
|----------|-----|-----|------|-------------|
| `sloth` | 0 | 0 | Sloth | Brown sloth, holding heart |
| `dragon` | 1 | 0 | Dragon | Green dragon, wings |
| `snake` | 2 | 0 | Snake | Green snake, pink bow |
| `gecko` | 0 | 1 | Gecko | Yellow gecko/lizard, flower |
| `cockatoo` | 1 | 1 | Cockatoo | Pink cockatoo/bird, bow |
| `fish` | 2 | 1 | Goldfish | Orange/pink goldfish |
| `giraffe` | 0 | 2 | Giraffe | Spotted giraffe, crown |
| `elephant` | 1 | 2 | Elephant | Light blue elephant, bells |
| `leopard` | 2 | 2 | Leopard | Snow leopard, bow |
