# Implementation Plan: Tic-Tac-Toe Mini Game

**Branch**: `033-tictactoe-minigame` | **Date**: 2026-04-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/033-tictactoe-minigame/spec.md`

## Summary

Add a tic-tac-toe mini game as a second game option in the fullscreen pet overlay. When the child accepts the "Want to play a game?" invitation, the system randomly selects either the existing spin wheel or a new tic-tac-toe game. In tic-tac-toe, the child plays as X against the pet (O) with a moderate-difficulty AI. Winning awards 30-75 coins; losing or drawing awards nothing but shows encouraging feedback.

## Technical Context

**Language/Version**: TypeScript 5.6 + React 19, Vite 5, CSS Modules
**Primary Dependencies**: None new — builds on existing PetFullscreen component (features 031/032)
**Storage**: N/A for game state (ephemeral). Coin balance changes go through existing profile save mechanism (onAwardCoins callback)
**Testing**: Manual playtesting per constitution
**Target Platform**: Mobile-first web (PWA), minimum 320px viewport
**Project Type**: Web application (React SPA)
**Performance Goals**: Responsive interactions within 200ms per constitution; pet "thinking" delay is intentional UX (0.5-1s)
**Constraints**: Kid-friendly tap targets (minimum 60x60px cells), age-appropriate content, no PII collection
**Scale/Scope**: Single new component (TicTacToe) + modifications to PetFullscreen for game selection

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Fun-First Design | PASS | Tic-tac-toe is a universally fun game for kids. Visual feedback on moves within 200ms (tap → X appears). Pet "thinking" delay adds personality. Win/loss messages from pet add delight. |
| II. Ship & Iterate | PASS | Feature is a single-component addition to existing overlay. Can be tested in isolation. Minimal changes to existing code (only PetFullscreen game selection logic). |
| III. Kid-Safe Always | PASS | No PII collected. All content age-appropriate. No network features. No third-party dependencies. Encouraging messages on loss/draw — no negative/punishing language. |

No violations. All gates pass.

## Project Structure

### Documentation (this feature)

```text
specs/033-tictactoe-minigame/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── PetFullscreen.tsx          # MODIFY — add random game selection, tictactoe phase
│   ├── PetFullscreen.module.css   # MODIFY — add tictactoe result styles if needed
│   ├── TicTacToe.tsx              # NEW — tic-tac-toe game component
│   └── TicTacToe.module.css       # NEW — tic-tac-toe styles
└── models/
    └── miniGames.ts               # NEW — game selection logic, TicTacToe AI
```

**Structure Decision**: Follows existing pattern — new game component in `src/components/`, game logic/AI in `src/models/`. Matches how SpinWheel.tsx + wheelSegments.ts was organized in feature 032.
