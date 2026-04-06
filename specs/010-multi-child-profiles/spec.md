# Feature Specification: Multi-Child Profiles

**Feature Branch**: `010-multi-child-profiles`
**Created**: 2026-04-06
**Status**: Draft
**Input**: User description: "a parent may have 1 or more kids to administer"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Child Picker on Launch (Priority: P1)

When the app launches with multiple child profiles, a profile picker
appears showing each child's name and creature. The child taps their
name/avatar to enter their game. Each child has a completely separate
game state — their own creature, chores, points, streak, outfit, and
health. Siblings cannot see or affect each other's data.

**Why this priority**: Without a profile picker, only one child can
use the app. This is the foundation of multi-child support.

**Independent Test**: Can be tested by creating two profiles, logging
into each, and verifying they have independent game states.

**Acceptance Scenarios**:

1. **Given** two child profiles exist (Emma and Jake), **When** the
   app launches, **Then** a profile picker shows both names with
   their creature avatars.
2. **Given** Emma selects her profile, **When** the game loads,
   **Then** she sees her creature, chores, points, and streak —
   not Jake's.
3. **Given** Jake has 50% health and Emma has 80%, **When** each
   logs into their profile, **Then** they see their own health
   value.

---

### User Story 2 - Parent Creates Child Profiles (Priority: P1)

In Parent Mode, the parent can add new child profiles and remove
existing ones. Each new profile starts the full creature creation
flow (choose type → name → outfit → accessory). The parent can
manage profiles for all their children from one device.

**Why this priority**: Co-equal with US1 — the parent must be able
to create profiles before children can pick them.

**Independent Test**: Can be tested by entering Parent Mode, adding
a new child profile, and verifying it appears on the profile picker.

**Acceptance Scenarios**:

1. **Given** the parent is in Parent Mode, **When** they tap "Add
   Child", **Then** the creature creation flow starts for a new
   profile.
2. **Given** the parent completes creature creation for "Emma",
   **When** they return to the profile picker, **Then** Emma's
   profile appears with her creature.
3. **Given** two profiles exist, **When** the parent removes Jake's
   profile, **Then** Jake no longer appears on the profile picker
   and his data is deleted.

---

### User Story 3 - Parent Manages Each Child's Chores (Priority: P1)

In Parent Mode, the parent can switch between children to manage
each child's chore list independently. The parent selects which
child they want to administer, then sees that child's chores,
pending approvals, and stats. Chore lists are per-child — Emma's
morning chores can be different from Jake's.

**Why this priority**: Per-child chore management is the core
parent value proposition. Without it, all children would share the
same chore list.

**Independent Test**: Can be tested by setting up different chores
for two children and verifying each child sees only their own.

**Acceptance Scenarios**:

1. **Given** the parent is in Parent Mode with 2 children, **When**
   they view the admin panel, **Then** they see a child selector
   to pick which child to manage.
2. **Given** the parent selects Emma, **When** they add a chore
   "Practice piano", **Then** the chore appears only in Emma's
   game — not Jake's.
3. **Given** Emma has pending chores and Jake has none, **When** the
   parent selects Emma, **Then** the pending tab shows Emma's
   pending chores.

---

### User Story 4 - Switch Profiles (Priority: P2)

A child can switch to a different profile by going back to the
profile picker. A "Switch Profile" button is available on the game
screen. This allows siblings to take turns on the same device.

**Why this priority**: Convenient but not essential — children could
close and reopen the app to switch.

**Independent Test**: Can be tested by playing as Emma, tapping
"Switch Profile", and selecting Jake's profile.

**Acceptance Scenarios**:

1. **Given** Emma is playing, **When** she taps "Switch Profile",
   **Then** the profile picker appears showing all profiles.
2. **Given** Emma switches to Jake's profile, **When** Jake's game
   loads, **Then** Emma's game state is saved and Jake's state is
   loaded.

---

### Edge Cases

- What if only one child profile exists? The profile picker is
  skipped and the child goes directly to their game (same as
  current single-child behavior).
- What if the parent deletes the last child profile? The app
  returns to the first-time setup flow (creature creation).
- What about the existing single-child save data on upgrade? The
  existing save is automatically migrated into the first child
  profile.
- What if a child tries to access another child's profile? There
  is no lock per child — profiles are trust-based. Parent Mode is
  the only PIN-protected area.
- Maximum number of child profiles? Capped at 8 to keep the
  picker manageable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST support 1-8 child profiles on a single
  device.
- **FR-002**: Each child profile MUST have completely independent
  game state: creature (type, name, outfit, accessory), health,
  per-category points, chores, streak, and wardrobe.
- **FR-003**: When multiple profiles exist, the app MUST show a
  profile picker on launch before entering any game.
- **FR-004**: When only one profile exists, the app MUST skip the
  profile picker and go directly to that child's game.
- **FR-005**: In Parent Mode, the parent MUST be able to add new
  child profiles via a creature creation flow.
- **FR-006**: In Parent Mode, the parent MUST be able to remove
  child profiles (with confirmation).
- **FR-007**: In Parent Mode, the parent MUST be able to select
  which child to manage (chores, approvals, stats).
- **FR-008**: Chore lists MUST be per-child — each child has their
  own Morning/Afternoon/Evening chores.
- **FR-009**: Pending chore approvals MUST be per-child — the
  parent sees only the selected child's pending chores.
- **FR-010**: A "Switch Profile" option MUST be available from the
  game screen to return to the profile picker.
- **FR-011**: Switching profiles MUST save the current child's
  state before loading the next child's state.
- **FR-012**: Existing single-child save data MUST be automatically
  migrated into the first child profile on upgrade.
- **FR-013**: The parent PIN MUST be shared across all profiles —
  one PIN for the whole family.
- **FR-014**: All profile data MUST be stored locally only
  (Constitution Principle III).

### Key Entities

- **ChildProfile**: A complete game state for one child. Identified
  by a unique ID and a display name (the creature's name). Contains
  all per-child data: creature, health, points, chores, streak,
  outfit, accessory.
- **ProfileList**: The collection of all child profiles on the
  device, plus the shared parent PIN. Replaces the single SaveData
  as the top-level persistence structure.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A parent can create a second child profile and have
  both children playing independently within 2 minutes.
- **SC-002**: Children can identify and select their own profile
  from the picker within 3 seconds.
- **SC-003**: 100% of game state is isolated between profiles —
  no data leakage between siblings.
- **SC-004**: Existing single-child users experience zero disruption
  — their save data migrates seamlessly.
- **SC-005**: The parent can switch between managing different
  children in Parent Mode within 5 seconds.

## Assumptions

- This feature restructures the save data from a single SaveData
  object to a ProfileList containing multiple ChildProfile objects.
- All profiles share one device/browser and one parent PIN.
- Profiles are not password-protected individually — siblings
  can technically access each other's profiles. Only Parent Mode
  is PIN-gated.
- The creature creation flow (type → name → outfit → accessory)
  is reused when adding a new child profile.
- Profile names are derived from the creature name (e.g., "Emma's
  Whiskers"). The creature name is the display name on the picker.
- The daily chore reset and streak evaluation happen per-profile
  independently when that profile is loaded.
- Maximum 8 profiles keeps the UI manageable and localStorage
  within reasonable size limits.
