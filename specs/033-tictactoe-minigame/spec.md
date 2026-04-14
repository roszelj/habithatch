# Feature Specification: Tic-Tac-Toe Mini Game

**Feature Branch**: `033-tictactoe-minigame`
**Created**: 2026-04-10
**Status**: Draft
**Input**: User description: "when the mini game pops up I want another game to also randomly pop up. This one is tick-tac-toe if the kid wins they get 30-75 coins"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Random Game Selection (Priority: P1)

When the child accepts the pet's "Want to play a game?" invitation in the fullscreen overlay, the system randomly selects which mini game to present — either the existing spin wheel or the new tic-tac-toe game. This keeps the experience fresh and unpredictable for the child.

**Why this priority**: Without random game selection, the new game would never appear. This is the core mechanism that ties the new game into the existing mini game flow.

**Independent Test**: Accept the game invitation multiple times across several fullscreen sessions. Verify that sometimes the spin wheel appears and sometimes tic-tac-toe appears. Both games should be reachable.

**Acceptance Scenarios**:

1. **Given** the child is in the fullscreen pet overlay, **When** they tap "Yes!" to play a game, **Then** the system randomly selects either spin wheel or tic-tac-toe to present
2. **Given** the game selection is random, **When** the child plays across 10 sessions, **Then** both game types should appear (roughly 50/50 distribution)

---

### User Story 2 - Play Tic-Tac-Toe Against the Pet (Priority: P2)

The child plays a game of tic-tac-toe against the pet (computer opponent). The child plays as X and always goes first. The pet plays as O with a simple opponent that provides a fair challenge for a young child — not unbeatable, but not trivially easy. The game board is a standard 3x3 grid with large, kid-friendly tap targets.

**Why this priority**: This is the core gameplay experience — without it, there is no tic-tac-toe game to reward.

**Independent Test**: Start a tic-tac-toe game. Tap cells to place X marks. Verify the pet responds with O marks. Verify win detection works for rows, columns, and diagonals. Verify draw detection works when all cells are filled.

**Acceptance Scenarios**:

1. **Given** tic-tac-toe is selected, **When** the game starts, **Then** the child sees a 3x3 grid and is prompted to make the first move as X
2. **Given** the child places an X, **When** the move is made, **Then** the pet responds with an O after a brief thinking delay (0.5-1 second)
3. **Given** a player gets three in a row (row, column, or diagonal), **When** the winning move is placed, **Then** the game ends and the winner is announced
4. **Given** all 9 cells are filled with no winner, **When** the last move is placed, **Then** the game ends as a draw

---

### User Story 3 - Coin Rewards for Winning (Priority: P3)

When the child wins the tic-tac-toe game, they receive a random coin reward between 30 and 75 coins. If the child loses or draws, no coins are awarded but they receive encouraging feedback from the pet. The reward and feedback are shown before returning to the fullscreen view.

**Why this priority**: Rewards give the game purpose and tie it into the existing coin economy, but the game itself needs to work first.

**Independent Test**: Win a tic-tac-toe game and verify a coin reward between 30-75 is awarded and the balance updates. Lose a game and verify no coins are changed. Draw a game and verify no coins are changed but encouraging message appears.

**Acceptance Scenarios**:

1. **Given** the child wins, **When** the game ends, **Then** the pet announces the win with a random coin reward between 30 and 75, and coins are added to the child's balance
2. **Given** the child loses, **When** the game ends, **Then** the pet shows an encouraging message (e.g., "Good try! Let's play again next time!") and no coins are changed
3. **Given** the game is a draw, **When** the game ends, **Then** the pet shows a draw message (e.g., "A tie! You're getting good!") and no coins are changed
4. **Given** the child wins and their coin balance is near the maximum, **When** coins are awarded, **Then** the balance is capped at the maximum (not exceeded)

---

### Edge Cases

- What happens if the child closes the fullscreen overlay mid-game? The game state is discarded; no coins awarded. Reopening starts fresh.
- What happens if the child taps an already-occupied cell? Nothing happens — the tap is ignored.
- What happens if the child taps during the pet's "thinking" delay? The tap is queued or ignored until the pet finishes its move.
- What happens if the coin reward would exceed the maximum coin balance? Coins are capped at the maximum, no overflow.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST randomly select between spin wheel and tic-tac-toe when the child accepts the game invitation, with equal probability (50/50)
- **FR-002**: System MUST display a 3x3 tic-tac-toe grid with cells large enough for children to tap accurately (minimum 60x60 pixels per cell)
- **FR-003**: The child MUST always play as X and take the first turn
- **FR-004**: The pet opponent MUST make moves automatically after a brief visible delay (0.5-1 second) to simulate "thinking"
- **FR-005**: The pet opponent MUST play at a moderate difficulty — capable of blocking obvious wins but occasionally making suboptimal moves, appropriate for young children (ages 5-10)
- **FR-006**: System MUST detect win conditions (3 in a row: horizontal, vertical, diagonal) and draw conditions (all cells filled, no winner)
- **FR-007**: System MUST award the child a random number of coins between 30 and 75 (inclusive) upon winning
- **FR-008**: System MUST NOT change coin balance on a loss or draw
- **FR-009**: System MUST show a result screen with the pet's message and a "Collect!" button (for wins) or "OK" button (for losses/draws) before returning to the fullscreen view
- **FR-010**: System MUST discard game state if the child closes the overlay mid-game with no coin changes
- **FR-011**: System MUST prevent interaction with occupied cells (tapping an already-filled cell does nothing)
- **FR-012**: System MUST cap coin awards so the balance never exceeds the maximum

### Key Entities

- **TicTacToeGame**: Represents a single game session — board state (9 cells, each empty/X/O), current turn (child or pet), game status (playing, child-won, pet-won, draw), coin reward (set on child win)
- **MiniGameType**: The selection mechanism — which game to present (spin wheel or tic-tac-toe), selected randomly with equal weight

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Children can complete a full tic-tac-toe game (from first move to result screen) in under 2 minutes
- **SC-002**: Both mini games (spin wheel and tic-tac-toe) appear at least 30% of the time each across 20 play sessions
- **SC-003**: 100% of win/loss/draw outcomes are correctly detected and appropriately rewarded
- **SC-004**: Children aged 5-10 can win approximately 40-60% of games against the pet opponent (balanced difficulty)
- **SC-005**: All tap targets on the game board are usable on screens as small as 320px wide

## Assumptions

- The existing fullscreen pet overlay and "Want to play a game?" invitation flow (feature 032) is already implemented and working
- The existing coin economy (balance, MAX_COINS cap, floor at 0) is in place via the `onAwardCoins` callback
- The pet opponent difficulty does not need to be configurable — a single moderate difficulty level is sufficient
- Tic-tac-toe game state is ephemeral (per-session only) — no need to persist incomplete games
- The 50/50 game selection probability does not need to be configurable
