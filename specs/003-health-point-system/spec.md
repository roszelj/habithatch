# Feature Specification: Health Point System

**Feature Branch**: `003-health-point-system`
**Created**: 2026-04-02
**Status**: Draft
**Input**: User description: "redefine eat, play, sleep to a percentage health meter that is controlled by a point system"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Single Health Meter (Priority: P1)

The three separate stat bars (hunger, happiness, energy) are replaced
by a single unified "Health" meter displayed as a percentage (0-100%).
The creature's mood is derived from this single health percentage
instead of three independent stats. The player sees one clear indicator
of how their creature is doing overall.

**Why this priority**: This is the core mechanic change — replacing
three stats with one health meter. Everything else builds on this.

**Independent Test**: Can be tested by launching the game and verifying
a single health percentage bar is displayed instead of three separate
bars, and that the creature's mood changes based on the health
percentage.

**Acceptance Scenarios**:

1. **Given** a new game starts, **When** the player views their
   creature, **Then** a single health meter is displayed showing 100%
   (instead of three separate hunger/happiness/energy bars).
2. **Given** the creature's health is at 75%, **When** the player
   views the creature, **Then** the health meter shows 75% and the
   creature displays a mood appropriate to that level.
3. **Given** the creature's health drops below 25%, **When** the
   player views the creature, **Then** the creature shows a distressed
   mood and the health bar is visually urgent (e.g., red color).

---

### User Story 2 - Earn and Spend Points (Priority: P1)

The three action buttons (Feed, Play, Sleep) are replaced by a point
system. The player has a pool of points that increases over time.
Each action (Feed, Play, Sleep) costs a certain number of points and
restores a portion of the creature's health. The player must decide
how to spend their limited points — creating a simple resource
management game.

**Why this priority**: Co-equal with US1 — the point system is what
makes the new mechanic interactive. Without it, the health bar is
just a countdown.

**Independent Test**: Can be tested by verifying the player has a
visible point balance, that points accumulate over time, and that
clicking an action deducts points and increases health.

**Acceptance Scenarios**:

1. **Given** the player has 10 points and health is at 50%, **When**
   the player clicks "Feed" (costs 5 points), **Then** the point
   balance decreases to 5 and health increases by the feed amount.
2. **Given** the player has 0 points, **When** the player tries to
   click any action, **Then** the button appears disabled and a
   message indicates not enough points.
3. **Given** the game is running, **When** time passes, **Then** the
   player's point balance increases at a steady rate (earning points
   passively).
4. **Given** the player has points available, **When** the player
   views the game screen, **Then** the current point balance is
   clearly displayed alongside the health meter.

---

### User Story 3 - Health Decays Over Time (Priority: P2)

The creature's health percentage decreases gradually over time (like
the old stat decay), creating urgency for the player to spend points
on care actions. The decay rate is gentle and kid-friendly.

**Why this priority**: The decay mechanic already exists for the old
three-stat system. This story adapts it to the single health meter.
Important for the game loop but the game is playable without it
during testing.

**Independent Test**: Can be tested by leaving the game idle and
observing the health percentage decrease over time.

**Acceptance Scenarios**:

1. **Given** a creature at 100% health, **When** time passes without
   any actions, **Then** health gradually decreases.
2. **Given** a creature at 0% health, **When** more time passes,
   **Then** health stays at 0% and the creature enters a "needs help"
   state (never dies).
3. **Given** a creature at 0% health, **When** the player spends
   points on an action, **Then** health increases and the creature
   recovers.

---

### Edge Cases

- What happens when health reaches exactly 0%? The creature enters
  a distressed "needs help" state but never dies or disappears.
  Always recoverable.
- What happens when the player earns points but health is at 100%?
  Points still accumulate — they can be saved for later.
- What happens when the player spends points and health would exceed
  100%? Health caps at 100%.
- What if the player rapidly clicks multiple actions? Each click
  deducts points and adds health independently, provided the player
  has enough points.
- What if the player has fractional points from passive earning?
  Points are displayed as whole numbers (floored for display, precise
  internally).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST display a single health meter as a
  percentage (0-100%) replacing the three separate stat bars
  (hunger, happiness, energy).
- **FR-002**: The creature's mood (happy, neutral, sad, distressed)
  MUST be derived from the health percentage:
  - Happy: health >= 60%
  - Neutral: health 30-59%
  - Sad: health 10-29%
  - Distressed: health < 10%
- **FR-003**: The player MUST have a visible point balance displayed
  on the game screen.
- **FR-004**: Points MUST accumulate passively over time at a rate
  of 1 point per 5 seconds while the game is active.
- **FR-005**: The game MUST provide three actions (Feed, Play, Sleep)
  that each cost a specific number of points:
  - Feed: costs 5 points, restores 15% health
  - Play: costs 3 points, restores 10% health
  - Sleep: costs 8 points, restores 25% health
- **FR-006**: Action buttons MUST be disabled when the player does
  not have enough points to afford the action.
- **FR-007**: Health MUST decrease over time at a rate of 2% per
  10 seconds while the game is active.
- **FR-008**: Health MUST be clamped between 0% and 100%.
- **FR-009**: Points MUST NOT go below 0.
- **FR-010**: The player MUST start each game session with 10 points
  and 100% health.
- **FR-011**: The creature MUST NOT die or disappear when health
  reaches 0% — it MUST always be recoverable when the player spends
  points.
- **FR-012**: All visuals and interactions MUST remain age-appropriate
  for children (Constitution Principle III).

### Key Entities

- **Health**: A single percentage value (0-100) representing the
  creature's overall wellbeing. Replaces the three separate stats.
  Decreases over time, increases when the player spends points on
  actions.
- **Points**: A numeric balance the player accumulates over time
  and spends on care actions. Starts at 10, earns passively,
  spent by clicking Feed/Play/Sleep.
- **Action**: A care interaction (Feed, Play, Sleep) with a point
  cost and a health restoration amount.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can understand the new health meter and point
  system within 30 seconds of seeing it — one bar, one number,
  three buttons.
- **SC-002**: A new player can successfully spend points to restore
  health without instructions within 1 minute of starting.
- **SC-003**: The point earn rate and health decay rate create an
  engaging balance where the player must check in at least 3 times
  in a 10-minute session to keep the creature healthy.
- **SC-004**: No child tester reports confusion about having "too
  many bars" — the single health meter is simpler than three
  separate stats.
- **SC-005**: The point cost vs. health restoration tradeoff
  (Feed vs. Play vs. Sleep) creates meaningful choices — players
  develop preferences for different actions.

## Assumptions

- This feature replaces the existing three-stat system (hunger,
  happiness, energy) entirely. The old stats are removed.
- The existing creature type selection and naming from feature 002
  is preserved — creature type is still cosmetic only.
- Points are session-only (no persistence between sessions).
- The passive point earn rate (1 per 5 seconds) and health decay
  rate (2% per 10 seconds) may need tuning through playtesting.
  These values are starting points.
- The three action names (Feed, Play, Sleep) are kept for familiarity
  even though they now map to point costs rather than individual stats.
- The creature's mood thresholds remain the same as the original
  (mapped from the old hunger stat thresholds to the new health
  percentage).
