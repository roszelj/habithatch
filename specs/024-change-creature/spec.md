# Feature Specification: Change Creature

**Feature Branch**: `024-change-creature`
**Created**: 2026-04-07
**Status**: Draft
**Input**: User description: "add the ability for the kid to change their creature"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Kid Changes Creature Type (Priority: P1)

A kid who has been playing for a while decides they want a different creature. From within the game, they open a creature-change screen, browse all available creature types, pick a new one, and their virtual pet immediately updates — while all their progress (points, coins, health, chores, items) is fully preserved.

**Why this priority**: Core of the feature. Changing creature type is the primary user need and the minimum viable delivery.

**Independent Test**: Open the game as a kid, trigger the creature-change screen, select a different creature type → verify the pet view shows the new creature, all points/coins/chores remain unchanged, and the change persists after navigating away and back.

**Acceptance Scenarios**:

1. **Given** a kid is on the main pet screen, **When** they tap the "Change Creature" button, **Then** a picker screen appears showing all available creature types.
2. **Given** the creature picker is open, **When** the kid selects a new creature type, **Then** the pet view updates immediately to show the new creature.
3. **Given** the kid has changed their creature, **When** they check their points, coins, chores, outfits, and habitat, **Then** all progress is exactly as it was before the change.
4. **Given** the kid has changed their creature, **When** they leave and return to the game, **Then** the new creature type is shown (change persists).

---

### User Story 2 - Kid Also Changes Creature Name (Priority: P2)

After picking a new creature type, the kid can also give their creature a new name. The name field is pre-filled with the current name so the kid can choose to keep it or replace it.

**Why this priority**: Renaming adds personal expression but the feature is fully usable with just creature type change (US1). This is an incremental enhancement.

**Independent Test**: Open the creature-change screen, change the name to something new, confirm → verify the new name appears throughout the game (pet view title, parent panel).

**Acceptance Scenarios**:

1. **Given** the creature picker is open, **When** the kid views it, **Then** the current creature name is shown in an editable field pre-filled with the existing name.
2. **Given** the kid types a new name and confirms, **Then** the new name appears in the pet view and parent panel.
3. **Given** the kid clears the name field and tries to confirm, **Then** the confirm button is disabled (name is required).
4. **Given** the kid types a name that is too long, **Then** the input limits them to the same maximum length as initial setup.

---

### Edge Cases

- What if the kid selects the same creature type they already have? The change is accepted silently (name may still be updated).
- What if the kid dismisses the picker without confirming? No changes are made to type or name.
- What if the picker is opened while a creature animation is playing? The change takes effect immediately on confirmation regardless.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Kids MUST be able to access a creature-change screen from the main pet view without a parent PIN.
- **FR-002**: The creature-change screen MUST display all available creature types as selectable options with a visual preview.
- **FR-003**: The currently equipped creature type MUST be visually highlighted in the picker.
- **FR-004**: Confirming the change MUST update the kid's profile with the new creature type and persist it.
- **FR-005**: Changing the creature type MUST NOT alter the kid's points, coins, health, chores, streak, outfits, accessories, or habitat.
- **FR-006**: The creature-change screen MUST include an editable name field pre-filled with the current creature name.
- **FR-007**: The name field MUST enforce a minimum length of 1 character and the same maximum length used during initial profile creation.
- **FR-008**: The confirm action MUST be disabled when the name field is empty.
- **FR-009**: Dismissing the picker without confirming MUST leave the profile unchanged.

### Key Entities

- **ChildProfile**: Gains an updated `creatureType` and `creatureName` upon confirmation. All other fields (points, coins, health, chores, outfits, accessories, habitat, streak) are untouched.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A kid can open the creature picker, choose a new creature, confirm, and return to the pet view in under 30 seconds.
- **SC-002**: 100% of prior progress (points, coins, chores, outfits, habitat) is preserved after changing creature type.
- **SC-003**: The change persists across sessions — the new creature is shown after the app is closed and reopened.
- **SC-004**: The creature-change entry point is discoverable without instructions (visible button in the pet view).

## Assumptions

- Changing a creature is a kid-facing action — no parent PIN is required, as the change is purely cosmetic.
- All creature types available at initial setup are also available for change (no unlock requirement).
- The creature name can be changed at the same time as the type via a single confirm action.
- Outfits and accessories carry over to the new creature unchanged.
- The feature is accessed from the main pet view (not from the Store or a separate settings menu).
- The picker reuses the existing creature selection UI style from initial profile creation.
