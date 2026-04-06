# Feature Specification: Creature Customization

**Feature Branch**: `002-creature-customization`
**Created**: 2026-04-02
**Status**: Draft
**Input**: User description: "I want to customize the creature (Bird, Turtle, Cat, Dog)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Choose Your Creature (Priority: P1)

When a player starts Terragucci for the first time, they are presented
with a selection screen showing four creature types: Bird, Turtle, Cat,
and Dog. Each creature is displayed with its unique visual appearance
and name. The player taps or clicks their preferred creature to select
it, and the game begins with that creature as their pet.

**Why this priority**: Without the ability to choose a creature type,
there is no customization. This is the core of the feature.

**Independent Test**: Can be tested by launching the game fresh and
verifying the selection screen appears with all four creature types,
each visually distinct, and that selecting one starts the game with
that creature.

**Acceptance Scenarios**:

1. **Given** a new player opens the game, **When** the game loads,
   **Then** a creature selection screen appears showing Bird, Turtle,
   Cat, and Dog as distinct visual options.
2. **Given** the selection screen is displayed, **When** the player
   selects "Cat", **Then** the game starts with a cat creature that
   has a unique cat appearance and all stats at maximum.
3. **Given** the selection screen is displayed, **When** the player
   hovers over or focuses on a creature, **Then** the creature is
   visually highlighted to indicate it can be selected.

---

### User Story 2 - Each Creature Looks Different (Priority: P1)

Each of the four creature types has a unique visual identity throughout
the game. The Bird, Turtle, Cat, and Dog each display differently in
all mood states (happy, neutral, sad, distressed). When the player
interacts with their creature (feed, play, sleep), the creature's
reactions are visually consistent with its type.

**Why this priority**: Co-equal with US1 — choosing a creature is
meaningless if they all look the same. Visual distinction is what
makes the choice matter.

**Independent Test**: Can be tested by selecting each creature type
in turn and verifying that each has distinct visuals across all four
mood states.

**Acceptance Scenarios**:

1. **Given** a player has selected "Bird", **When** the creature is
   in happy mood, **Then** the bird displays a unique happy bird
   appearance distinct from happy cat/dog/turtle.
2. **Given** a player has selected "Dog", **When** the creature's
   mood changes from happy to sad, **Then** the dog's appearance
   changes to a sad dog visual (not a generic sad face).
3. **Given** any creature type, **When** the creature is in
   distressed state, **Then** its distressed appearance is type-
   specific but remains kid-friendly and not scary.

---

### User Story 3 - Name Your Creature (Priority: P2)

After selecting a creature type, the player can give their creature
a custom name. A text field appears with a suggested default name
based on the creature type (e.g., "Tweety" for Bird, "Shelly" for
Turtle). The player can keep the default or type their own name.
The name appears throughout the game wherever the creature's name
is displayed.

**Why this priority**: Naming adds personal attachment but the game
is fully playable without it. Nice-to-have on top of the core
selection mechanic.

**Independent Test**: Can be tested by selecting a creature, changing
its name, and verifying the custom name appears on the main game
screen.

**Acceptance Scenarios**:

1. **Given** the player has selected a creature type, **When** the
   naming step appears, **Then** a text input is shown pre-filled
   with a default name for that creature type.
2. **Given** the naming step is shown, **When** the player types a
   custom name "Biscuit" and confirms, **Then** the game starts and
   "Biscuit" is displayed as the creature's name.
3. **Given** the naming step is shown, **When** the player leaves
   the default name and confirms, **Then** the game starts with the
   default name displayed.
4. **Given** the naming step is shown, **When** the player tries to
   submit an empty name, **Then** the game does not proceed and
   indicates a name is required.

---

### Edge Cases

- What happens if the player resizes the browser during the selection
  screen? The selection grid adapts responsively so all four creatures
  remain visible and selectable.
- What if the player rapidly clicks multiple creatures on the
  selection screen? Only the first selection registers; subsequent
  clicks are ignored until the transition completes.
- What if the player enters a very long name (50+ characters)? The
  name is capped at 20 characters with visual feedback showing the
  limit.
- What if the player enters special characters or emoji in the name?
  All printable characters are allowed; the display handles them
  gracefully.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST display a creature selection screen before
  the main game on first launch.
- **FR-002**: The selection screen MUST present exactly four creature
  types: Bird, Turtle, Cat, and Dog.
- **FR-003**: Each creature type MUST have a unique visual appearance
  on the selection screen that clearly differentiates it from the
  others.
- **FR-004**: The player MUST be able to select one creature type by
  clicking or tapping on it.
- **FR-005**: After selection, the game MUST start with the chosen
  creature type and all stats at maximum.
- **FR-006**: Each creature type MUST have unique visuals for all
  four mood states (happy, neutral, sad, distressed).
- **FR-007**: Creature type-specific visuals MUST be consistent
  throughout all game interactions (feed, play, sleep reactions).
- **FR-008**: After selecting a creature type, the player MUST be
  presented with a naming step showing a default name for that type.
- **FR-009**: The player MUST be able to change the creature's name
  via a text input field.
- **FR-010**: Creature names MUST be between 1 and 20 characters.
- **FR-011**: The selected creature type and name MUST be used
  throughout the game session.
- **FR-012**: All creature visuals and names MUST be age-appropriate
  for children (Constitution Principle III).

### Key Entities

- **CreatureType**: One of four types (Bird, Turtle, Cat, Dog).
  Each type has a unique set of visual assets for all mood states
  and a default name.
- **CreatureSelection**: The player's choice of creature type and
  custom name, made before the game begins.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new player can identify all four creature types on
  the selection screen within 3 seconds of viewing.
- **SC-002**: Players can complete the creature selection and naming
  flow in under 30 seconds.
- **SC-003**: Each creature type is visually distinct enough that a
  player can identify their creature's type from the game screen
  alone without seeing a label.
- **SC-004**: 100% of mood-state visuals are type-specific — no
  generic/shared mood visuals across creature types.
- **SC-005**: The naming input provides clear feedback (character
  count, validation) so 95% of players successfully name their
  creature on the first attempt.

## Assumptions

- This feature builds on the existing virtual pet creature from
  feature 001. The creature display, stats, and interactions already
  exist.
- The selection screen replaces the current auto-start behavior (the
  game currently creates a creature named "Gucci" immediately).
- Creature type only affects visuals and default name — it does NOT
  affect stat mechanics (decay rates, action effects). All creature
  types play identically.
- The selection is made once per game session. There is no way to
  change creature type mid-session (that would be a separate feature).
- Persistence of the creature selection between sessions is out of
  scope (depends on save/load feature).
- Default names by type: Bird = "Tweety", Turtle = "Shelly",
  Cat = "Whiskers", Dog = "Buddy".
