# Feature Specification: Food Feeding Menu

**Feature Branch**: `034-food-feeding-menu`
**Created**: 2026-04-11
**Status**: Draft
**Input**: User description: "I want to change on the main page when pressing on morning, afternoon, evening to feed the animal to be 1 button that would cost 2pts to feed with a popup to select what kind of food to feed them (Eggs, Pancakes, donuts, sandwich, pizza, tacos, salad, ice cream sundae)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Feed Pet with Food Selection (Priority: P1)

A child wants to feed their pet creature. On the main pet screen, they tap a single "Feed" button. A popup appears showing 8 food options (Eggs, Pancakes, Donuts, Sandwich, Pizza, Tacos, Salad, Ice Cream Sundae) displayed as a visual menu. The child selects a food item, the pet eats it with a feeding animation and speech bubble reaction, 2 coins are deducted, and the pet's health is restored.

**Why this priority**: This is the core feature — replacing the existing three time-of-day buttons with a unified feeding experience. Without this, nothing else works.

**Independent Test**: Can be fully tested by tapping the Feed button, selecting a food, and verifying the pet reacts, health increases, and coins are deducted.

**Acceptance Scenarios**:

1. **Given** the child has 2 or more coins, **When** they tap the "Feed" button, **Then** a food selection popup appears showing all 8 food options.
2. **Given** the food selection popup is open, **When** the child taps a food item, **Then** the popup closes, the pet shows a feeding reaction with a speech bubble, health is restored, and 2 coins are deducted.
3. **Given** the child has fewer than 2 coins, **When** they view the main pet screen, **Then** the Feed button appears disabled or visually indicates insufficient coins.

---

### User Story 2 - Dismiss Food Popup Without Feeding (Priority: P2)

A child opens the food selection popup but decides not to feed their pet. They dismiss the popup by tapping outside of it or tapping a close button, and no coins are spent.

**Why this priority**: Essential for usability — children must be able to cancel without penalty.

**Independent Test**: Can be tested by opening the popup and dismissing it, then verifying coin balance is unchanged.

**Acceptance Scenarios**:

1. **Given** the food selection popup is open, **When** the child taps outside the popup or taps a close/back button, **Then** the popup closes and no coins are deducted.

---

### User Story 3 - Food-Specific Pet Reactions (Priority: P3)

When the child feeds the pet a specific food, the pet reacts with a speech bubble message relevant to the food chosen, making the feeding experience feel personalized and fun.

**Why this priority**: Adds delight and replay value but is not required for core functionality.

**Independent Test**: Can be tested by feeding different foods and verifying the speech bubble shows food-relevant messages.

**Acceptance Scenarios**:

1. **Given** the child selects a food item, **When** the pet is fed, **Then** a speech bubble appears with a message related to the selected food (e.g., "Mmm, pizza!" or "I love pancakes!").

---

### Edge Cases

- What happens when the child has exactly 2 coins? They can feed once; after feeding, the button should reflect that they can no longer afford to feed.
- What happens if the child rapidly taps a food item multiple times? Only one feeding should be processed per popup interaction.
- What happens when the pet's health is already at 100%? The child can still feed (coins are spent, reaction plays), but health stays capped at 100.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The three existing time-of-day feeding buttons (Morning, Afternoon, Evening) on the main pet screen MUST be replaced with a single "Feed" button.
- **FR-002**: Tapping the Feed button MUST open a popup/modal displaying 8 food options: Eggs, Pancakes, Donuts, Sandwich, Pizza, Tacos, Salad, and Ice Cream Sundae.
- **FR-003**: Each food item in the popup MUST be visually represented (emoji or icon) with its name.
- **FR-004**: Selecting a food item MUST cost 2 coins and restore the pet's health.
- **FR-005**: The Feed button MUST be disabled when the child has fewer than 2 coins, with a visual indication of insufficient funds.
- **FR-006**: The food selection popup MUST be dismissible without making a selection (no coins spent).
- **FR-007**: After feeding, the pet MUST display a feeding reaction animation and a speech bubble message.
- **FR-008**: The existing point categories (morning, afternoon, evening) used for feeding MUST be replaced by the coin-based cost model for the Feed action.

### Key Entities

- **Food Item**: A selectable food option with a name, visual representation (emoji/icon), and an associated speech bubble message for pet reactions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Children can feed their pet in 2 taps or fewer (tap Feed, tap food item).
- **SC-002**: The feeding interaction completes (popup opens, food selected, reaction shown) in under 2 seconds.
- **SC-003**: 100% of food items are visually distinguishable and clearly labeled in the popup.
- **SC-004**: Pet health increases and coins decrease correctly after every feeding action.

## Assumptions

- The health restore amount per feeding is a single fixed value (same regardless of which food is chosen). The specific restore amount will use a reasonable default during implementation.
- Coins are the currency used for feeding (replacing the previous morning/afternoon/evening point costs). The existing coin earning mechanism via chores remains unchanged.
- The three time-of-day action buttons are fully removed from the main pet view. The time-of-day categories (morning, afternoon, evening) continue to exist for chore organization and point earning, but are no longer used for feeding.
- The food menu is a fixed list of 8 items and is not configurable by parents or children.
