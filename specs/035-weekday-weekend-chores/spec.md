# Feature Specification: Weekday & Weekend Chores

**Feature Branch**: `035-weekday-weekend-chores`
**Created**: 2026-04-11
**Status**: Draft
**Input**: User description: "I want to separate the chores into 2 sections 1.) Weekday Chores 2.) Weekend chores. If it's currently M-F show the kid those chores, if it's the weekend show them the weekend chores to check off"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automatic Day-Based Chore Display (Priority: P1)

A child opens the app on a school day (Monday through Friday). The chores screen automatically shows their weekday chores organized by time of day (morning, afternoon, evening). On Saturday or Sunday, the same screen automatically shows their weekend chores instead. The child does not need to do anything — the system detects the current day and displays the correct set.

**Why this priority**: This is the core feature. Without automatic day detection, there is no weekday/weekend separation.

**Independent Test**: Can be fully tested by opening the chores screen on a weekday and verifying only weekday chores appear, then checking again on a weekend day and verifying only weekend chores appear.

**Acceptance Scenarios**:

1. **Given** it is Monday through Friday, **When** the child opens the chores screen, **Then** only weekday chores are displayed (organized by morning, afternoon, evening).
2. **Given** it is Saturday or Sunday, **When** the child opens the chores screen, **Then** only weekend chores are displayed (organized by morning, afternoon, evening).
3. **Given** the child has the app open when the day changes from Friday to Saturday (or Sunday to Monday), **When** the daily reset occurs, **Then** the displayed chores switch to the correct set for the new day.

---

### User Story 2 - Parent Manages Weekday and Weekend Chores Separately (Priority: P2)

A parent enters Parent Mode and can manage two separate chore lists: one for weekdays and one for weekends. When adding a new chore, the parent specifies whether it's a weekday chore or a weekend chore. The parent can view and manage both lists regardless of what day it currently is.

**Why this priority**: Parents need to be able to set up both lists. Without this, only the currently active list could be edited.

**Independent Test**: Can be tested by entering Parent Mode, adding chores to both weekday and weekend lists, and verifying both lists are visible and editable.

**Acceptance Scenarios**:

1. **Given** the parent is in Parent Mode, **When** they view a child's chores, **Then** they see both weekday and weekend chore sections clearly labeled.
2. **Given** the parent is in Parent Mode, **When** they add a chore, **Then** they can choose whether it goes into the weekday list or the weekend list.
3. **Given** the parent is in Parent Mode on a Tuesday, **When** they view the weekend chore list, **Then** they can still add, remove, and approve weekend chores.

---

### User Story 3 - Existing Chores Migrate to Weekday List (Priority: P3)

When this feature is first activated, all existing chores that were previously set up are treated as weekday chores. The weekend chore list starts empty. This ensures no chores are lost during the transition.

**Why this priority**: Data migration is essential for a smooth upgrade, but it's a one-time event, not ongoing functionality.

**Independent Test**: Can be tested by upgrading from a profile with existing chores and verifying they all appear in the weekday list, with the weekend list empty.

**Acceptance Scenarios**:

1. **Given** a child profile with existing chores, **When** the feature is activated, **Then** all existing chores appear in the weekday section.
2. **Given** a child profile with existing chores, **When** the feature is activated, **Then** the weekend section exists but is empty.

---

### Edge Cases

- What happens at midnight Friday-to-Saturday or Sunday-to-Monday? The daily reset should switch the active chore set and reset chore statuses for the newly active set.
- What happens if a parent adds a chore "to all kids"? The chore should be added to the specified day type (weekday or weekend) for all kids.
- What happens if the kid completes all weekday chores on Friday, and Saturday arrives? The streak logic should evaluate completion against the set of chores that was active on Friday (weekday chores), not the weekend chores that are now showing.
- What happens if the weekend list has zero chores? The chores screen should display normally with empty categories and no errors, similar to how a new profile works today.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each child profile MUST maintain two independent chore lists: one for weekdays (Monday-Friday) and one for weekends (Saturday-Sunday).
- **FR-002**: Each chore list MUST retain the existing morning/afternoon/evening time-of-day organization.
- **FR-003**: The chores screen in kid mode MUST automatically display only the chore list matching the current day of the week.
- **FR-004**: The daily reset MUST reset chore statuses only for the chore list that is becoming active (e.g., on Saturday morning, reset weekend chores; on Monday morning, reset weekday chores).
- **FR-005**: Parent Mode MUST display both weekday and weekend chore sections for each child, clearly labeled.
- **FR-006**: When a parent adds a chore, they MUST be able to specify whether it belongs to the weekday or weekend list.
- **FR-007**: When a parent adds a chore "to all kids," it MUST be added to the specified day type (weekday or weekend) for every child.
- **FR-008**: Existing chore data MUST be migrated to the weekday list, with the weekend list initialized as empty.
- **FR-009**: Streak completion MUST be evaluated against the chore list that was active on the day being evaluated (weekday chores on M-F, weekend chores on Sat-Sun).
- **FR-010**: Points earned from completing chores MUST work identically regardless of whether the chore is weekday or weekend.

### Key Entities

- **Weekday Chore List**: The set of chores (morning/afternoon/evening) that are active and visible Monday through Friday. Managed independently from weekend chores.
- **Weekend Chore List**: The set of chores (morning/afternoon/evening) that are active and visible Saturday and Sunday. Managed independently from weekday chores.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Kids see the correct chore list for the current day type 100% of the time without manual intervention.
- **SC-002**: Parents can manage both weekday and weekend chore lists on any day of the week.
- **SC-003**: Existing users retain all their chores after upgrading with zero data loss.
- **SC-004**: Daily reset correctly switches between chore lists at day boundaries.
- **SC-005**: Streak tracking accurately reflects completion against the day-appropriate chore list.

## Assumptions

- The determination of weekday vs weekend uses the device's local date/time. No server-side date authority is needed.
- The two chore lists share the same morning/afternoon/evening structure — they are just two instances of the existing category chores model.
- Kids cannot manually switch between viewing weekday and weekend chores. They always see the list for today. Only parents see both lists.
- The daily chore reset (already implemented) will be extended to be aware of which list to reset, rather than requiring a separate reset mechanism.
