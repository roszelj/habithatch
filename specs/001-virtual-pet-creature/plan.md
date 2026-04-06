# Implementation Plan: Virtual Pet Creature

**Branch**: `001-virtual-pet-creature` | **Date**: 2026-04-02 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-virtual-pet-creature/spec.md`

## Summary

Build the core Terragucci virtual pet: a React web app where a
creature has three stats (hunger, happiness, energy) displayed as
playful visual indicators. Players interact via feed/play/sleep
actions that restore stats with immediate visual feedback. Stats
decay over time via requestAnimationFrame, creating the core
Tamagotchi-style care loop. The creature's mood (happy → neutral →
sad → distressed) is derived from stat levels and always recoverable.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: React 19, Vite 6
**Storage**: N/A (no persistence in this feature)
**Testing**: Vitest
**Target Platform**: Web browser (modern evergreen browsers)
**Project Type**: Web application (single-page, client-only)
**Performance Goals**: 60fps animations, <200ms interaction feedback
**Constraints**: No network requests, no PII collection, kid-safe
**Scale/Scope**: Single creature, single screen, 3 interactions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. Fun-First Design | Interactions feel responsive (<200ms feedback) | ✅ PASS — requestAnimationFrame + React state updates are sub-frame |
| I. Fun-First Design | Stats shown as playful visuals, not raw numbers | ✅ PASS — spec requires visual indicators, plan uses styled bars + mood sprites |
| I. Fun-First Design | Feature is playtestable in isolation | ✅ PASS — single-page app, `npm run dev` and play |
| II. Ship & Iterate | Scoped to single deliverable increment | ✅ PASS — US1+US2 = playable MVP, US3 adds the loop |
| II. Ship & Iterate | No speculative abstractions | ✅ PASS — useReducer for state, no external state lib |
| III. Kid-Safe Always | No PII collection or storage | ✅ PASS — no forms, no network, no localStorage |
| III. Kid-Safe Always | Age-appropriate content | ✅ PASS — cartoon creature, no text input from children |
| III. Kid-Safe Always | Dependencies audited | ✅ PASS — React and Vite only, widely trusted |

**Gate result**: ALL PASS — no violations, no complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-virtual-pet-creature/
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
│   ├── Creature.tsx          # Creature visual display + mood sprites
│   ├── Creature.module.css
│   ├── StatBar.tsx           # Reusable stat bar component
│   ├── StatBar.module.css
│   ├── ActionButton.tsx      # Feed/Play/Sleep button
│   ├── ActionButton.module.css
│   └── Game.tsx              # Main game container, state + loop
├── hooks/
│   ├── useCreature.ts        # useReducer for creature state machine
│   └── useGameLoop.ts        # requestAnimationFrame decay hook
├── models/
│   └── types.ts              # Creature, Action, Mood types
├── App.tsx                   # Root component
├── App.module.css
├── main.tsx                  # Vite entry point
└── index.css                 # Global styles / reset

tests/
├── useCreature.test.ts       # State machine logic tests
└── useGameLoop.test.ts       # Decay timing tests

index.html                    # Vite HTML entry
package.json
tsconfig.json
vite.config.ts
```

**Structure Decision**: Single project layout. The game is a
client-only SPA with no backend. All source lives under `src/`
with components, hooks, and models as the three organizational
concerns. Tests live in a top-level `tests/` directory focused
on game logic (not UI snapshots).

## Complexity Tracking

> No violations — this section is intentionally empty.
