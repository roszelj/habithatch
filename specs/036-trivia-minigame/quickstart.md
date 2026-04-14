# Quickstart: Trivia Time Mini Game

**Feature**: 036-trivia-minigame | **Date**: 2026-04-11

## What This Feature Does

Adds a "Trivia Time" mini game to the pet fullscreen experience. When a kid taps their pet, one of three mini games is randomly selected (SpinWheel, TicTacToe, or Trivia Time). Trivia Time presents 3 random multiple-choice questions from a pool of 30. Kids earn 1 coin per correct answer.

## Files to Create

1. **`src/models/triviaQuestions.ts`** — Static array of 30 `TriviaQuestion` objects and the `TriviaQuestion`/`TriviaResult` type definitions. Also export a `pickTriviaQuestions(count: number)` helper that returns `count` random questions with shuffled answer options.

2. **`src/components/TriviaGame.tsx`** — React component that manages the trivia game flow: displays questions one at a time, highlights correct/incorrect answers, shows "Next" button, and calls `onResult(TriviaResult)` when done.

3. **`src/components/TriviaGame.module.css`** — Styles matching the existing mini game visual language (dark overlay, centered content, consistent button styling from SpinWheel/TicTacToe).

## Files to Modify

1. **`src/models/miniGames.ts`** — Add `'trivia'` to `MiniGameType`. Update `pickMiniGame()` from 50/50 to equal thirds (spin-wheel, tictactoe, trivia).

2. **`src/components/PetFullscreen.tsx`** — Import `TriviaGame`. Add `'trivia'` and `'trivia-result'` to `GamePhase`. Add handler functions for trivia result/collect. Render `<TriviaGame>` when `gamePhase === 'trivia'`. Hide creature during trivia (same as other games). Show result bubble for `'trivia-result'` phase.

## Implementation Order

1. Create `triviaQuestions.ts` (data + types + helper)
2. Create `TriviaGame.tsx` + `TriviaGame.module.css` (standalone component)
3. Modify `miniGames.ts` (add type + update selection)
4. Modify `PetFullscreen.tsx` (integrate trivia into game flow)
5. Manual playtest

## Key Patterns to Follow

- **Props**: `interface TriviaGameProps { onResult: (result: TriviaResult) => void; }` — matches TicTacToe pattern
- **Coin award**: PetFullscreen handles coin award on collect, not the game component
- **Creature visibility**: `showCreature` must be false during `'trivia'` phase
- **Result screen**: Follow same bubble pattern as ttt-result (emoji + message + collect button)
