# Feature Specification: Virtual Pet Creature

**Feature Branch**: `001-virtual-pet-creature`
**Created**: 2026-04-02
**Status**: Draft
**Input**: User description: "Core virtual pet creature with hunger, happiness, energy states and basic interactions (feed, play, sleep)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Meet Your New Pet (Priority: P1)

A player opens Terragucci for the first time and is greeted by their
new virtual pet creature. The creature appears on screen with a name,
a visual representation showing its current mood, and visible status
indicators for hunger, happiness, and energy. The player can see at a
glance how their pet is feeling and what it needs.

**Why this priority**: Without a visible creature with readable state,
there is no game. This is the absolute foundation.

**Independent Test**: Can be fully tested by launching the game and
verifying a creature appears with visible hunger, happiness, and energy
indicators that reflect its current state.

**Acceptance Scenarios**:

1. **Given** a player opens the game for the first time, **When** the
   game loads, **Then** a new creature appears with a name, a happy
   visual state, and hunger/happiness/energy indicators all at maximum.
2. **Given** a creature exists with low hunger, **When** the player
   views the creature, **Then** the creature's visual appearance and
   hunger indicator clearly communicate that the pet is hungry.
3. **Given** a creature exists, **When** the player views the creature,
   **Then** all three status indicators (hunger, happiness, energy) are
   displayed using playful visuals (not raw numbers).

---

### User Story 2 - Care For Your Pet (Priority: P1)

A player interacts with their creature through three core actions:
feeding (restores hunger), playing (restores happiness), and putting
the pet to sleep (restores energy). Each action triggers an immediate
visual and/or audio response from the creature, making the interaction
feel rewarding.

**Why this priority**: Interactions are the core gameplay loop. Without
them, the creature is just a static image. Co-equal with US1 as both
are needed for an MVP.

**Independent Test**: Can be tested by performing each action (feed,
play, sleep) and verifying the corresponding stat increases and the
creature visually reacts.

**Acceptance Scenarios**:

1. **Given** a creature with low hunger, **When** the player feeds the
   pet, **Then** the hunger indicator increases and the creature shows
   a happy eating animation/reaction.
2. **Given** a creature with low happiness, **When** the player plays
   with the pet, **Then** the happiness indicator increases and the
   creature shows an excited/playful reaction.
3. **Given** a creature with low energy, **When** the player puts the
   pet to sleep, **Then** the energy indicator increases and the
   creature shows a sleeping state.
4. **Given** a creature with maximum hunger (fully fed), **When** the
   player tries to feed the pet, **Then** the creature reacts
   (e.g., turns away) and hunger does not exceed maximum.

---

### User Story 3 - Pet Needs Change Over Time (Priority: P2)

While the player is engaged with the game, the creature's stats
gradually decrease over time — it gets hungrier, less happy, and more
tired. This creates urgency and a reason to keep interacting. The
rate of decline is gentle enough to be fun, not stressful.

**Why this priority**: Time-based state decay is what turns static
interactions into a game loop. Important but not needed for the very
first playable demo.

**Independent Test**: Can be tested by observing the creature over a
period of time without interaction, verifying stats decrease gradually
and visual state updates accordingly.

**Acceptance Scenarios**:

1. **Given** a creature at full stats, **When** time passes without
   interaction, **Then** hunger, happiness, and energy gradually
   decrease at a kid-friendly pace.
2. **Given** a creature whose hunger has reached zero, **When** the
   player views the creature, **Then** the creature displays a
   visibly sad/distressed state communicating urgent need.
3. **Given** a creature with all stats at zero, **When** more time
   passes, **Then** the creature enters a "needs help" state but
   does NOT die or disappear (kid-friendly — the pet always recovers
   when cared for).

---

### Edge Cases

- What happens when the player performs an action while the creature
  is already at max for that stat? The action is acknowledged but
  has no additional effect; creature reacts playfully.
- What happens if the player leaves the game running but idle for an
  extended period? Stats floor at zero; the creature enters a "needs
  help" state but is always recoverable.
- What happens if two actions are triggered simultaneously? Only one
  action processes at a time; the second is queued or ignored with
  visual feedback.
- How does the creature behave when all three stats are critically
  low? The creature shows a combined distressed state that clearly
  communicates "take care of me" without being scary or upsetting.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST create a new creature with a default name
  and all stats (hunger, happiness, energy) at maximum on first launch.
- **FR-002**: The creature MUST have three core stats: hunger,
  happiness, and energy, each represented as a value between 0
  (empty) and 100 (full).
- **FR-003**: The player MUST be able to feed the creature, increasing
  the hunger stat by a fixed amount (capped at maximum).
- **FR-004**: The player MUST be able to play with the creature,
  increasing the happiness stat by a fixed amount (capped at maximum).
- **FR-005**: The player MUST be able to put the creature to sleep,
  increasing the energy stat by a fixed amount (capped at maximum).
- **FR-006**: Each interaction (feed, play, sleep) MUST produce an
  immediate visual response from the creature within 200ms.
- **FR-007**: The creature's visual appearance MUST change to reflect
  its current stat levels (happy, neutral, sad, distressed).
- **FR-008**: Stats MUST decrease gradually over time while the game
  is active, at a rate that feels gentle and age-appropriate.
- **FR-009**: Stats MUST NOT drop below zero.
- **FR-010**: The creature MUST NOT die, disappear, or be permanently
  harmed when stats reach zero — it MUST always be recoverable.
- **FR-011**: All creature visuals and interactions MUST be
  age-appropriate for children.

### Key Entities

- **Creature**: The virtual pet. Has a name, three core stats
  (hunger, happiness, energy), and a visual state derived from
  stat levels. Central entity of the game.
- **Stat**: A numeric attribute of the creature (hunger, happiness,
  or energy) with a value between 0-100. Decreases over time,
  increases through player actions.
- **Action**: A player-initiated interaction (feed, play, sleep)
  that targets a specific stat and triggers a creature reaction.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can identify their creature's emotional state
  (happy, neutral, sad, distressed) from visuals alone within
  2 seconds of viewing.
- **SC-002**: Every player action (feed, play, sleep) produces
  visible creature feedback within 200ms.
- **SC-003**: A new player can successfully perform all three
  core interactions (feed, play, sleep) without any tutorial or
  instructions within 1 minute of starting the game.
- **SC-004**: The creature's state changes are noticeable but not
  alarming — no child tester reports feeling stressed or upset by
  the creature's declining state.
- **SC-005**: The game maintains an engaging loop where a player
  checks in on their creature at least 3 times in a 10-minute
  play session.

## Assumptions

- Target audience is children ages 6-12.
- The game runs as a single-player, local experience (no network
  features in this initial feature).
- Creature persistence between sessions (save/load) is out of scope
  for this feature and will be a separate specification.
- A single creature type is sufficient for v1; multiple species or
  evolution mechanics are future work.
- Sound/audio feedback is desirable but not required for MVP;
  visual feedback alone is sufficient.
- The game will run on a single platform to be determined during
  planning (not a specification concern).
