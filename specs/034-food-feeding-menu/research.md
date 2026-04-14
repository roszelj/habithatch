# Research: Food Feeding Menu

**Feature**: 034-food-feeding-menu
**Date**: 2026-04-11

## Research Questions & Decisions

### R1: Health restore amount per feeding

**Decision**: Fixed 10 HP per feeding, regardless of food choice.

**Rationale**: The current system restores 10/15/25 HP for morning/afternoon/evening at costs of 3/5/8 points respectively. With a unified 2-coin cost, a flat 10 HP restore keeps the economy balanced — it's the cheapest current option's restore value at a lower cost, which is appropriate since coins are harder to stockpile than category points (coins are shared across all spending: store, feeding, rewards).

**Alternatives considered**:
- Variable HP per food item: Rejected — adds complexity without meaningful gameplay depth. Kids would just always pick the highest-HP food.
- Higher restore (15-25 HP): Rejected — at 2 coins cost, higher restore would make feeding too cheap and reduce the incentive to do chores.

### R2: Impact on existing point categories

**Decision**: Time-of-day points (morning/afternoon/evening) are no longer spent on feeding. They continue to be earned via chores and accumulate, but feeding now costs coins instead.

**Rationale**: The spec states feeding costs 2 coins, not points. Points still serve a purpose as the mechanism through which chores contribute to the creature's state — points are earned when chores are approved, and coins are earned alongside them. The TIME_ACTIONS array and time-of-day action types in the reducer will no longer be used for feeding, but the point categories remain for chore organization.

**Alternatives considered**:
- Remove points entirely: Rejected — points are deeply wired into chore categories and the data model. Removing them would be a much larger refactor with no benefit to this feature.
- Spend points instead of coins: Rejected — contradicts the spec which explicitly says 2 coins.

### R3: What happens to the existing ActionButton rendering of TIME_ACTIONS

**Decision**: Remove the TIME_ACTIONS action button row from the main pet view. Replace with a single "Feed" button. The ActionButton component itself can be reused for the Feed button.

**Rationale**: The three buttons (Morning 3pt, Afternoon 5pt, Evening 8pt) are replaced by a single Feed button (2 coins). The ActionButton component's interface (emoji, label, cost, disabled, onClick) maps cleanly to the new Feed button.

### R4: CreatureAction type changes

**Decision**: Add a new `'feed'` action type to CreatureAction. Keep existing time-of-day action types in the union for backward compatibility with the reducer, but they will no longer be dispatched from the UI.

**Rationale**: Adding a dedicated `'feed'` action is cleaner than repurposing an existing time-of-day action. The reducer handler for `'feed'` will restore a fixed HP amount without touching category points — it only needs to increase health.

**Alternatives considered**:
- Reuse existing time-of-day dispatch: Rejected — the semantics have changed (coins vs points, fixed cost vs variable cost). A new action type is clearer.

### R5: Food-specific speech bubble messages

**Decision**: Each food item has 2-3 associated speech bubble messages. One is randomly selected when that food is fed to the pet.

**Rationale**: Adds variety and delight without complexity. The existing speech bubble system in Game.tsx already handles showing/hiding messages with a timer, so we just need to provide food-specific message arrays.

### R6: Popup/modal pattern

**Decision**: Overlay modal with semi-transparent backdrop, similar to the existing PetFullscreen overlay pattern. Tapping outside or a close button dismisses it.

**Rationale**: The app already uses full-screen overlays (PetFullscreen). A similar pattern for the food menu keeps the UI consistent. The food items display as a grid of tappable cards with emojis.
