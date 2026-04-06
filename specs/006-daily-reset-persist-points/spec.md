# Feature Specification: Daily Reset with Persistent Points

**Feature Branch**: `006-daily-reset-persist-points`
**Created**: 2026-04-02
**Status**: Draft
**Input**: User description: "all chore lists points should accumulate on going day after day but the list will reset each day"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Points Persist Between Sessions (Priority: P1)

When the player closes the game and returns later (even the next day),
their accumulated point balances are preserved. Points earned
yesterday are still available today. This rewards consistent play —
a kid who does chores every day builds up a healthy point reserve
to care for their creature.

**Why this priority**: Without persistence, all progress is lost on
every page refresh. This is the foundation for ongoing engagement.

**Independent Test**: Can be tested by earning points, closing the
browser, reopening the game, and verifying points are still there.

**Acceptance Scenarios**:

1. **Given** the player has 15 Morning points, 10 Afternoon points,
   and 8 Evening points, **When** they close and reopen the game,
   **Then** all three point balances are restored exactly.
2. **Given** the player has earned points across multiple days,
   **When** they check their balance on day 3, **Then** the total
   reflects all points earned minus all points spent across all days.
3. **Given** a brand new player with no saved data, **When** they
   open the game for the first time, **Then** they start with the
   default starting points (2 per category).

---

### User Story 2 - Chores Auto-Reset Daily (Priority: P1)

Each day, all chore completion checkmarks automatically reset to
unchecked — the chore names stay, but they're ready to be completed
again. This means the player can earn points from the same set of
chores every day without manually resetting. The reset happens based
on the calendar date, not a fixed timer.

**Why this priority**: Co-equal with US1 — daily reset is the core
loop. Kids do the same chores every day, so automatic reset makes
the game match real life.

**Independent Test**: Can be tested by completing chores, advancing
the date (or simulating a new day), and verifying all chores are
unchecked again while points remain.

**Acceptance Scenarios**:

1. **Given** the player completed 3 Morning chores today, **When**
   they open the game the next calendar day, **Then** all Morning
   chores are unchecked (ready to complete again).
2. **Given** it's still the same calendar day, **When** the player
   reopens the game multiple times, **Then** completed chores stay
   checked (no premature reset).
3. **Given** chores were completed and the day changes, **When** the
   game loads, **Then** the chore list (names) is preserved but all
   completion statuses reset to unchecked.

---

### User Story 3 - Persist Chore Lists and Creature (Priority: P1)

The player's chore lists (names and categories), creature choice
(type and name), and health are all saved between sessions alongside
the points. When the player returns, everything is exactly as they
left it (except chore completion status, which resets daily per US2).

**Why this priority**: Without saving the creature and chore list
definitions, the player would have to re-select their pet and
re-enter all chores on every visit. This makes persistence complete.

**Independent Test**: Can be tested by setting up chores, choosing
a creature, closing the game, and reopening to verify everything
loads back.

**Acceptance Scenarios**:

1. **Given** the player chose a Cat named "Muffin" with chores set
   up, **When** they reopen the game, **Then** they see their cat
   "Muffin" with the same chore lists (not the selection screen).
2. **Given** the creature's health was at 65%, **When** the player
   reopens the game, **Then** health is restored to 65% (not reset
   to 100%).
3. **Given** a player with saved data, **When** they want to start
   fresh, **Then** a "Reset Game" option is available to clear all
   saved data.

---

### Edge Cases

- What if the player opens the game after being away for multiple
  days? Chores reset based on the current date — they're unchecked
  regardless of how many days passed. Points and health are
  preserved as-is (health does not decay while the game is closed).
- What if the browser's date/time is wrong or changed? The game
  uses the browser's local date. If the date moves forward, chores
  reset. If the date moves backward, chores stay as-is (no
  exploit — already-earned points aren't affected).
- What if saved data becomes corrupted? The game falls back to a
  fresh start (default creature selection screen, default points).
- What if the player clears browser data? All saved data is lost;
  the game starts fresh as if new.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Per-category point balances MUST persist between
  browser sessions.
- **FR-002**: Chore lists (names and categories) MUST persist
  between browser sessions.
- **FR-003**: Chore completion status MUST automatically reset
  to unchecked when the calendar date changes (local time).
- **FR-004**: Chore completion status MUST NOT reset if the game
  is reopened on the same calendar day.
- **FR-005**: The player's creature choice (type and name) MUST
  persist between sessions.
- **FR-006**: The creature's health percentage MUST persist between
  sessions.
- **FR-007**: Health MUST NOT decay while the game is closed. Decay
  only occurs while the game is actively running.
- **FR-008**: On first launch with no saved data, the game MUST
  start with the creature selection screen and default points.
- **FR-009**: If saved data exists, the game MUST skip the selection
  screen and go directly to the game with the saved creature.
- **FR-010**: A "Reset Game" option MUST be available to clear all
  saved data and return to the first-launch experience.
- **FR-011**: If saved data is missing or corrupted, the game MUST
  gracefully fall back to a fresh start.
- **FR-012**: Saved data MUST be stored locally on the player's
  device only — MUST NOT be transmitted to any external service
  (Constitution Principle III).

### Key Entities

- **SaveData**: The complete game state persisted between sessions.
  Contains: creature type, creature name, health, per-category
  point balances, chore lists (names + categories), and the last
  played date (for daily reset detection).
- **DailyReset**: The mechanism that detects a new calendar day
  and resets chore completion statuses while preserving everything
  else.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of game state survives a browser close and
  reopen on the same day — points, health, creature, and chores
  all intact.
- **SC-002**: Chores reset automatically on a new calendar day
  within 1 second of game load — no manual action required.
- **SC-003**: Players who return the next day see their creature
  and points preserved, creating a "welcome back" moment that
  encourages daily play.
- **SC-004**: The Reset Game option returns the game to a fully
  clean first-launch state within 1 second.

## Assumptions

- This feature introduces the game's first persistence layer.
  Previous features were session-only.
- Data is stored in the browser's local storage. No server or
  account system is needed.
- "New day" is determined by the browser's local date (midnight
  local time). No timezone complexity.
- Health does not decay offline — only while the game tab is
  actively running (requestAnimationFrame already handles this).
- The chore list definitions (names) persist forever until the
  player removes them. Only the completion checkmarks reset daily.
- The creature selection and naming only happen once on first
  launch. After that, saved data is loaded automatically.
- All data from features 001-005 (creature type, name, health,
  per-category points, categorized chores) must be included in
  the save data.
