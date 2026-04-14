# Feature Specification: Fix Join Code Profile Creation

**Feature Branch**: `015-fix-joincode-profile`
**Created**: 2026-04-06
**Status**: Draft
**Input**: User description: "when a kid uses a the join code the profile is not created in firebase"

## Bug Description

When a child enters a valid join code to join a parent's family, the child's profile is created only in local storage — not in the cloud. This means the parent cannot see the child's profile, chores, or progress on their device. The root cause is that the join code flow does not establish an authenticated session for the child, so the app falls back to local-only mode even though a valid family ID is known.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Child Joins Family and Profile Appears on Parent's Device (Priority: P1)

A child enters the family join code shared by their parent. After selecting a creature and naming it, the child's profile is created in the cloud under the family. The parent can immediately see the new child on their device.

**Why this priority**: This is the core multi-device family experience. Without it, joining a family via code is broken — the child plays in isolation and the parent cannot manage them.

**Independent Test**: On device A (parent), note the join code. On device B (child), enter the join code, create a creature. On device A, verify the child's profile appears in the profile list.

**Acceptance Scenarios**:

1. **Given** a child on the join screen with a valid join code, **When** they enter the code and create a creature, **Then** their profile is saved to the cloud under the parent's family.
2. **Given** a child has joined a family via join code, **When** the parent views their device, **Then** the child's profile, creature, and chores are visible.
3. **Given** a child has joined a family via join code, **When** the child completes chores or earns points, **Then** those updates are synced to the cloud and visible to the parent in real time.
4. **Given** a child has joined a family, **When** the child closes and reopens the app, **Then** their profile is loaded from the cloud (not lost).

---

### User Story 2 - Child's Ongoing Activity Syncs After Joining (Priority: P1)

After joining a family, the child's ongoing gameplay (chore completions, point earnings, coin spending, reward redemptions) syncs to the cloud in real time — the same way it works for profiles created by the parent.

**Why this priority**: Joining is pointless if subsequent activity doesn't sync. The child must be in full cloud mode after joining.

**Independent Test**: After a child joins via code, complete a chore on the child's device, then verify the chore status updates on the parent's device.

**Acceptance Scenarios**:

1. **Given** a child who joined via join code is playing, **When** they complete a chore, **Then** the parent sees the chore status update on their device.
2. **Given** a child who joined via join code, **When** the parent approves a chore or gives a bonus, **Then** the child sees the update on their device.

---

### Edge Cases

- What happens if a child enters a join code without internet connectivity? The system should show an error indicating a connection is required.
- What happens if a child enters a join code that has expired or is invalid? The system should show a clear error message.
- What happens if the child already has a local profile before joining a family? The local profile data should either migrate to the cloud family or the child starts fresh in the family.
- What happens if the maximum number of profiles (8) has already been reached in the family? The system should inform the child that the family is full.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST create the child's profile in the cloud (not just locally) when they join a family via join code.
- **FR-002**: System MUST establish the child as a cloud-mode user after joining a family, so all subsequent data operations go to the cloud.
- **FR-003**: System MUST associate the child's profile with the correct family so it appears alongside sibling profiles.
- **FR-004**: System MUST persist the child's family association across app restarts so they remain in cloud mode.
- **FR-005**: System MUST sync all child gameplay activity (chores, points, coins, rewards) to the cloud after joining.

### Key Entities

- **Child Profile**: The creature, chores, points, coins, and progress belonging to a child. Must be stored under the family in the cloud.
- **Family**: The parent-created group that children join via code. Owns all child profiles in cloud mode.
- **Join Code**: A 6-character alphanumeric code that links a child to an existing family.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of child profiles created via join code are visible on the parent's device within 5 seconds.
- **SC-002**: All gameplay activity (chores, points, coins) from a join-code child syncs to the parent's device in real time.
- **SC-003**: A child who joined via join code can close and reopen the app without losing their profile or reverting to local mode.
- **SC-004**: The join code flow completes in under 30 seconds from code entry to creature creation.

## Assumptions

- Children joining via join code do not need their own authenticated account — the join code alone is sufficient to associate them with a family.
- The existing cloud data provider and real-time listeners already handle profile sync correctly once a profile is stored in the cloud — the issue is only that the profile is not being stored in the cloud in the first place.
- The child does not need to re-enter the join code on subsequent app visits — the family association is remembered locally.
- If a child has existing local data before joining, starting fresh in the family is acceptable (no migration of local child data required).
