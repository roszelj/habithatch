# Data Model: Trivia Time Mini Game

**Feature**: 036-trivia-minigame | **Date**: 2026-04-11

## Entities

### TriviaQuestion

A single trivia question with its answer options.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Unique identifier (1-30) |
| `question` | `string` | The question text displayed to the kid |
| `options` | `string[]` | Array of exactly 4 answer strings (canonical order) |
| `correctIndex` | `number` | Index (0-3) of the correct answer in the `options` array |
| `category` | `string` | Topic category for display (e.g., "Animals", "Science") |

**Validation rules**:
- `options` must have exactly 4 elements
- `correctIndex` must be 0, 1, 2, or 3
- All text must be kid-safe (ages 5-12)
- No duplicate question IDs

**Storage**: Static TypeScript constant — no persistence needed.

### TriviaResult

The outcome of a trivia game session, passed from TriviaGame to PetFullscreen.

| Field | Type | Description |
|-------|------|-------------|
| `score` | `number` | Number of correct answers (0-3) |
| `total` | `number` | Total questions asked (always 3) |

**State transitions**: N/A — result is computed once and immutable.

### MiniGameType (modified)

Extended union type in `miniGames.ts`.

| Before | After |
|--------|-------|
| `'spin-wheel' \| 'tictactoe'` | `'spin-wheel' \| 'tictactoe' \| 'trivia'` |

### GamePhase (modified)

Extended union type in `PetFullscreen.tsx`.

| Before | After |
|--------|-------|
| `'greeting' \| 'prompt' \| 'wheel' \| 'result' \| 'tictactoe' \| 'ttt-result' \| 'done'` | `'greeting' \| 'prompt' \| 'wheel' \| 'result' \| 'tictactoe' \| 'ttt-result' \| 'trivia' \| 'trivia-result' \| 'done'` |

## Relationships

```
PetFullscreen
  └── pickMiniGame() → MiniGameType → 'trivia'
       └── TriviaGame component
            ├── reads: TriviaQuestion[] (static pool)
            ├── internal state: current question index, selected answers, score
            └── outputs: TriviaResult → PetFullscreen → onAwardCoins(score)
```

## No New Persistence

All trivia data is ephemeral (game state) or static (question pool). Coin awards flow through the existing `onAwardCoins` callback which persists via the existing profile save mechanism.
