# Implementation Plan: Creature View Redesign

**Branch**: `017-creature-habitats` | **Date**: 2026-04-07 | **Spec**: [spec.md](./spec.md)
**Input**: User request: "redesign the creature view so the enabled habitat background fills the main div the creature displays in. Reorganize how outfits and accessories are displayed in a new row under the creature in boxes labeled (Outfits, Accessories)"

## Summary

Scopes the habitat background from full-screen to a contained "creature stage" box, and adds a new equipment row below the stage showing the currently equipped outfit and accessory in labeled tappable boxes. Pure CSS/JSX layout change — 2 files, no data model changes.

## Technical Context

**Language/Version**: TypeScript 5.6 + React 19
**Primary Dependencies**: Vite 5, CSS Modules
**Storage**: N/A (layout only)
**Testing**: Manual only
**Target Platform**: Mobile web (iPhone 15 Pro, 393px)
**Project Type**: Mobile web app
**Performance Goals**: No measurable impact — CSS only
**Constraints**: Must not break creature overlays (outfit/accessory/mood); must not clip creature at any screen size; must fit within 360px max-width container
**Scale/Scope**: 2 files modified, ~40 lines changed

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Fun-First Design | ✅ Pass | Scoped habitat background and equipment row make the creature scene more immersive and rewards more visible |
| II. Ship & Iterate | ✅ Pass | 2-file CSS/JSX change, zero logic changes, shippable immediately |
| III. Kid-Safe Always | ✅ Pass | No data, no network, no content changes |

## Project Structure

### Documentation (this feature)

```text
specs/017-creature-habitats/
├── plan.md       # This file
├── research.md   # Layout analysis
├── quickstart.md # CSS details + test steps
└── tasks.md      # Task list
```

### Source Code (affected files)

```text
src/components/
├── Game.tsx           # Wrap creature in stage, add equipment row, move habitat bg
└── Game.module.css    # Add .creatureStage, .equipmentRow, .equipBox; update .habitatBackground
```

## Phase 0: Research

See [research.md](./research.md).

**Key decisions**:
- Habitat background scoped to `.creatureStage`, not `.game`
- Outfit/accessory overlays stay on creature sprite — equipment row adds separate indicator boxes below
- Equipment boxes tap to open store
- No changes to `Creature.tsx` or `Creature.module.css`

## Phase 1: Design

See [quickstart.md](./quickstart.md) for CSS details.

### `src/components/Game.module.css` changes

1. **Add `.creatureStage`**: `position: relative`, `overflow: hidden`, `border-radius: 20px`, subtle border and background — the habitat's visual container
2. **Update `.habitatBackground`**: No change to the rule itself — it already uses `position: absolute; inset: 0` which will now correctly fill the stage instead of the game container because it's moved inside `.creatureStage`
3. **Add `.equipmentRow`**: Horizontal flex, full width, 12px gap
4. **Add `.equipBox`**: Flex column, centered content, label + emoji, tappable — mirrors the card style used throughout the app

### `src/components/Game.tsx` changes (main pet view and store view)

**Main pet view**:
1. Remove the top-level `{activeHabitat && <div className={styles.habitatBackground}>...}` render
2. Wrap `<Creature>` in `<div className={styles.creatureStage}>`, with the habitat background div inside it
3. After the closing `</div>` of the stage, add the `.equipmentRow` with two `.equipBox` buttons

**Store view**:
1. Same restructuring — wrap the creature in the stage div with habitat background inside

**Equipment row structure**:
```jsx
<div className={styles.equipmentRow}>
  <button className={styles.equipBox} onClick={() => setView('store')}>
    <span>{outfit ? outfit.emoji : '👕'}</span>
    <span>Outfits</span>
  </button>
  <button className={styles.equipBox} onClick={() => setView('store')}>
    <span>{accessory ? accessory.emoji : '✨'}</span>
    <span>Accessories</span>
  </button>
</div>
```

The `outfit` and `accessory` objects come from `getOutfitById(outfitId)` and `getAccessoryById(accessoryId)` — both already imported in Game.tsx (from the existing store feature).

> **Note**: `getOutfitById` and `getAccessoryById` need to be imported in Game.tsx if not already present.
