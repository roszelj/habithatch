# Data Model: Tic-Tac-Toe Mini Game

## Entities

### MiniGameType

Represents the available mini games for random selection.

| Value | Description |
|-------|-------------|
| `'spin-wheel'` | Existing spin wheel game (feature 032) |
| `'tictactoe'` | New tic-tac-toe game |

**Selection**: 50/50 random coin flip at moment of game acceptance.

### TicTacToeCell

A single cell on the game board.

| Value | Meaning |
|-------|---------|
| `null` | Empty cell, available for play |
| `'X'` | Child's mark |
| `'O'` | Pet's mark |

### TicTacToeBoard

Flat array of 9 `TicTacToeCell` values, indexed row-major:

```
Index layout:
  0 | 1 | 2
  ---------
  3 | 4 | 5
  ---------
  6 | 7 | 8
```

Initial state: all 9 cells are `null`.

### TicTacToeGameResult

| Value | Meaning | Coin Effect |
|-------|---------|-------------|
| `'child-won'` | Child got 3 X's in a row | +30 to +75 random |
| `'pet-won'` | Pet got 3 O's in a row | No change |
| `'draw'` | All 9 cells filled, no winner | No change |

### Win Conditions

8 possible winning lines (index triples):

| Type | Lines |
|------|-------|
| Rows | [0,1,2], [3,4,5], [6,7,8] |
| Columns | [0,3,6], [1,4,7], [2,5,8] |
| Diagonals | [0,4,8], [2,4,6] |

A player wins when any line contains all 3 of their marks.

### Pet AI Behavior

| Parameter | Value |
|-----------|-------|
| Strategy | Mixed: 60% optimal (minimax), 40% random |
| Thinking delay | 800ms |
| Goes second | Always (child is X, moves first) |

**Effective win rates** (approximate):
- Child wins: ~45%
- Pet wins: ~30%
- Draw: ~25%

## State Lifecycle

```
Game Start → Empty Board → Child Move → Pet Thinking (800ms) → Pet Move →
  → Check Win/Draw → Continue or End
  → If child won: random(30-75) coins via onAwardCoins
  → If pet won or draw: encouraging message, no coins
```

All state is ephemeral — lives in React component state only. Closing the overlay discards all game state.
