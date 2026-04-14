# Feature Specification: Kid Join Profile Selection

**Feature Branch**: `018-kid-join-profile`
**Created**: 2026-04-07
**Status**: Draft
**Input**: User description: "in the sign of flow for a kid, I need the profile page for the family to be shown to the kid after they enter the join code"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Kid Selects Existing Profile After Joining (Priority: P1)

A child enters a valid family join code and is taken to the family's profile selection screen ("Who's playing?"), where they can tap their existing creature profile and start playing immediately.

**Why this priority**: This is the core of the feature — kids currently skip the profile picker entirely and land on creature creation, meaning returning kids cannot select their already-created profile.

**Independent Test**: Can be fully tested by having a family with at least one existing profile, entering the join code as a kid, and verifying the profile picker appears instead of creature creation.

**Acceptance Scenarios**:

1. **Given** a family has one or more existing child profiles, **When** a kid successfully enters the correct join code, **Then** the "Who's playing?" profile picker screen is displayed showing all existing profiles.
2. **Given** the profile picker is shown after join code entry, **When** the kid taps their profile, **Then** they are taken directly to the game with that profile active.

---

### User Story 2 - Kid Creates New Profile After Joining (Priority: P2)

A child enters a valid family join code and, on the profile selection screen, taps "Add Child" to create a brand-new profile with a new creature.

**Why this priority**: A new kid joining a family still needs a path to create their first profile; the profile picker must offer this option when the family has room for more profiles.

**Independent Test**: Can be fully tested by entering a join code for a family with fewer than the maximum number of profiles, and verifying the "Add Child" option appears and leads to creature creation.

**Acceptance Scenarios**:

1. **Given** a family has room for additional profiles, **When** the kid views the profile picker after entering the join code, **Then** an "Add Child" option is visible.
2. **Given** the kid taps "Add Child", **When** they complete creature selection and naming, **Then** their new profile is saved and they enter the game.

---

### User Story 3 - Kid Joins Empty Family (Priority: P3)

A child enters a valid join code for a family that has no existing profiles yet, and is taken directly to creature creation to set up the first profile.

**Why this priority**: Edge case — a new family with no kids yet. The profile picker would be empty and non-useful, so the kid should skip straight to creation.

**Independent Test**: Can be fully tested by entering a join code for a brand-new family with zero profiles and verifying the creature selection screen is shown.

**Acceptance Scenarios**:

1. **Given** a family has zero existing child profiles, **When** a kid enters the join code, **Then** they are taken directly to creature selection (not an empty profile picker).

---

### Edge Cases

- What happens when the join code is invalid or expired? The existing error message is shown and the kid stays on the join code screen.
- What happens when the family is at max profile capacity? The profile picker shows all profiles but no "Add Child" option.
- What happens if family profiles haven't loaded from the cloud yet when the kid joins? A loading state is shown until profiles are available before routing to the picker.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the family profile picker immediately after a kid successfully enters a valid join code, when the family has one or more existing profiles.
- **FR-002**: System MUST display the creature creation flow immediately after a kid enters a valid join code, when the family has zero existing profiles.
- **FR-003**: The profile picker shown to the kid after joining MUST display all existing child profiles for the family.
- **FR-004**: The profile picker MUST include an option to create a new profile when the family has fewer than the maximum allowed profiles.
- **FR-005**: System MUST allow the kid to select an existing profile from the picker and enter the game with that profile.
- **FR-006**: System MUST allow the kid to start new profile creation from the picker and complete it successfully.

### Key Entities

- **ChildProfile**: An individual kid's game profile (creature type, name, progress). Multiple may exist per family.
- **Family**: The parent's account grouping — contains all child profiles, identified by a unique family ID.
- **Join Code**: A short alphanumeric code the parent shares with the kid to link them to the family.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A kid with an existing profile can go from entering the join code to actively playing in under 30 seconds.
- **SC-002**: 100% of kids joining a family with existing profiles see the profile picker as the immediate next screen after a successful join code.
- **SC-003**: 100% of kids joining a family with zero profiles see creature creation as the immediate next screen (no regression on empty-family path).
- **SC-004**: All existing profiles for the family are visible on the picker without any additional navigation steps.

## Assumptions

- The family's profiles are loaded from the cloud once the kid's session is linked to the family; a brief loading state while profiles load is acceptable.
- The maximum number of profiles per family is governed by an existing system constant and does not change as part of this feature.
- Join code validation logic and error handling are unchanged — only the routing after a *successful* join is modified.
- The kid continues to be signed in anonymously after a successful join code entry (existing behavior preserved).
- "Profile page for the family" refers to the existing profile picker ("Who's playing?") screen.
