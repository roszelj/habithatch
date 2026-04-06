# Feature Specification: Categorized Chores

**Feature Branch**: `005-categorized-chores`
**Created**: 2026-04-02
**Status**: Draft
**Input**: User description: "the chore list should attached to each category morning, afternoon, evening"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Chores Grouped by Time of Day (Priority: P1)

Instead of a single flat chore list, chores are organized into three
categories that match the care actions: Morning, Afternoon, and
Evening. When the player opens the chore panel, they see three
sections — each with its own list of chores. Completing a chore in
the "Morning" section earns points that can be spent on the Morning
care action (and likewise for Afternoon and Evening). This creates
a clear connection between real-world routines and creature care.

**Why this priority**: This is the entire feature — restructuring
the chore list from flat to categorized. Everything else depends on
this.

**Independent Test**: Can be tested by opening the chore panel and
verifying three separate sections (Morning, Afternoon, Evening)
appear, each accepting its own chores.

**Acceptance Scenarios**:

1. **Given** the player opens the chore panel, **When** the panel
   loads, **Then** three sections are visible: Morning, Afternoon,
   and Evening, each with its own add-chore input.
2. **Given** the Morning section is shown, **When** the player adds
   a chore "Brush teeth", **Then** it appears under the Morning
   section (not Afternoon or Evening).
3. **Given** the player has chores in all three categories, **When**
   they view the panel, **Then** each category's chores are clearly
   grouped with a visible heading.

---

### User Story 2 - Earn Points per Category (Priority: P1)

When a player checks off a chore, the points earned are tied to
that chore's category. Completing a Morning chore earns points
toward Morning actions, completing an Afternoon chore earns points
toward Afternoon actions, and so on. The player sees a per-category
point balance so they know how many points they have available for
each time-of-day action.

**Why this priority**: Co-equal with US1 — the category-specific
point earning is what makes the grouping meaningful for gameplay.

**Independent Test**: Can be tested by checking off a Morning chore
and verifying that Morning points increase but Afternoon and Evening
points do not.

**Acceptance Scenarios**:

1. **Given** a Morning chore is unchecked, **When** the player
   checks it off, **Then** 5 points are added to the Morning point
   balance only.
2. **Given** the player has 5 Morning points and 0 Afternoon points,
   **When** they view the action buttons, **Then** Morning is enabled
   (enough points) and Afternoon is disabled (not enough points).
3. **Given** the player views the game screen, **When** they look
   at the point display, **Then** they see separate point balances
   for Morning, Afternoon, and Evening.

---

### User Story 3 - Manage Chores per Category (Priority: P2)

The player can add, remove, and reset chores within each category
independently. Resetting "Morning" chores for a new day does not
affect Afternoon or Evening chores.

**Why this priority**: Management features per category are
important but the game works with basic add-and-check flow first.

**Independent Test**: Can be tested by resetting Morning chores and
verifying Afternoon/Evening chores remain unchanged.

**Acceptance Scenarios**:

1. **Given** Morning and Afternoon both have completed chores,
   **When** the player resets Morning chores, **Then** only Morning
   chores return to unchecked — Afternoon chores stay completed.
2. **Given** a chore exists under Evening, **When** the player
   removes it, **Then** it disappears from Evening only.

---

### Edge Cases

- What if a category has no chores? It shows an empty state with
  a prompt to add the first chore for that time of day.
- What if the player has points in one category but not others?
  Only the action button for the funded category is enabled.
- What if the player rapidly checks off chores across categories?
  Each check-off independently awards points to its category.
- What if the player resets all categories at once? A "Reset All"
  option resets chores in all three categories simultaneously.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The chore panel MUST organize chores into three
  categories: Morning, Afternoon, and Evening.
- **FR-002**: Each category MUST have its own add-chore input,
  chore list, and reset button.
- **FR-003**: Completing a chore MUST award 5 points to that
  chore's specific category (not a shared pool).
- **FR-004**: The game MUST track separate point balances for
  Morning, Afternoon, and Evening.
- **FR-005**: Each time-of-day action button MUST only be enabled
  when the player has enough points in that specific category.
- **FR-006**: The game screen MUST display per-category point
  balances so the player knows their available points for each
  action.
- **FR-007**: Each category's chores MUST be independently
  manageable — add, remove, check off, and reset operate within
  one category only.
- **FR-008**: A "Reset All" option MUST be available to reset
  chores across all categories at once.
- **FR-009**: The player MUST start each session with 2 points in
  each category (6 total, enough for one Morning action to start).
- **FR-010**: Per-category points MUST NOT go below 0 and MUST
  cap at 999.
- **FR-011**: All chore text and visuals MUST be age-appropriate
  for children (Constitution Principle III).

### Key Entities

- **CategoryChores**: A group of chores belonging to a time-of-day
  category (Morning, Afternoon, or Evening). Each category has its
  own chore list and point balance.
- **Chore**: A user-created task within a category. Has a name
  (1-40 chars) and completion status. Awards category-specific
  points when checked off.
- **CategoryPoints**: Per-category point balance. Earned by
  completing chores in that category, spent on the matching
  time-of-day action.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can identify which chores belong to which
  time-of-day within 5 seconds of opening the chore panel.
- **SC-002**: Players understand that Morning chores fund Morning
  actions (and likewise) within 1 minute of first interaction.
- **SC-003**: The categorized structure encourages players to add
  at least one chore per category — 80% of users have chores in
  all three categories after one session.
- **SC-004**: No child tester reports confusion about why an action
  button is disabled when they have points in a different category.

## Assumptions

- This feature modifies the existing flat chore list from feature
  004 to be category-based.
- The single shared point balance is replaced by three per-category
  balances.
- Point cost per action and health restoration amounts remain
  unchanged from feature 004.
- Health decay and the single health meter are unchanged.
- Creature type selection and naming are unchanged.
- Chores and points are session-only (no persistence).
