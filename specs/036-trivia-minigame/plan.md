# Implementation Plan: Trivia Time Mini Game

**Branch**: `036-trivia-minigame` | **Date**: 2026-04-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/036-trivia-minigame/spec.md`

## Summary

Add a "Trivia Time" mini game to the existing mini game rotation. The game presents 3 randomly-selected multiple-choice questions from a pool of 30 kid-friendly trivia questions, awards 1 coin per correct answer (0-3 coins total), and integrates into the PetFullscreen flow alongside SpinWheel and TicTacToe.

## Technical Context

**Language/Version**: TypeScript 5.6 + React 19, Vite 5, CSS Modules
**Primary Dependencies**: None new — builds on existing PetFullscreen component (features 031/032/033)
**Storage**: N/A for trivia config (static). Coin balance changes go through existing profile save mechanism (onAwardCoins callback)
**Testing**: Manual playtest (consistent with project testing approach)
**Target Platform**: Mobile-first web (PWA)
**Project Type**: Web application (React SPA)
**Performance Goals**: Responsive interactions within 200ms per Constitution Principle I
**Constraints**: All content must be kid-safe (ages 5-12), no external API calls
**Scale/Scope**: 30 static questions, 1 new component, integration into existing game flow

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Fun-First Design ✅ PASS

- Trivia quiz is inherently engaging — kids love testing knowledge
- Visual feedback on answer selection (green/red) within 200ms ✅
- Encouraging messages for all score outcomes (0, 1-2, 3) ✅
- No timer pressure — kid-friendly pace ✅
- Variety of fun topics (animals, science, geography, etc.)

### Principle II: Ship & Iterate ✅ PASS

- Scoped to a single deliverable increment ✅
- Follows exact same integration pattern as TicTacToe (feature 033) ✅
- Static question pool — no external dependencies, no server changes needed ✅

### Principle III: Kid-Safe Always ✅ PASS

- All 30 questions must be age-appropriate for ages 5-12 ✅
- No PII collection ✅
- No external API calls ✅
- No new third-party dependencies ✅
- Content review: questions cover safe topics (animals, science, geography, history, food) ✅

**Gate result**: All three principles satisfied. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/036-trivia-minigame/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── TriviaGame.tsx            # New: Trivia Time game component
│   └── TriviaGame.module.css     # New: Trivia Time styles
├── models/
│   ├── miniGames.ts              # Modified: add 'trivia' to MiniGameType, update pickMiniGame()
│   └── triviaQuestions.ts         # New: 30 trivia questions data
└── components/
    └── PetFullscreen.tsx          # Modified: add trivia game phase and rendering
```

**Structure Decision**: Single project structure. Two new files (component + data), two modified files (miniGames model + PetFullscreen integration). Follows exact same pattern as TicTacToe addition.

## Complexity Tracking

No violations — feature follows established patterns exactly.
