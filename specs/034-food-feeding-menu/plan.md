# Implementation Plan: Food Feeding Menu

**Branch**: `034-food-feeding-menu` | **Date**: 2026-04-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/034-food-feeding-menu/spec.md`

## Summary

Replace the three time-of-day feeding buttons (Morning/Afternoon/Evening) on the main pet screen with a single "Feed" button that costs 2 coins and opens a food selection popup. The popup displays 8 food items (Eggs, Pancakes, Donuts, Sandwich, Pizza, Tacos, Salad, Ice Cream Sundae) with emojis. Selecting a food triggers the pet's feeding reaction with a food-specific speech bubble and restores health.

## Technical Context

**Language/Version**: TypeScript 5.6 + React 19
**Primary Dependencies**: Vite 5, CSS Modules
**Storage**: N/A for food config (static). Coin balance changes go through existing profile save mechanism (onSaveProfile)
**Testing**: Manual playtesting (existing project pattern)
**Target Platform**: Web (mobile-responsive)
**Project Type**: Web application (kids virtual pet game)
**Performance Goals**: Feeding interaction completes in under 200ms (constitution: visual feedback within 200ms)
**Constraints**: Kid-safe content only; no new external dependencies
**Scale/Scope**: Single new component (FoodMenu popup) + modifications to Game.tsx and types.ts

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Fun-First Design | PASS | Food selection adds delight through visual emojis and food-specific speech bubbles. Feeding reaction provides immediate visual feedback. |
| II. Ship & Iterate | PASS | Small, self-contained feature scoped to one development cycle. Replaces existing buttons with a single new component. |
| III. Kid-Safe Always | PASS | All food items are age-appropriate. No PII collected. No new network features or third-party dependencies. |

**Gate result: PASS** — No violations.

## Project Structure

### Documentation (this feature)

```text
specs/034-food-feeding-menu/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── FoodMenu.tsx           # NEW - food selection popup component
│   ├── FoodMenu.module.css    # NEW - food menu styles
│   ├── Game.tsx               # MODIFY - replace 3 action buttons with Feed button + FoodMenu
│   └── Game.module.css        # MODIFY - add feed button styles if needed
├── models/
│   ├── types.ts               # MODIFY - add FoodItem type, new CreatureAction 'feed', update FEED_COST constant
│   └── foods.ts               # NEW - static food items data (name, emoji, speech messages)
└── hooks/
    └── useCreature.ts         # MODIFY - add 'feed' action handler to reducer
```

**Structure Decision**: Single project, frontend-only. New files follow existing patterns — component + CSS module pair, data model in models/.
