# Feature Specification: Creature Habitats

**Feature Branch**: `017-creature-habitats`
**Created**: 2026-04-07
**Status**: Draft
**Input**: User description: "Add a new category to the store called habitat that will have different images like bedroom, amusement park, space, beach, forest, desert, rain forest that can be bought with coins. The enabled habitat would be surrounding the creature in the background."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Child Browses and Buys a Habitat (Priority: P1)

A child opens the store, navigates to the new Habitats section, sees all available habitats with their coin prices, and purchases one using their earned coins. The purchased habitat becomes available to equip.

**Why this priority**: This is the core purchase flow. Without it, the feature has no value. It follows the same pattern as outfits and accessories, so it should feel immediately familiar.

**Independent Test**: Open the store to the Habitats tab with enough coins. Purchase a habitat. Verify coins are deducted and the habitat is now owned.

**Acceptance Scenarios**:

1. **Given** a child is in the store, **When** they navigate to the Habitats section, **Then** they see all 7 habitats (Bedroom, Amusement Park, Space, Beach, Forest, Desert, Rain Forest) each showing a preview image/emoji and coin price.
2. **Given** a child has enough coins for a habitat, **When** they tap Buy, **Then** the habitat is added to their owned habitats and the coin balance decreases by the correct amount.
3. **Given** a child does not have enough coins for a habitat, **When** they view the habitat, **Then** the Buy button is disabled or shows they cannot afford it.
4. **Given** a child already owns a habitat, **When** they view it in the store, **Then** the Buy button is replaced with an Equip or Owned indicator.

---

### User Story 2 - Child Equips a Habitat and Sees It on the Game Screen (Priority: P1)

After purchasing a habitat, the child equips it and immediately sees the game screen background change to reflect the chosen habitat, surrounding their creature.

**Why this priority**: This is the payoff moment — the visible reward for earning coins. Equal priority to purchasing because a habitat that can't be seen is worthless.

**Independent Test**: Purchase and equip a habitat. Return to the game screen. Confirm the background reflects the selected habitat and the creature is visible in front of it.

**Acceptance Scenarios**:

1. **Given** a child owns at least one habitat, **When** they tap a habitat in the store (or wardrobe), **Then** it becomes their active habitat and is immediately reflected on the game screen.
2. **Given** a habitat is equipped, **When** the child views the game screen, **Then** the habitat appears as the background behind the creature.
3. **Given** a child equips a new habitat, **When** they switch profiles and return, **Then** the selected habitat is still active (persisted across sessions).
4. **Given** no habitat is equipped, **When** the child views the game screen, **Then** the default background is shown (no habitat = plain/original background).

---

### User Story 3 - Child Changes Their Habitat (Priority: P2)

A child who owns multiple habitats can switch between them freely at any time, either from the store or from a wardrobe-style selection screen.

**Why this priority**: Re-equipping drives long-term engagement and makes owning multiple habitats feel worthwhile. Secondary to the initial buy/equip flow.

**Independent Test**: Own 2+ habitats. Switch from one to another. Verify game screen updates immediately.

**Acceptance Scenarios**:

1. **Given** a child owns multiple habitats, **When** they select a different owned habitat, **Then** the active habitat updates immediately on the game screen.
2. **Given** a child wants to remove their habitat, **When** they have no way to unequip, **Then** switching to the default/no-habitat option is available.

---

### Edge Cases

- What happens if a child spends coins down to zero while habitats remain unaffordable? Store should show clear "not enough coins" state for locked habitats.
- What happens if the coin balance drops below the cost of all habitats after a purchase (e.g., store purchase)? Owned habitats remain owned — purchasing is one-time.
- What happens when the habitat background and creature sprite overlap visually? The creature must always appear clearly in front of the habitat (creature is foreground, habitat is background).
- What if a future habitat is added in an update? The system should support adding more habitats without breaking existing owned data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The store MUST include a Habitats section alongside the existing Outfits and Accessories sections.
- **FR-002**: The Habitats section MUST display all available habitats, each with a name, visual preview (image or themed emoji), and coin price.
- **FR-003**: The initial habitat catalog MUST include exactly 7 habitats: Bedroom, Amusement Park, Space, Beach, Forest, Desert, and Rain Forest.
- **FR-004**: A child MUST be able to purchase a habitat using their coin balance if they have sufficient coins.
- **FR-005**: Purchasing a habitat MUST deduct the correct coin amount from the child's balance and add the habitat to their owned collection.
- **FR-006**: A child MUST be able to equip any owned habitat, which immediately becomes the active background on the game screen.
- **FR-007**: The active habitat MUST be displayed as the background surrounding the creature on the game screen, with the creature rendered in the foreground.
- **FR-008**: The active habitat selection MUST persist across app sessions and profile switches.
- **FR-009**: A child who does not own a habitat MUST NOT be able to equip one they have not purchased.
- **FR-010**: The game screen MUST display a default plain background when no habitat is equipped.
- **FR-011**: Each habitat MUST be purchasable only once per profile (one-time purchase, not recurring).

### Key Entities

- **Habitat**: A purchasable background environment. Has an id, name, visual representation, and coin price. Belongs to the catalog.
- **Child Profile**: Extended to track owned habitats (list of habitat ids) and the active/equipped habitat id (nullable).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 7 habitats are visible and purchasable in the store within 2 taps from the game screen.
- **SC-002**: After purchasing a habitat, the game screen background updates within 1 second of equipping.
- **SC-003**: A child's equipped habitat is correctly restored after closing and reopening the app 100% of the time.
- **SC-004**: The creature remains clearly visible (not obscured) against all 7 habitat backgrounds.
- **SC-005**: A child with insufficient coins cannot purchase a habitat — 0% of affordability errors result in negative coin balances.

## Assumptions

- Habitats are represented by themed emoji compositions or CSS/color gradients — no external image assets are required for v1.
- All 7 habitats have the same coin price (to be decided during planning), or prices are tiered by theme complexity.
- The Habitats tab in the store follows the same layout pattern as the existing Outfits and Accessories tabs.
- Habitats are per-profile — each child's active habitat and owned habitats are independent.
- There is no limit to how many habitats a profile can own (up to the full catalog of 7).
- A "default" no-habitat state (the current plain background) is always available at no cost and does not need to be purchased.
- The wardrobe screen (if it exists) may also show habitats alongside outfits and accessories, but the store is the primary purchase point.
