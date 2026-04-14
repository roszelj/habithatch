# Tasks: Tic-Tac-Toe Mini Game

**Input**: Design documents from `/specs/033-tictactoe-minigame/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not requested — manual playtesting per constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the game selection logic and tic-tac-toe AI module shared by all user stories.

- [X] T001 Create mini game selection and tic-tac-toe AI logic in src/models/miniGames.ts — define `MiniGameType` as `'spin-wheel' | 'tictactoe'`. Export `pickMiniGame(): MiniGameType` that returns a random 50/50 selection. Define `TicTacToeCell` as `null | 'X' | 'O'`. Export `createEmptyBoard(): TicTacToeCell[]` returning 9 nulls. Export `checkWinner(board): 'X' | 'O' | 'draw' | null` that checks all 8 win lines ([0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]) and returns winner, 'draw' if board full, or null if game continues. Export `getPetMove(board): number` that picks the pet's next move — 60% chance of using minimax optimal play, 40% chance of picking a random empty cell. Include a private `minimax(board, isMaximizing): number` helper for optimal move calculation (O is maximizing).

**Checkpoint**: Game logic module ready. AI can select moves, win detection works.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend PetFullscreen's game phase to support random game selection.

- [X] T002 Extend GamePhase type in src/components/PetFullscreen.tsx — add `'tictactoe'` and `'ttt-result'` to the `GamePhase` union type. Change the "Yes!" button onClick from directly setting `'wheel'` to calling a new `handlePlayGame()` function that uses `pickMiniGame()` from src/models/miniGames.ts to randomly set gamePhase to either `'wheel'` or `'tictactoe'`. Import `pickMiniGame` from miniGames.ts. Update `showCreature` to also hide creature during tictactoe phase: `gamePhase !== 'wheel' && gamePhase !== 'tictactoe'`.

**Checkpoint**: "Yes!" button now randomly picks between spin wheel and tic-tac-toe. Spin wheel still works as before.

---

## Phase 3: User Story 1 — Random Game Selection (Priority: P1) MVP

**Goal**: When child taps "Yes!", system randomly selects spin wheel or tic-tac-toe with equal probability.

**Independent Test**: Tap "Yes!" multiple times across sessions. Verify both `'wheel'` and `'tictactoe'` phases are reachable. Spin wheel path still works fully.

### Implementation for User Story 1

- [X] T003 [US1] Add placeholder tic-tac-toe view in src/components/PetFullscreen.tsx — when gamePhase is `'tictactoe'`, render a temporary placeholder div (e.g., "Tic-Tac-Toe coming soon!") in the same container pattern as the wheel. This verifies the random selection and phase routing work end-to-end before the real TicTacToe component is built.

**Checkpoint**: Random selection works. "Yes!" sometimes shows wheel, sometimes shows placeholder. Wheel path is unbroken.

---

## Phase 4: User Story 2 — Play Tic-Tac-Toe Against the Pet (Priority: P2)

**Goal**: Colorful 3x3 grid where child plays X against pet O. Pet "thinks" for 800ms before each move. Win/loss/draw detection works correctly.

**Independent Test**: Get tic-tac-toe selected. Place X marks. Verify pet responds with O after a brief delay. Win by getting 3 in a row — verify game ends. Fill all cells for a draw — verify draw detection.

### Implementation for User Story 2

- [X] T004 [US2] Create TicTacToe component in src/components/TicTacToe.tsx — accept props: `onResult: (result: 'child-won' | 'pet-won' | 'draw') => void`. Internal state: `board` (TicTacToeCell[9]), `currentTurn` ('X' | 'O'), `gameOver` (boolean), `petThinking` (boolean). On mount: empty board, X's turn. When child taps an empty cell: place X, check for win/draw, if game continues set `petThinking=true`, after 800ms timeout call `getPetMove(board)` to place O, check for win/draw, set `petThinking=false`. Disable cell taps while `petThinking` is true or `gameOver` is true. When win/draw detected, call `onResult` with the outcome. Render 3x3 grid of buttons, each showing X, O, or empty. Show turn indicator text ("Your turn!" or pet name + "is thinking...").
- [X] T005 [P] [US2] Create TicTacToe styles in src/components/TicTacToe.module.css — game container (centered, fits within fullscreen overlay). Grid: 3x3 layout with visible grid lines, cells minimum 70x70px for kid-friendly taps. Cell styling: empty cells have subtle hover/active state, X marks in blue, O marks in red/pink. Turn indicator: text above grid showing whose turn it is. Thinking state: subtle pulsing animation on indicator when pet is thinking. Winning cells: highlight the 3 winning cells with a glow or background color change. Overall: playful, colorful, matches the existing PetFullscreen visual style.
- [X] T006 [US2] Integrate TicTacToe into PetFullscreen in src/components/PetFullscreen.tsx — replace the placeholder from T003 with the real TicTacToe component. When gamePhase is `'tictactoe'`, render `<TicTacToe onResult={handleTttResult} />` in a container similar to wheelContainer. Add `handleTttResult(result)` function that stores the result in state (new `tttResult` state variable of type `'child-won' | 'pet-won' | 'draw' | null`) and transitions gamePhase to `'ttt-result'`.

**Checkpoint**: Full tic-tac-toe gameplay works. Child can play X, pet responds with O, win/loss/draw correctly detected.

---

## Phase 5: User Story 3 — Coin Rewards for Winning (Priority: P3)

**Goal**: After game ends, show result with pet message. Award 30-75 coins on win. Encouraging messages on loss/draw. "Collect!" or "OK" button returns to fullscreen view.

**Independent Test**: Win tic-tac-toe — verify coin reward 30-75 added. Lose — verify no coin change, encouraging message. Draw — verify no coin change, draw message.

### Implementation for User Story 3

- [X] T007 [US3] Add tic-tac-toe result display to PetFullscreen in src/components/PetFullscreen.tsx — when gamePhase is `'ttt-result'` and tttResult is set, show the creature with a speech bubble containing result-specific content. For `'child-won'`: trophy emoji, "You won! Here's {N} coins!" where N is `Math.floor(Math.random() * 46) + 30`, and a "Collect!" button that calls `onAwardCoins(N)` then transitions to 'done'. For `'pet-won'`: encouraging emoji, "Good try! Let's play again next time!", and an "OK" button that transitions to 'done' (no coin change). For `'draw'`: handshake emoji, "A tie! You're getting good!", and an "OK" button that transitions to 'done' (no coin change). Store the random coin amount in state when entering ttt-result so it doesn't change on re-render.
- [X] T008 [P] [US3] Style tic-tac-toe result display in src/components/PetFullscreen.module.css — add `.resultWin` style (gold/green tint, celebratory feel, matches `.resultPrize` pattern). Add `.resultLoss` style (warm blue/purple tint, gentle/encouraging feel). Add `.resultDraw` style (neutral warm tint). These supplement the existing `.resultBubble` base class. Ensure "Collect!" and "OK" buttons match existing `.collectBtn` sizing (48px+ height, kid-friendly).

**Checkpoint**: All three outcomes work. Coins awarded on win, capped at MAX_COINS. Loss and draw show appropriate messages.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and edge case handling.

- [X] T009 Verify coin cap logic in src/components/Game.tsx — confirm that a 75-coin win near MAX_COINS caps correctly (same `Math.max(0, Math.min(prev + amount, MAX_COINS))` logic already in place from feature 032)
- [X] T010 Run all quickstart.md scenarios end-to-end (random selection, child wins, pet wins, draw, occupied cell tap, close during game, coin cap, pet thinking delay, decline game)
- [X] T011 Verify TicTacToe grid renders correctly on small viewports (320px wide) — cells should fit with margins, grid lines visible, X/O marks readable, no horizontal overflow

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (needs `pickMiniGame` from miniGames.ts)
- **User Story 1 (Phase 3)**: Depends on Phase 2 (needs game selection wired in PetFullscreen)
- **User Story 2 (Phase 4)**: Depends on Phase 1 (needs game logic from miniGames.ts) and US1 (needs tictactoe phase in PetFullscreen)
- **User Story 3 (Phase 5)**: Depends on US2 (needs TicTacToe component and game result)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2 — random game selection routing
- **US2 (P2)**: Depends on Phase 1 + US1 — TicTacToe component uses AI from miniGames.ts, integrates into PetFullscreen's tictactoe phase
- **US3 (P3)**: Depends on US2 — result display requires game outcome

### Within Each User Story

- US1: Single task (placeholder integration)
- US2: TicTacToe component (T004) and styles (T005) can be parallel, then integration (T006)
- US3: Result logic (T007) and result styles (T008) can be parallel

### Parallel Opportunities

- T004 and T005 can run in parallel (TSX vs CSS)
- T007 and T008 can run in parallel (TSX vs CSS)

---

## Parallel Example: User Story 2

```bash
# T004 and T005 can run in parallel:
Task T004: "Create TicTacToe component in src/components/TicTacToe.tsx"
Task T005: "Create TicTacToe styles in src/components/TicTacToe.module.css"
# Then T006 (integration) after both complete
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Game logic module (T001)
2. Complete Phase 2: Game selection in PetFullscreen (T002)
3. Complete Phase 3: Placeholder tic-tac-toe view (T003)
4. **STOP and VALIDATE**: "Yes!" randomly routes to wheel or placeholder

### Incremental Delivery

1. Phase 1 + 2 → Game logic + selection wired
2. User Story 1 → Random selection works (MVP!)
3. User Story 2 → Playable tic-tac-toe game
4. User Story 3 → Coin rewards on win
5. Polish → Full validation across scenarios and viewports

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Pet AI: 60% minimax optimal, 40% random — targets ~45% child win rate
- Pet thinking delay: 800ms before placing O
- Coin reward on win: random 30-75, capped at MAX_COINS
- No coins on loss or draw — encouraging messages only
- Game state is ephemeral — closing overlay discards everything
- Commit after each task or logical group
