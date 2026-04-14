# Implementation Plan: Spin Wheel Mini Game

**Branch**: `032-spin-wheel-minigame` | **Date**: 2026-04-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/032-spin-wheel-minigame/spec.md`

## Summary

Add a spinning prize wheel mini game accessible from the fullscreen pet view. After the greeting speech bubble, the pet asks "Want to play a game?" with Yes/No buttons. If yes, a colorful wheel with 8 segments appears — coin prizes, kindness challenges, and coin penalties. The child taps "Spin!" to spin the wheel; it decelerates and lands on a random segment. Outcomes are applied immediately (coins added/deducted, or challenge message shown).

## Technical Context

**Language/Version**: TypeScript 5.6 + React 19, Vite 5, CSS Modules
**Primary Dependencies**: None new — builds on existing PetFullscreen component (feature 031)
**Storage**: N/A for wheel config (static). Coin balance changes go through existing profile save mechanism (onSaveProfile / onUpdateAppData)
**Testing**: Manual playtesting (per constitution)
**Target Platform**: Mobile web (PWA), 320px–430px viewport
**Project Type**: Web application (kid-facing game)
**Performance Goals**: Wheel spin animation smooth at 60fps on mobile
**Constraints**: Wheel must fit within fullscreen overlay on small screens. Coin penalties must never make balance negative.
**Scale/Scope**: 1 new component (SpinWheel) + modifications to PetFullscreen.tsx and Game.tsx

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Fun-First Design | PASS | Core feature is pure fun — spinning wheel with prizes, challenges, and playful penalties. Visual delight with animation. Kindness challenges encourage positive behavior. |
| II. Ship & Iterate | PASS | Self-contained feature layered onto existing fullscreen view. Small scope: 1 new component + 1 modified component. |
| III. Kid-Safe Always | PASS | No new data collection. Coin penalties are playful (not punitive). Kindness challenges are age-appropriate positive prompts. All content is pre-defined and safe. No network interaction. |

## Project Structure

### Documentation (this feature)

```text
specs/032-spin-wheel-minigame/
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
│   ├── SpinWheel.tsx              # NEW — spinning wheel component with segments, spin animation, result display
│   ├── SpinWheel.module.css       # NEW — wheel styles, spin animation, segment colors, result overlay
│   ├── PetFullscreen.tsx          # MODIFY — add game invitation flow, integrate SpinWheel
│   ├── PetFullscreen.module.css   # MODIFY — styles for game prompt buttons
│   └── Game.tsx                   # MODIFY — pass coin update callbacks to PetFullscreen
└── models/
    └── wheelSegments.ts           # NEW — static wheel segment configuration (labels, types, amounts, probabilities, colors)
```

**Structure Decision**: SpinWheel is its own component to keep PetFullscreen focused. Wheel segment data lives in a separate model file for clean separation. Game.tsx passes coin mutation callbacks through PetFullscreen to SpinWheel.

## Complexity Tracking

No violations. Feature is straightforward — one new visual component with static configuration.
