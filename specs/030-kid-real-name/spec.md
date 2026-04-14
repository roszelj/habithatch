# Feature Specification: Child Real Name

**Feature Branch**: `030-kid-real-name`
**Created**: 2026-04-10
**Status**: Draft
**Input**: User description: "add a way for the parent to differentiate the kids real name with their pets name as the kids have the ability to keep changing the name of their pet"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Parent Sets Child's Real Name (Priority: P1)

When a parent creates a new child profile, they are prompted to enter the child's real name in addition to choosing a creature and naming it. This real name is displayed alongside the creature name throughout the parent-facing areas of the app (parent panel, profile picker) so the parent always knows which child they are managing, regardless of what the kid renames their creature.

**Why this priority**: This is the core need — parents must be able to identify which child is which. Without this, parents can become confused when kids rename their creatures, especially in multi-child households.

**Independent Test**: Can be fully tested by creating a new child profile, entering a real name, then verifying the real name appears on the profile picker and parent panel.

**Acceptance Scenarios**:

1. **Given** a parent is creating a new child profile, **When** they reach the naming step, **Then** they are prompted to enter the child's real name before or alongside the creature name.
2. **Given** a child profile has a real name set, **When** the parent views the profile picker ("Who's playing?"), **Then** the child's real name is displayed on the profile card alongside or below the creature name.
3. **Given** a child profile has a real name set, **When** the parent opens the parent panel, **Then** the child selector and chore/bonus sections display the child's real name (with the creature name shown secondarily).

---

### User Story 2 - Parent Edits a Child's Real Name (Priority: P2)

A parent can update a child's real name from the parent panel if it was entered incorrectly or needs to change (e.g., nickname preference). This edit is available only to the parent (behind the parent PIN).

**Why this priority**: Supports corrections and flexibility, but less critical than the initial assignment since most names won't change frequently.

**Independent Test**: Can be tested by entering parent mode, navigating to a child's profile settings, changing the real name, and verifying the updated name appears everywhere.

**Acceptance Scenarios**:

1. **Given** a parent is in the parent panel, **When** they select a child's profile settings, **Then** they can edit the child's real name.
2. **Given** a parent changes a child's real name, **When** the change is saved, **Then** the new name immediately appears on the profile picker and throughout the parent panel.

---

### User Story 3 - Backward Compatibility for Existing Profiles (Priority: P3)

Existing child profiles created before this feature gracefully handle the absence of a real name. The system falls back to showing the creature name (current behavior) until the parent sets a real name.

**Why this priority**: Ensures backward compatibility. Existing users should not experience broken UI or be forced to enter real names immediately.

**Independent Test**: Can be tested by loading the app with pre-existing profiles that have no real name set, and verifying the creature name is shown as a fallback without errors.

**Acceptance Scenarios**:

1. **Given** an existing profile with no real name set, **When** the parent views the profile picker, **Then** the creature name is displayed as before (no blank or missing name).
2. **Given** an existing profile with no real name set, **When** the parent opens the parent panel, **Then** a subtle prompt or option is available to add the child's real name.

---

### Edge Cases

- What happens if the parent enters an empty or whitespace-only real name? The system requires at least one visible character.
- What happens if two children have the same real name? The system allows it (siblings can share names; the creature name provides additional differentiation).
- What happens if the real name contains special characters or emoji? The system accepts any printable characters, with a maximum length of 20 characters.
- How does the child's view change? The child does NOT see their real name in their game view — only the creature name is shown in the child's play experience.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow a real name (child's actual name) to be entered when creating a new child profile.
- **FR-002**: System MUST display the child's real name on the profile picker card for parent identification.
- **FR-003**: System MUST display the child's real name in the parent panel (child selector, chore sections, bonus sections, reward sections).
- **FR-004**: System MUST persist the child's real name across sessions and devices (in cloud mode).
- **FR-005**: System MUST allow the parent to edit a child's real name from the parent panel.
- **FR-006**: System MUST validate that the real name is at least 1 visible character and no more than 20 characters.
- **FR-007**: System MUST fall back to displaying the creature name when no real name is set (backward compatibility).
- **FR-008**: System MUST NOT display the child's real name in the child's game/play view — only the creature name appears in the child-facing experience.
- **FR-009**: Real name editing MUST be restricted to parent-accessible areas (behind PIN or parent authentication).

### Key Entities

- **Child Profile**: Extended with a new "real name" attribute representing the child's actual name. Distinct from the creature name, which the child can change freely. The real name is set and edited only by the parent.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Parents can identify the correct child profile within 2 seconds, even after the child has renamed their creature.
- **SC-002**: 100% of parent-facing screens (profile picker, parent panel) display the child's real name when one is set.
- **SC-003**: Existing profiles with no real name set continue to function with no visual errors or missing labels.
- **SC-004**: Real name entry adds no more than 5 seconds to the profile creation flow.

## Assumptions

- The child's real name is a simple text field, not tied to any identity verification or external system.
- The real name is visible only in parent-facing contexts (profile picker, parent panel). The child's play experience remains unchanged.
- The profile creation flow currently consists of creature selection followed by creature naming. The real name prompt will be added to this existing flow.
- In local (offline) mode, the real name persists via the same mechanism as other profile data.
