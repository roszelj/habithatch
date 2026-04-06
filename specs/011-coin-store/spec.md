# Feature Specification: Coin Store

**Feature Branch**: `011-coin-store`
**Created**: 2026-04-06
**Status**: Draft
**Input**: User description: "move the wardrobe over to a store where they can spend the points that they have earned on each item in the store"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Earn Coins from Chores (Priority: P1)

When a child completes a chore and earns category points (Morning/
Afternoon/Evening), they also earn an equal number of coins. Coins
are a separate currency displayed on the game screen alongside the
category points. Coins accumulate over time and persist between
sessions. Coins are never spent by the time-of-day care actions —
they are reserved exclusively for the store.

**Why this priority**: Without coins, there's nothing to spend in
the store. The earning mechanic must exist first.

**Independent Test**: Can be tested by completing a chore and
verifying both category points and coins increase.

**Acceptance Scenarios**:

1. **Given** a child completes a Morning chore worth 5 points,
   **When** the points are awarded, **Then** 5 Morning points AND
   5 coins are added to their balance.
2. **Given** a child has 25 coins, **When** they view the game
   screen, **Then** the coin balance is displayed prominently.
3. **Given** a parent awards a bonus of 10 points, **When** the
   bonus is given, **Then** 10 coins are also added.

---

### User Story 2 - Browse the Store (Priority: P1)

The "Wardrobe" button is replaced by a "Store" button. When the
child opens the Store, they see all outfits and accessories with
prices. Items the child already owns are marked as "Owned". Items
they can afford show a "Buy" button. Items they can't afford show
the price grayed out. The child starts with no items — they must
earn coins to buy their first outfit or accessory.

**Why this priority**: Co-equal with US1 — the store is where coins
are spent. Without it, coins have no purpose.

**Independent Test**: Can be tested by opening the Store and
verifying items show prices, owned status, and buy/can't afford
states.

**Acceptance Scenarios**:

1. **Given** the child opens the Store with 0 coins, **When** they
   view the items, **Then** all items show their price and no "Buy"
   button is enabled.
2. **Given** the child has 20 coins and an item costs 15, **When**
   they view that item, **Then** a "Buy" button is visible and
   enabled.
3. **Given** the child already owns "Superhero Cape", **When** they
   view the Store, **Then** the cape shows "Owned" instead of a
   price/buy button.

---

### User Story 3 - Buy and Equip Items (Priority: P1)

When the child buys an item, coins are deducted and the item is
added to their owned collection permanently. After buying, the child
can equip the item immediately or browse more. Owned items can be
equipped or unequipped at any time from the Store without additional
cost.

**Why this priority**: The purchase flow is the core store
interaction. Without it, the store is just a catalog.

**Independent Test**: Can be tested by buying an item, verifying
coins deducted, then equipping it and seeing it on the creature.

**Acceptance Scenarios**:

1. **Given** the child has 20 coins and taps "Buy" on an item
   costing 15, **When** the purchase completes, **Then** coins
   decrease to 5 and the item is marked as "Owned".
2. **Given** the child owns an outfit, **When** they tap "Equip",
   **Then** the creature immediately shows the new outfit.
3. **Given** the child has an outfit equipped, **When** they tap
   "Unequip", **Then** the creature returns to its default look.
4. **Given** the child tries to buy an item costing 30 but has only
   10 coins, **When** they tap the item, **Then** the buy button
   is disabled and shows the remaining cost needed.

---

### Edge Cases

- What about the outfit/accessory selected during creature creation?
  Creation no longer offers outfit/accessory selection — the
  creature starts bare. The creation flow is simplified to just
  type → name.
- What if the child already has outfits from before this feature?
  Existing equipped outfits/accessories are grandfathered into the
  owned collection.
- What about the free Wardrobe that existed before? It's replaced
  entirely by the Store. No more free outfit changes — outfits
  must be purchased. Equipping owned items remains free.
- Can parents give coins directly? Yes — the bonus feature already
  awards coins alongside category points.
- What if coins overflow? Coins cap at 9999.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST track a "coins" balance per child,
  separate from per-category action points.
- **FR-002**: When a child earns category points (from chores or
  bonuses), they MUST also earn an equal number of coins.
- **FR-003**: The coin balance MUST be displayed on the game screen.
- **FR-004**: Coins MUST NOT be spent by time-of-day care actions
  (Morning/Afternoon/Evening) — only by store purchases.
- **FR-005**: The "Wardrobe" button MUST be replaced by a "Store"
  button on the game screen.
- **FR-006**: The Store MUST display all outfits and accessories
  with a coin price for each item.
- **FR-007**: Each item MUST have a defined coin price:
  - Outfits: 15-30 coins each
  - Accessories: 10-20 coins each
- **FR-008**: Items the child already owns MUST show "Owned" status.
- **FR-009**: Items the child can afford MUST show an enabled "Buy"
  button.
- **FR-010**: Items the child cannot afford MUST show the price
  grayed out with the buy button disabled.
- **FR-011**: Purchasing an item MUST deduct coins and permanently
  add the item to the child's owned collection.
- **FR-012**: Owned items MUST be equippable and unequippable at
  any time from the Store at no additional cost.
- **FR-013**: The creature creation flow MUST be simplified to
  type → name only (no outfit/accessory selection). Creatures
  start with no outfit or accessory.
- **FR-014**: Existing owned outfits/accessories from before this
  feature MUST be preserved in the child's collection.
- **FR-015**: Coins MUST persist between sessions and carry over
  day to day.
- **FR-016**: Coins MUST cap at 9999.
- **FR-017**: All store content MUST be age-appropriate
  (Constitution Principle III).

### Key Entities

- **Coins**: A separate currency earned alongside category points.
  Used exclusively for store purchases. Persists between sessions.
  Range: 0-9999.
- **StoreItem**: An outfit or accessory with a name, visual, coin
  price, and owned/not-owned status per child.
- **OwnedItems**: The set of outfits and accessories a child has
  purchased. Persists permanently. Items can be equipped/unequipped
  freely.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Kids understand that chores earn both action points
  and coins within 1 minute of their first chore completion.
- **SC-002**: 80% of kids make their first store purchase within
  their first week of play.
- **SC-003**: Kids can browse the store, buy an item, and equip it
  in under 30 seconds.
- **SC-004**: The coin economy creates a savings goal — kids report
  wanting to "earn enough for" a specific item.
- **SC-005**: No child reports confusion about the difference between
  coins (store) and category points (care actions).

## Assumptions

- This feature replaces the free Wardrobe with a coin-based Store.
- The creation flow is simplified — no more outfit/accessory
  picker during creation. Kids start bare and earn their look.
- Coins are earned 1:1 with category points (5 pts from a chore =
  5 coins).
- Outfits and accessories from the existing catalog are reused with
  prices assigned.
- Store purchases are permanent — no selling items back.
- The store uses the same item catalog for all creature types.
- Coin balance is stored per child profile alongside existing data.
- The total points display on the game screen becomes the coin
  display.
