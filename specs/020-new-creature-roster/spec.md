# Feature Specification: New Creature Roster

**Feature Branch**: `020-new-creature-roster`
**Created**: 2026-04-07
**Status**: Draft
**Input**: User description: "replace the current creatures with the 2 files each containing 9 new creatures in the following folder /creature-charactors"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Kid Picks a New Creature When Starting (Priority: P1)

A child opening the app for the first time (or creating a new profile) sees 18 charming illustrated creatures to choose from instead of the previous 4. They scroll or browse through all options and tap the one they love most.

**Why this priority**: This is the first and most exciting thing a new player experiences. Expanding from 4 to 18 creatures dramatically increases variety and gives every kid a creature that feels uniquely theirs.

**Independent Test**: Open the creature selection screen and verify 18 illustrated creatures are displayed, each with a name and visible image. Tapping one advances to the naming step.

**Acceptance Scenarios**:

1. **Given** a player is on the creature selection screen, **When** they view the roster, **Then** 18 distinct illustrated creatures are displayed — 9 from Pack 1 and 9 from Pack 2.
2. **Given** a player taps any of the 18 creatures, **When** they proceed, **Then** their chosen creature appears throughout the game using its illustrated image.
3. **Given** a player is choosing a creature, **When** they view the selection screen, **Then** each creature has a clear label/name so players can identify them.

---

### User Story 2 - Creature Appears Correctly in the Game (Priority: P2)

After choosing a new creature, the child sees their illustrated creature displayed in the main game screen — looking adorable and appropriate for the creature's current mood/health state.

**Why this priority**: The creature must look great and feel alive in the game context, not just in the selection screen. Visual quality in-game directly affects how engaged kids remain.

**Independent Test**: Select any of the 18 new creatures, enter the game, and verify the creature's illustration is displayed correctly and responds visually to health/mood changes.

**Acceptance Scenarios**:

1. **Given** a player selected an illustrated creature, **When** they are in the main game, **Then** the creature's image is displayed prominently and clearly.
2. **Given** a creature's health changes (happy, neutral, sad, distressed), **When** the player views the game screen, **Then** the creature's visual state reflects the mood appropriately.

---

### User Story 3 - Profile Picker Shows Correct Creature (Priority: P3)

On the "Who's playing?" screen, each child's profile card shows their chosen new creature illustration so they can easily identify which profile is theirs.

**Why this priority**: The profile picker uses creature images as profile identifiers. If the creature images don't render there, kids won't know which card to tap.

**Independent Test**: Create a profile with a new creature, return to the profile picker, and verify the correct creature illustration appears on that profile's card.

**Acceptance Scenarios**:

1. **Given** a child has a profile with one of the 18 new creatures, **When** the profile picker is shown, **Then** their creature's illustration appears on their profile card alongside their creature's name.

---

### Edge Cases

- What happens to existing profiles that were created with the old creatures (bird, turtle, cat, dog)? They should be migrated to the closest matching new creature, or default to a specified fallback, so no profile is broken.
- What happens if a creature image fails to load? A placeholder or fallback image is shown rather than a blank space.
- What if the creature selection screen has too many options to display at once? The layout must scroll or paginate to show all 18 without clipping.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST replace all 4 current creature types (bird, turtle, cat, dog) with the 18 new illustrated creatures from the two provided packs.
- **FR-002**: The creature selection screen MUST display all 18 new creatures as selectable options with their names and images.
- **FR-003**: Each of the 18 new creatures MUST have a distinct name that is age-appropriate and memorable for kids.
- **FR-004**: The selected creature's illustration MUST appear on the main game screen, the profile picker card, and any other location where the creature is currently displayed.
- **FR-005**: Creature mood/health states (happy, neutral, sad, distressed) MUST continue to be visually communicated when using the new creatures.
- **FR-006**: Existing player profiles created with old creature types MUST be automatically migrated so they continue to work with a valid new creature type — no profile must be left in a broken state.

### Key Entities

- **Creature**: One of the 18 new illustrated characters — defined by a unique type identifier, display name, and image asset. Replaces the previous 4 emoji-based creature types.
- **Pack 1** (9 creatures): Corgi, Fluffy Dog, Husky, Panda, Chick, Cat, Tiger, Monkey, and one additional creature from the first illustration sheet.
- **Pack 2** (9 creatures): Sloth, Dragon, Snake, Gecko, Cockatoo, Fish, Giraffe, Elephant, Snow Leopard.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 18 new creatures are visible and selectable on the creature selection screen — 0 creatures missing.
- **SC-002**: 100% of existing player profiles continue to load and play without errors after the creature roster is replaced.
- **SC-003**: Each new creature renders correctly in the game screen, profile picker, and selection screen — 0 broken image slots.
- **SC-004**: The creature selection screen remains navigable with 18 options — players can view and tap any creature within 5 seconds of entering the screen.

## Assumptions

- The 18 creatures from the two provided PNG packs are the definitive new roster; no additional creatures are added or kept from the old set.
- Each creature has a single "happy" illustration that serves as its primary visual; mood differences (sad, distressed) are expressed through visual effects, overlays, or animations rather than separate mood-specific images for each creature.
- Creature names are assigned by the development team based on each creature's appearance; the exact names are not specified in this feature and will be finalized during implementation.
- Existing profiles with old creature types (bird, turtle, cat, dog) will be automatically reassigned to a reasonable default new creature type (e.g., cat → Husky or Tiger, bird → Chick or Cockatoo) to preserve playability.
- The two PNG files (`creature-happy-pack1.png`, `creature-happy-pack2.png`) in `/creature-charactors` are the source assets for all 18 new creatures.
