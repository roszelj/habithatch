# Feature Specification: Parent Join Code Display

**Feature Branch**: `025-parent-join-code`
**Created**: 2026-04-07
**Status**: Draft
**Input**: User description: "add the join code on the parent view if they need to give it to their kid"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Parent Sees Join Code in Parent Mode (Priority: P1)

A parent opens Parent Mode and needs to share the family join code with a child so the child can connect their device to the family. The join code is displayed clearly somewhere in the parent panel so the parent can read it out or hand the device to the child without having to navigate elsewhere.

**Why this priority**: The join code is the only way a child device connects to the family. If the parent can't find it, the child can't join. This is the core need and the complete feature.

**Independent Test**: Log in as a parent with an active family → open Parent Mode → verify the join code is visible somewhere on the parent panel without any additional navigation.

**Acceptance Scenarios**:

1. **Given** a parent is in Parent Mode, **When** they view any tab of the parent panel, **Then** the family join code is visible on screen.
2. **Given** the join code is displayed, **When** the parent reads it, **Then** it matches the code a child would need to enter to join the family.
3. **Given** the app is in local (offline/no-cloud) mode, **When** the parent opens Parent Mode, **Then** no join code section is shown (join codes only exist for cloud families).

---

### Edge Cases

- What if the family has no join code yet (e.g., a legacy account)? The join code section should either be hidden or show a loading/unavailable state.
- What if the parent is in local-only mode (no Firebase)? The join code field is not rendered at all.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The parent panel MUST display the family join code when the app is in cloud (multi-device) mode.
- **FR-002**: The join code MUST be displayed as a clearly readable string (e.g., large text or a distinct code block).
- **FR-003**: The join code MUST be visible without requiring the parent to navigate to a separate screen or tap an additional button.
- **FR-004**: The join code section MUST NOT appear when the app is in local (single-device) mode.
- **FR-005**: The join code display MUST be read-only — parents cannot edit it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A parent can locate and read the join code within 5 seconds of opening Parent Mode.
- **SC-002**: The join code is displayed on every tab of the parent panel (or at a persistent location), so the parent never has to search for it.
- **SC-003**: In local mode, zero join code UI elements are visible in Parent Mode.

## Assumptions

- Join codes are already generated and stored when a family is created in cloud mode — no new data is needed.
- The join code is a short alphanumeric string (e.g., 6 characters) readable at a glance.
- The parent panel already receives the cloud context (join code) as a prop or from the app state — this is a display-only addition.
- A copy-to-clipboard button is out of scope for this iteration (read-only display is sufficient).
