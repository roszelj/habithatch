# Implementation Plan: Pet Fullscreen Interactive View

**Branch**: `031-pet-fullscreen-view` | **Date**: 2026-04-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/031-pet-fullscreen-view/spec.md`

## Summary

Add a fullscreen interactive pet view that opens when the child taps the creature on the main game screen. The view fills the viewport with the child's selected habitat as background, the creature wandering with idle animation, and a speech bubble greeting the child by name based on time of day ("Good Morning/Afternoon/Evening, [name]!").

## Technical Context

**Language/Version**: TypeScript 5.6 + React 19, Vite 5, CSS Modules
**Primary Dependencies**: None new — uses existing CreatureSprite, habitat data, speech bubble patterns
**Storage**: N/A — purely presentational, no persistence needed
**Testing**: Manual playtesting (per constitution — tests where they add confidence)
**Target Platform**: Mobile web (PWA), 320px–430px viewport width
**Project Type**: Web application (kid-facing game)
**Performance Goals**: View opens in under 1 second, animation starts within 3 seconds
**Constraints**: Must work on mobile viewports, no scrolling in fullscreen view
**Scale/Scope**: 1 new component + 1 new CSS module, minor changes to Game.tsx

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Fun-First Design | PASS | Core feature is pure delight — creature wandering and personalized greeting. No functional overhead. Creature interaction feels responsive (opens immediately on tap). |
| II. Ship & Iterate | PASS | Small, self-contained feature. New component + click handler. No architecture changes. Can be playtested in isolation. |
| III. Kid-Safe Always | PASS | No new data collection. Uses existing childName (parent-entered). Time-of-day is derived from device clock — no network call. All content is age-appropriate greetings. |

## Project Structure

### Documentation (this feature)

```text
specs/031-pet-fullscreen-view/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── PetFullscreen.tsx          # NEW — fullscreen pet view component
│   ├── PetFullscreen.module.css   # NEW — fullscreen styles + wandering animation
│   └── Game.tsx                   # MODIFY — add tap handler on creature to open fullscreen
└── models/
    └── habitats.ts                # READ ONLY — habitat image lookup
```

**Structure Decision**: Single new component with CSS module. The fullscreen view is a self-contained overlay triggered from Game.tsx. No new data models, services, or hooks needed. Reuses existing CreatureSprite component and habitat data.

## Complexity Tracking

No violations. Feature is straightforward — one new presentational component.
