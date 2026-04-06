# Feature Specification: Time-Based Actions & Point Earning

**Feature Branch**: `004-time-actions-point-earning`
**Created**: 2026-04-02
**Status**: Draft
**Input**: User description: "action economy for action should be morning, afternoon, evening. Points are earning from a dynamic user inputed fields"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Time-of-Day Actions (Priority: P1)

The three care actions are redefined from Feed/Play/Sleep to Morning,
Afternoon, and Evening — representing times of day rather than
activity types. Each action costs points and restores health, but the
theming reflects a daily routine: Morning (wake up and start the day),
Afternoon (activity and play), Evening (wind down and rest). The
creature's reaction visuals match the time of day.

**Why this priority**: Redefining the action economy is the core
mechanic change. The game needs its three buttons before anything
else works.

**Independent Test**: Can be tested by launching the game and verifying
three buttons labeled Morning, Afternoon, and Evening appear, each
with a point cost, and that clicking one deducts points and restores
health.

**Acceptance Scenarios**:

1. **Given** the game is running, **When** the player views the
   action buttons, **Then** they see Morning, Afternoon, and Evening
   (not Feed, Play, Sleep) each showing its point cost.
2. **Given** the player has enough points, **When** they click
   "Morning", **Then** points are deducted, health increases, and the
   creature shows a morning-themed reaction (e.g., sunrise emoji).
3. **Given** the player has enough points, **When** they click
   "Evening", **Then** points are deducted, health increases by the
   evening amount, and the creature shows a sleepy/resting reaction.

---

### User Story 2 - Manage a Chore Checklist (Priority: P1)

The player (or a parent/guardian) can create a custom checklist of
chores or habits — things like "Brush teeth", "Do homework", "Walk
the dog", "Read for 15 minutes". These tasks appear in a checklist
view. When the player checks off a completed chore, they earn points.
The checklist is the primary way to earn points — turning the game
into a real-world habit tracker that rewards kids for completing tasks.

**Why this priority**: Co-equal with US1 — without a way to earn
points, the player cannot care for their creature. The chore
checklist is the core earning mechanic.

**Independent Test**: Can be tested by adding chores to the
checklist, checking one off, and verifying points are awarded.

**Acceptance Scenarios**:

1. **Given** the player opens the chore checklist, **When** no
   chores exist yet, **Then** an empty state is shown with a prompt
   to add their first chore.
2. **Given** the checklist view is open, **When** the player types
   a chore name and adds it, **Then** the chore appears in the
   checklist as an unchecked item.
3. **Given** a chore is in the checklist, **When** the player checks
   it off as completed, **Then** points are added to their balance
   and a reward animation/confirmation plays.
4. **Given** a chore has been checked off, **When** the player views
   the checklist, **Then** the completed chore is visually marked
   as done (strikethrough or checkmark).

---

### User Story 3 - Edit and Reset Chores (Priority: P2)

The player can manage their chore list — adding new chores, removing
chores they no longer need, and resetting completed chores for a new
day. This keeps the checklist fresh and relevant to the player's
actual daily routine.

**Why this priority**: Management features are important for
long-term use but the game works with a basic add-and-check-off
flow first.

**Independent Test**: Can be tested by adding, removing, and
resetting chores and verifying the list updates correctly.

**Acceptance Scenarios**:

1. **Given** a chore exists in the checklist, **When** the player
   removes it, **Then** it disappears from the list.
2. **Given** multiple chores are checked off, **When** the player
   taps "Reset All", **Then** all chores return to unchecked state
   (ready for a new day).
3. **Given** the player adds a new chore, **When** they view the
   checklist, **Then** the new chore appears at the bottom of the
   list, unchecked.

---

### Edge Cases

- What happens if the player tries to add a chore with a blank name?
  The add action is blocked; a message indicates a name is required.
- What happens if the player checks off the same chore twice? Once
  a chore is checked off, the checkbox is disabled until the chore
  is reset. Points are only awarded once per check-off.
- What happens if the player has max points and checks off more
  chores? Points continue to accumulate with a generous cap of 999.
- What if the player has points but health is at 100%? Actions are
  still available but health caps at 100%. Points are still spent.
- What if the player adds many chores (20+)? The checklist scrolls
  to accommodate all items.
- What if a chore name is very long? Names are capped at
  40 characters.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST display three action buttons labeled
  Morning, Afternoon, and Evening (replacing Feed, Play, Sleep).
- **FR-002**: Each action MUST have a defined point cost and health
  restoration amount:
  - Morning: costs 3 points, restores 10% health
  - Afternoon: costs 5 points, restores 15% health
  - Evening: costs 8 points, restores 25% health
- **FR-003**: Action buttons MUST be disabled when the player does
  not have enough points.
- **FR-004**: The game MUST provide a chore checklist accessible
  from the main game screen via a clearly labeled button.
- **FR-005**: The player MUST be able to add custom chores to the
  checklist by typing a name (1-40 characters).
- **FR-006**: The player MUST be able to check off a chore as
  completed, which awards 5 points per chore.
- **FR-007**: Completed chores MUST be visually distinguished from
  uncompleted chores (e.g., checkmark, strikethrough).
- **FR-008**: A completed chore MUST NOT be checkable again until
  the checklist is reset.
- **FR-009**: The player MUST be able to remove individual chores
  from the checklist.
- **FR-010**: The player MUST be able to reset all chores to
  unchecked state (for a new day).
- **FR-011**: The player's point balance MUST be clearly displayed
  on the game screen at all times.
- **FR-012**: Points MUST NOT go below 0 and MUST cap at 999.
- **FR-013**: The player MUST start each session with 5 points.
- **FR-014**: All chore text and visuals MUST be age-appropriate
  for children (Constitution Principle III).
- **FR-015**: Chore text MUST be stored locally only and MUST NOT
  be transmitted to any external service (Constitution Principle III).

### Key Entities

- **TimeAction**: One of three care actions (Morning, Afternoon,
  Evening) with a point cost and health restoration value. Replaces
  the old Feed/Play/Sleep actions.
- **Points**: The player's spendable currency. Earned by completing
  chores, spent on time actions. Range: 0-999.
- **Chore**: A user-created task with a name (1-40 chars) and a
  completion status (done/not done). Checking off a chore awards
  points. Can be added, removed, and reset.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players understand the Morning/Afternoon/Evening
  actions within 15 seconds — three buttons with clear labels and
  costs.
- **SC-002**: Players can add a chore, check it off, and spend
  the earned points within 1 minute of first opening the checklist.
- **SC-003**: The chore checklist creates a real-world connection —
  players use it as an actual habit tracker for daily tasks.
- **SC-004**: The earn-and-spend loop creates engagement where
  players check in at least 3 times per day to complete chores and
  care for their creature.
- **SC-005**: No child tester reports confusion about how to add
  chores, earn points, or spend them on creature care.

## Assumptions

- This feature builds on the health/point system from feature 003.
  The single health meter and point-based actions already exist.
- The three old action names (Feed, Play, Sleep) are fully replaced
  by Morning, Afternoon, and Evening.
- Point costs and health values are starting points for playtesting
  and may need tuning.
- Health still decays over time (from feature 003).
- Creature type selection and naming (from feature 002) are
  preserved unchanged.
- Chores are stored in browser memory for the session only.
  Persistence between sessions is out of scope (depends on future
  save/load feature).
- Parents may help younger children set up the initial chore list,
  but the check-off interaction is designed for the child.
- 5 points per chore is a starting value; all chores award the
  same amount (no variable rewards in v1).
