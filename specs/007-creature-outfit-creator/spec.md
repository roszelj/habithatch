# Feature Specification: Creature Outfit Creator

**Feature Branch**: `007-creature-outfit-creator`
**Created**: 2026-04-02
**Status**: Draft
**Input**: User description: "change creature creation to a more full size to pick different outfits and accessories"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Full-Size Creature Display (Priority: P1)

The creature is upgraded from a single emoji to a larger, composed
character made of layered visual parts (body, face expression, outfit
slot, accessory slot). The creature takes up more screen space and
feels more like a real character. The body is the base creature type
(Bird, Turtle, Cat, Dog), the face changes with mood, and outfit/
accessory slots are initially empty (default look).

**Why this priority**: The full-size creature display is the
foundation — outfits and accessories layer on top of this. Without
a composed character, there's nothing to dress up.

**Independent Test**: Can be tested by launching the game and
verifying the creature appears as a larger, multi-part character
(not a single emoji) with visible body, face, and empty outfit/
accessory areas.

**Acceptance Scenarios**:

1. **Given** a new game starts with a Cat creature, **When** the
   player views the main screen, **Then** the creature displays as
   a large composed character with a cat body and mood-appropriate
   face (not a single emoji).
2. **Given** a creature with no outfit selected, **When** the player
   views the creature, **Then** the creature displays its default
   appearance (body + face, no outfit or accessory).
3. **Given** the creature's mood changes, **When** the player views
   the creature, **Then** the face layer updates to match the mood
   while the body and outfit remain unchanged.

---

### User Story 2 - Choose Outfits During Creation (Priority: P1)

During the creature creation flow (after choosing type and name),
the player enters a dress-up screen where they can browse and select
an outfit for their creature. Outfits are full-body clothing items
like a superhero cape, pajamas, a party dress, a sports jersey, or
overalls. The player sees a preview of their creature wearing each
outfit before confirming. Each creature type has outfits that fit
its shape.

**Why this priority**: Co-equal with US1 — the outfit selection is
the core new interaction this feature adds.

**Independent Test**: Can be tested by going through creature
creation and verifying the outfit selection screen appears with
browsable options and a live preview.

**Acceptance Scenarios**:

1. **Given** the player has named their creature, **When** they
   proceed to the next step, **Then** an outfit selection screen
   appears showing available outfits with the creature wearing each
   one in preview.
2. **Given** the outfit screen is shown, **When** the player selects
   "Superhero Cape", **Then** the creature preview updates to show
   the cape outfit.
3. **Given** the outfit screen is shown, **When** the player selects
   "No Outfit", **Then** the creature preview shows the default
   bare look.
4. **Given** the player confirms their outfit choice, **When** the
   game starts, **Then** the creature appears on the main screen
   wearing the selected outfit.

---

### User Story 3 - Choose Accessories During Creation (Priority: P2)

In addition to outfits, the player can select an accessory — a
smaller item like sunglasses, a bow tie, a flower crown, a baseball
cap, or a scarf. Accessories layer on top of the outfit. The player
can choose one accessory or none.

**Why this priority**: Accessories add personality on top of outfits
but the game is fun with just outfits alone.

**Independent Test**: Can be tested by selecting an accessory during
creation and verifying it appears on the creature in-game.

**Acceptance Scenarios**:

1. **Given** the player has chosen an outfit, **When** they proceed
   to the accessory step, **Then** an accessory selection screen
   appears with available options.
2. **Given** the accessory screen is shown, **When** the player
   selects "Sunglasses", **Then** the creature preview updates to
   show sunglasses on top of the outfit.
3. **Given** the player selects "No Accessory", **Then** the
   creature appears with outfit only.
4. **Given** the player confirms their accessory, **When** the game
   starts, **Then** the creature displays with both the selected
   outfit and accessory.

---

### Edge Cases

- What if the player wants to change outfit/accessory after creation?
  A "Wardrobe" button on the game screen allows changing outfit and
  accessory at any time (no cost — purely cosmetic).
- What if the creature type changes visual proportions per mood?
  The outfit and accessory layers adjust with the body proportions.
- What if the player rapidly switches between outfits on the
  preview? Each selection instantly updates the preview.
- What about accessibility? Outfit/accessory names are displayed
  as text labels alongside the visuals.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The creature MUST be displayed as a composed, layered
  character larger than the previous single-emoji representation.
- **FR-002**: The creature's visual MUST be composed of layers:
  body (creature type), face (mood), outfit (selected or none),
  and accessory (selected or none).
- **FR-003**: The face layer MUST change to reflect the creature's
  current mood (happy, neutral, sad, distressed).
- **FR-004**: The body layer MUST be specific to the creature type
  (Bird, Turtle, Cat, Dog).
- **FR-005**: The creature creation flow MUST include an outfit
  selection step after naming.
- **FR-006**: At least 5 outfit options MUST be available per
  creature type, plus a "No Outfit" option.
- **FR-007**: Each outfit MUST show a live preview on the creature
  before the player confirms.
- **FR-008**: The creature creation flow MUST include an accessory
  selection step after outfit selection.
- **FR-009**: At least 5 accessory options MUST be available, plus
  a "No Accessory" option.
- **FR-010**: The selected outfit and accessory MUST appear on the
  creature throughout gameplay (main screen, all mood states).
- **FR-011**: A "Wardrobe" button MUST be accessible from the main
  game screen to change outfit and accessory at any time.
- **FR-012**: Outfit and accessory choices MUST be persisted with
  the save data.
- **FR-013**: All outfits and accessories MUST be age-appropriate
  for children (Constitution Principle III).
- **FR-014**: Outfits and accessories are cosmetic only — they MUST
  NOT affect gameplay mechanics (health, points, actions).

### Key Entities

- **CreatureAppearance**: The composed visual of a creature, made
  of layers: body (creature type), face (mood-driven), outfit
  (selected item or none), accessory (selected item or none).
- **Outfit**: A full-body clothing item for a creature. Has a name,
  visual representation per creature type, and is purely cosmetic.
- **Accessory**: A smaller item layered on top. Has a name, visual
  representation, and is purely cosmetic.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players spend at least 30 seconds on the outfit/
  accessory selection screen — indicating engagement with the
  dress-up mechanic.
- **SC-002**: 80% of players choose an outfit (not "No Outfit") —
  the options are appealing enough to pick one.
- **SC-003**: The creature's full-size display is visually richer
  than the emoji version — players identify it as a "character"
  rather than an "icon".
- **SC-004**: Players can complete the full creation flow (type +
  name + outfit + accessory) in under 2 minutes.
- **SC-005**: No child tester reports difficulty finding or using
  the Wardrobe button to change outfits later.

## Assumptions

- This feature replaces the single-emoji creature display with a
  composed layered character. The emoji sprites for moods are
  replaced by larger CSS/SVG/emoji-composed visuals.
- Since we're building with web tech and no image assets, outfits
  and accessories will be represented using composed emoji
  combinations, CSS shapes, or unicode characters layered together.
  The exact visual technique is an implementation decision.
- The creation flow expands from: type → name → play, to:
  type → name → outfit → accessory → play.
- All outfits are available from the start — no unlocking or
  purchasing mechanic (that would be a separate feature).
- Accessories are universal — they work with any creature type
  (not type-specific like outfits may be).
- The Wardrobe button is free to use — no point cost to change
  clothes (cosmetic only, Constitution Principle II: ship & iterate).
- Outfit and accessory selections are included in the save data
  alongside creature type, name, health, points, and chores.
