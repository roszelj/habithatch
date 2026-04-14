# Feature Specification: Chore for All Kids

**Feature Branch**: `023-chore-all-kids`
**Created**: 2026-04-07
**Status**: Draft
**Input**: User description: "enhance when creating a chore to select to be created for every kid"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Create a Chore for All Kids at Once (Priority: P1)

A parent is adding chores in Parent Mode and wants the same chore to appear on every child's list — for example, "Clean your room" applies to all kids in the house. Instead of typing the same chore name repeatedly for each child, the parent can check an option when adding the chore and it is created for all children simultaneously.

**Why this priority**: This is the entire feature. Without it, parents with multiple children must tediously add the same chore N times. This is the most common pain point for multi-child families.

**Independent Test**: In Parent Mode, add a new chore with the "All kids" option selected → verify the chore appears on every child's chore list for the same time category.

**Acceptance Scenarios**:

1. **Given** a parent is in Parent Mode adding a chore for a specific child, **When** they check the "Add for all kids" option before confirming, **Then** the chore is added to every child's list in the same time category (Morning/Afternoon/Evening).
2. **Given** a parent adds a chore with "Add for all kids" selected, **When** the chore is created, **Then** each child receives their own independent copy of the chore (approving it for one child does not affect the others).
3. **Given** a parent adds a chore with "Add for all kids" selected, **When** the chore is created, **Then** the parent sees a confirmation indicating the chore was added to all children.
4. **Given** a parent adds a chore without selecting "Add for all kids", **When** the chore is created, **Then** only the currently selected child receives the chore (existing single-child behaviour unchanged).

---

### Edge Cases

- What if there is only one child in the family? → The "Add for all kids" option is still available and works correctly; the chore is added to that single child as normal.
- What if one child's chore list already contains a chore with the same name in the same category? → Add it anyway — duplicate chore names are allowed (existing behaviour for single-add is unchanged).
- What if the parent is viewing a specific child when they use "Add for all kids"? → The chore is added to every child, including the currently viewed one.
- What if the chore name is empty? → Same validation as single-add: empty names are rejected before the option to broadcast is relevant.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide an option during chore creation in Parent Mode to add the chore to all children instead of just the currently selected child.
- **FR-002**: The option MUST be clearly labelled so parents immediately understand it broadcasts the chore to every child profile.
- **FR-003**: When the "Add for all kids" option is selected, the system MUST add the chore to every child profile in the same time category (Morning, Afternoon, or Evening) as the one being created.
- **FR-004**: Each child's copy of the chore MUST be independent — approving, rejecting, or removing it for one child MUST NOT affect any other child's copy.
- **FR-005**: The system MUST provide visible confirmation after a multi-child chore is created (e.g., a brief message indicating how many children received the chore).
- **FR-006**: When the "Add for all kids" option is NOT selected, the existing single-child chore creation behaviour MUST be preserved without any change.
- **FR-007**: The option MUST be off by default so parents who do not need it are not affected.

### Key Entities

- **Chore**: A named task assigned to a specific child for a specific time category (Morning, Afternoon, Evening). Each child holds their own independent copy.
- **Child Profile**: A profile for one child in the family. Has its own chore list per time category. The "Add for all kids" action creates a separate Chore instance on every profile.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A parent can add a chore to all children in a single action — no more than 1 form submission required regardless of family size.
- **SC-002**: After using "Add for all kids", 100% of child profiles have the new chore in the correct time category — zero omissions.
- **SC-003**: Approving or removing the chore on one child's list has zero effect on any other child's copy of the same chore.
- **SC-004**: The confirmation message is visible immediately after the action, within the same interaction — no page reload or navigation required.

## Assumptions

- The feature is only available in Parent Mode; children cannot add chores to other profiles.
- "All kids" means all child profiles currently saved in the app — there is no way to select a subset of children in this version.
- The chore category (Morning/Afternoon/Evening) is determined by which category the parent is adding to, same as single-add; the chore is added to that same category for every child.
- The option is a simple checkbox or toggle; no advanced scheduling or recurrence is part of this feature.
- The existing chore name validation (non-empty, max length) applies equally to multi-child creation.
