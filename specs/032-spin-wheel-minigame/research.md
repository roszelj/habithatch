# Research: Spin Wheel Mini Game

## Decision 1: Wheel Spin Animation Approach

**Decision**: CSS transform rotation with a dynamically computed final angle. Set the wheel's `transform: rotate(Xdeg)` with a CSS transition using `cubic-bezier` easing that simulates deceleration.

**Rationale**: CSS transforms are GPU-accelerated and perform well on mobile. The final rotation angle is pre-computed based on the randomly selected winning segment, so the visual result always matches the logical outcome. A cubic-bezier curve like `cubic-bezier(0.2, 0.8, 0.3, 1)` gives a natural slow-down feel.

**Alternatives considered**:
- Canvas-based wheel (HTML5 Canvas) — more drawing control but heavier, requires manual rendering, harder to style consistently with the app
- JavaScript requestAnimationFrame loop — more control but unnecessarily complex for a simple deceleration curve
- SVG-based wheel — cleaner scaling but more complex segment construction

## Decision 2: Random Segment Selection

**Decision**: Weighted random selection using probability weights. Each segment has a weight; the total is summed and a random number in [0, total) determines the winner. This is computed before the spin starts, and the final rotation angle is calculated to land on that segment.

**Rationale**: Pre-determining the result before spinning ensures the visual animation always matches the logical outcome. Weighted probabilities let us make coin prizes common, big prizes rare, and penalties occasional.

**Alternatives considered**:
- Equal probability — makes the game feel less dynamic; big prizes and penalties should be rarer
- Physics-based simulation — over-complex for a deterministic visual result

## Decision 3: Wheel Segment Configuration

**Decision**: 8 segments with the following distribution:
1. "+5 coins" (coin-prize, common)
2. "Say something kind!" (kindness-challenge)
3. "+10 coins" (coin-prize, medium)
4. "Lose 5 coins" (coin-penalty)
5. "+3 coins" (coin-prize, common)
6. "Give someone a hug!" (kindness-challenge)
7. "+20 coins" (coin-prize, rare)
8. "Lose 10 coins" (coin-penalty)

**Rationale**: Mix of 4 coin prizes (varying value), 2 kindness challenges, and 2 penalties. Keeps the wheel exciting with variety. Common small prizes keep kids engaged, rare big prize creates excitement, challenges add warmth, penalties add stakes.

## Decision 4: Coin Mutation Callback Architecture

**Decision**: PetFullscreen receives an `onAwardCoins: (amount: number) => void` callback from Game.tsx. Positive amounts add coins; negative amounts deduct (floored at 0). SpinWheel calls this via PetFullscreen when the spin result is collected.

**Rationale**: Game.tsx already manages coin state and profile saving. Passing a simple callback keeps SpinWheel stateless regarding game economy. The floor-at-zero logic is handled in Game.tsx where the current balance is known.

**Alternatives considered**:
- Passing full profile + save callback to SpinWheel — too much coupling for a presentation component
- Two separate callbacks (addCoins, removeCoins) — unnecessary; a single signed amount is simpler

## Decision 5: Game Prompt Timing

**Decision**: The "Want to play?" prompt appears 3 seconds after the greeting bubble (which itself appears 800ms after the view opens). Total time from view open to game prompt: ~3.8 seconds.

**Rationale**: Gives the child time to enjoy the greeting and the wandering creature before being prompted. Not so long that they close the view before seeing it. Feels like a natural conversational pause.

## Decision 6: One Play Per Session

**Decision**: Track a `hasPlayed` boolean in PetFullscreen's local state. Once the child plays or declines, the game prompt does not reappear during that fullscreen session. Reopening the fullscreen view resets the state.

**Rationale**: Prevents spamming the wheel for infinite coins. Since the state is ephemeral (component-local), reopening the view naturally resets it. No persistence needed.
