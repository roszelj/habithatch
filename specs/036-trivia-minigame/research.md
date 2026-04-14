# Research: Trivia Time Mini Game

**Feature**: 036-trivia-minigame | **Date**: 2026-04-11

## Research Tasks

### 1. Integration Pattern for New Mini Games

**Decision**: Follow the exact pattern established by TicTacToe (feature 033).

**Rationale**: TicTacToe was the most recent mini game addition and established a clear pattern:
- Add new type to `MiniGameType` union in `miniGames.ts`
- Update `pickMiniGame()` for equal probability
- Create standalone component with `onResult` callback
- Add game phase to `PetFullscreen` state machine
- Handle result display and coin collection in PetFullscreen

**Alternatives considered**:
- Generic mini game framework: Rejected — over-engineering for 3 games (Constitution Principle II: Ship & Iterate)
- External trivia API: Rejected — adds latency, complexity, and kid-safety risk (Constitution Principle III)

### 2. Question Pool Design

**Decision**: Static TypeScript array of 30 `TriviaQuestion` objects in `src/models/triviaQuestions.ts`.

**Rationale**:
- Static data is fastest (no network), most reliable (no API failures), and easiest to audit for kid-safety
- 30 questions with 3 per session = 4,060 possible combinations (C(30,3)), providing good variety
- TypeScript ensures type safety and compile-time validation of question structure

**Alternatives considered**:
- JSON file loaded at runtime: Rejected — no benefit over TypeScript const, loses type checking
- External API (OpenTDB, etc.): Rejected — network dependency, kid-safety can't be guaranteed, offline breakage

### 3. Randomization Strategy

**Decision**: Fisher-Yates shuffle on question indices, take first 3. Separately shuffle answer options for each displayed question.

**Rationale**:
- `Math.random()` is sufficient for game randomization (not security-critical)
- Shuffling answer options prevents kids from memorizing positions (FR-011)
- No need for weighted selection — all questions equally valid

### 4. Scoring and Rewards

**Decision**: 1 coin per correct answer (0-3 coins per game).

**Rationale**:
- Spec is explicit: FR-008 mandates 1 coin per correct answer
- Lower reward than TicTacToe (30-75 coins for a win) balances the fact that trivia is easier/faster
- Even 0 correct gets an encouraging message (FR-009)

### 5. Game Phase Integration

**Decision**: Add two new game phases to PetFullscreen: `'trivia'` and `'trivia-result'`.

**Rationale**:
- Follows the same pattern as TicTacToe (`'tictactoe'` + `'ttt-result'`)
- Trivia component handles its own internal state (current question, answers, score)
- On completion, trivia calls `onResult` with score, PetFullscreen shows result screen

## Open Questions

None — all unknowns resolved.
