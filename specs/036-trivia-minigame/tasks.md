# Tasks: Trivia Time Mini Game

**Input**: Design documents from `/specs/036-trivia-minigame/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not requested — no test tasks generated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the trivia question data and types that all stories depend on

- [x] T001 [P] Define `TriviaQuestion` and `TriviaResult` types and create pool of 30 kid-friendly trivia questions with `pickTriviaQuestions(count)` helper in `src/models/triviaQuestions.ts`
- [x] T002 [P] Add `'trivia'` to `MiniGameType` union type in `src/models/miniGames.ts`

**Checkpoint**: Data layer ready — trivia questions importable, types available

---

## Phase 2: User Story 1 — Kid Plays Trivia Time (Priority: P1) 🎯 MVP

**Goal**: A kid can play a full 3-question trivia game: see questions one at a time, select answers with visual feedback (green/red), advance with "Next" button, see score and coin reward on results screen.

**Independent Test**: Temporarily hardcode `pickMiniGame()` to return `'trivia'`, open pet fullscreen, play through 3 questions, verify correct/incorrect highlighting, score display, and coin award.

### Implementation for User Story 1

- [x] T003 [P] [US1] Create `TriviaGame` component in `src/components/TriviaGame.tsx` — manages game flow: picks 3 random questions via `pickTriviaQuestions(3)`, displays one question at a time with 4 shuffled answer buttons, highlights correct (green) and incorrect (red) on selection, shows "Next" button after answer reveal, calls `onResult(TriviaResult)` after all 3 questions
- [x] T004 [P] [US1] Create styles for TriviaGame in `src/components/TriviaGame.module.css` — question card layout, answer buttons (default/correct/incorrect states), "Next" button, category label, progress indicator (1/3, 2/3, 3/3), matching existing mini game visual style (dark overlay, centered content)
- [x] T005 [US1] Integrate TriviaGame into PetFullscreen in `src/components/PetFullscreen.tsx` — add `'trivia'` and `'trivia-result'` to `GamePhase` type, import `TriviaGame` and `TriviaResult`, add `handleTriviaResult` and `handleTriviaCollect` functions, render `<TriviaGame>` when `gamePhase === 'trivia'`, render trivia result bubble (emoji + score message + collect button) when `gamePhase === 'trivia-result'`, hide creature during trivia phase, award `result.score` coins via `onAwardCoins`, show encouraging messages per FR-009 ("Great try!" for 0, "Nice job!" for 1-2, "Perfect score!" for 3)

**Checkpoint**: Trivia Time is fully playable when directly invoked. Kid can complete 3 questions, see feedback, and earn coins.

---

## Phase 3: User Story 2 — Trivia Integrated into Mini Game Rotation (Priority: P2)

**Goal**: Trivia Time appears as one of the randomly-selected mini games alongside SpinWheel and TicTacToe with equal probability.

**Independent Test**: Open pet fullscreen multiple times (~15+), verify Trivia Time appears roughly 1/3 of the time alongside SpinWheel and TicTacToe.

### Implementation for User Story 2

- [x] T006 [US2] Update `pickMiniGame()` in `src/models/miniGames.ts` to select equally among `'spin-wheel'`, `'tictactoe'`, and `'trivia'` (replace 50/50 with equal thirds)
- [x] T007 [US2] Update `handlePlayGame` in `src/components/PetFullscreen.tsx` to handle `'trivia'` result from `pickMiniGame()` — set `gamePhase` to `'trivia'` when trivia is selected

**Checkpoint**: Trivia Time is fully integrated into the game rotation. All three mini games appear with equal probability.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and edge case handling

- [x] T008 Verify all 30 trivia questions are kid-safe (ages 5-12), have exactly 4 options each, and cover a variety of topics per FR-001 and SC-004 in `src/models/triviaQuestions.ts`
- [x] T009 Manual playtest: complete full flow — open pet fullscreen, get Trivia Time, answer all 3 questions, verify no duplicate questions within session, verify answer shuffling (FR-011), verify score and coin award, verify encouraging messages for 0/1-2/3 correct

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup (T001, T002)
- **User Story 2 (Phase 3)**: Depends on User Story 1 (T005 — PetFullscreen must have trivia phases)
- **Polish (Phase 4)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on T001 (question data) and T002 (type definition)
- **User Story 2 (P2)**: Depends on T005 (PetFullscreen trivia integration) — needs trivia game phases to exist before routing to them

### Within Each User Story

- T003 and T004 can run in parallel (component + styles are separate files)
- T005 depends on T003 (needs TriviaGame component to import)
- T006 and T007 are sequential (T007 needs the updated pickMiniGame from T006)

### Parallel Opportunities

- T001 and T002 can run in parallel (different files)
- T003 and T004 can run in parallel (component + CSS module)

---

## Parallel Example: User Story 1

```bash
# Launch data and type tasks together (Phase 1):
Task: "Define TriviaQuestion types and 30 questions in src/models/triviaQuestions.ts"
Task: "Add 'trivia' to MiniGameType in src/models/miniGames.ts"

# Launch component and styles together (Phase 2):
Task: "Create TriviaGame component in src/components/TriviaGame.tsx"
Task: "Create TriviaGame styles in src/components/TriviaGame.module.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001, T002)
2. Complete Phase 2: User Story 1 (T003, T004, T005)
3. **STOP and VALIDATE**: Temporarily hardcode `pickMiniGame()` to return `'trivia'` and playtest
4. Revert hardcode and proceed to Phase 3

### Incremental Delivery

1. Setup → Data and types ready
2. User Story 1 → Trivia game playable end-to-end (MVP!)
3. User Story 2 → Integrated into game rotation → Full feature complete
4. Polish → Verify kid-safety and edge cases

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
