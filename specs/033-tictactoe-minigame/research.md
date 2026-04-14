# Research: Tic-Tac-Toe Mini Game

## Decision 1: Tic-Tac-Toe AI Difficulty Strategy

**Decision**: Use a mixed strategy — 60% of moves use optimal play (minimax), 40% of moves are random valid moves. This creates a "moderate" opponent that blocks obvious wins most of the time but occasionally makes mistakes, appropriate for children ages 5-10.

**Rationale**: Pure minimax is unbeatable (always draws or wins when going second). Pure random is too easy and not engaging. A probabilistic blend gives kids a realistic ~40-60% win rate as specified in the success criteria.

**Alternatives considered**:
- Pure minimax: Too hard for kids, always draws at best — frustrating
- Pure random: Too easy, no challenge — boring after first game
- Difficulty levels: Over-scoped for a mini game, adds UI complexity

## Decision 2: Game Selection Mechanism

**Decision**: When the child taps "Yes!" in the game prompt, use a simple `Math.random() < 0.5` coin flip to select spin wheel vs tic-tac-toe. The selection happens at the moment of acceptance, not predetermined.

**Rationale**: Simple, fair, and unpredictable. No state to track across sessions. Matches the 50/50 probability requirement from the spec.

**Alternatives considered**:
- Weighted selection based on last played: Adds complexity and persistence for minimal UX gain
- Alternating games: Predictable, removes surprise element
- Player choice: Spec explicitly says "randomly pop up" — selection should be automatic

## Decision 3: Game Phase Integration

**Decision**: Extend the existing `GamePhase` type in PetFullscreen from `'greeting' | 'prompt' | 'wheel' | 'result' | 'done'` to also include `'tictactoe' | 'ttt-result'`. The game selection happens at the 'prompt' → next phase transition.

**Rationale**: Keeps all game flow in one state machine within PetFullscreen. The ttt-result phase is separate from the wheel result phase because the display is different (win/loss/draw vs segment type).

**Alternatives considered**:
- Separate overlay component per game: More isolated but adds complexity to the overlay management
- Shared result phase: Possible but the result display is different enough (coin amount vs win/loss message) to warrant separate phases

## Decision 4: Board Representation

**Decision**: Represent the board as a flat array of 9 cells (`(null | 'X' | 'O')[]`), indexed 0-8 (row-major: top-left=0, top-right=2, bottom-left=6, bottom-right=8).

**Rationale**: Simple, efficient, easy to check win conditions with predefined index triples. Flat array is simpler than 2D array for this small board size.

**Alternatives considered**:
- 2D array `[3][3]`: More intuitive mapping but adds indexing complexity for win checks
- Object map: Over-engineered for 9 cells

## Decision 5: Coin Reward Calculation

**Decision**: On child win, generate a random integer between 30 and 75 inclusive using `Math.floor(Math.random() * 46) + 30`. Pass through the existing `onAwardCoins` callback which already handles MAX_COINS capping and floor-at-0.

**Rationale**: Reuses the exact same coin mutation path as the spin wheel. No new persistence code needed.

**Alternatives considered**:
- Fixed reward: Less exciting, no variability
- Tiered rewards based on move count: Over-scoped, adds complexity

## Decision 6: Pet Move Timing

**Decision**: After the child places an X, show a brief "thinking" delay of 800ms before the pet places its O. During this delay, the board is non-interactive (taps are ignored).

**Rationale**: The delay makes the pet feel like a real opponent "thinking" about its move. 800ms is within the 0.5-1s range from the spec. Disabling interaction during the delay prevents race conditions.

**Alternatives considered**:
- No delay (instant): Feels robotic, not fun
- Variable delay based on difficulty of position: Over-engineered for a kids mini game
- Animation during thinking: Nice-to-have but not essential for MVP
