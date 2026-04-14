# Feature Specification: Points Persistence Across Sessions

**Feature Branch**: `013-fix-points-persistence`
**Created**: 2026-04-06
**Status**: Draft
**Input**: User description: "the points don't seem to persist when the browser is closed and after logging in"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Points Survive Browser Close (Priority: P1)

A child earns points throughout the day by completing chores. When they close the browser and return later, all previously earned points are still present — nothing is lost.

**Why this priority**: This is the core bug. If points reset on every session, the app's progress tracking and reward system are entirely broken for all users.

**Independent Test**: Open the app, earn points on a profile, close the browser entirely, reopen the app, verify points are unchanged.

**Acceptance Scenarios**:

1. **Given** a child profile has 45 points, **When** the browser is closed and reopened, **Then** the profile still shows 45 points
2. **Given** a child completes a chore earning points, **When** the browser crashes or is forcibly closed, **Then** those points are still present on next visit
3. **Given** multiple child profiles each with different point totals, **When** the browser is closed and reopened, **Then** each profile retains its correct point total

---

### User Story 2 - Points Survive Login/Logout (Priority: P1)

A parent or child logs out and back in and finds all points exactly as they were left. Logging in/out does not reset or lose any earned points.

**Why this priority**: Equally critical to Story 1 — authentication events must not wipe progress. Both scenarios represent the same class of data loss.

**Independent Test**: Earn points, log out, log back in, verify points are unchanged.

**Acceptance Scenarios**:

1. **Given** a child has 120 points, **When** the user logs out and logs back in with the same account, **Then** the profile shows 120 points
2. **Given** a family with two child profiles, **When** a parent logs out and logs back in, **Then** both profiles retain their correct point totals
3. **Given** a child earns points on one device, **When** they log in on a different device, **Then** the same point total is visible

---

### User Story 3 - Points Sync Across Devices (Priority: P2)

A child earns points on one device (e.g., tablet), and a parent checking the app on another device (e.g., phone) sees the updated totals without needing to refresh or re-login.

**Why this priority**: Secondary to basic persistence — once data survives sessions, cross-device sync is the next expected behavior for a family app with cloud accounts.

**Independent Test**: Earn points on Device A, wait up to 30 seconds, check Device B — points match.

**Acceptance Scenarios**:

1. **Given** a child completes a chore on a tablet, **When** a parent views the app on their phone, **Then** the updated points appear within 30 seconds
2. **Given** two devices are both viewing the same child's profile, **When** points are earned on one device, **Then** the other device reflects the change without a full page reload

---

### Edge Cases

- What happens if points are earned while offline? Points should save locally and sync when connectivity is restored.
- What happens if the same profile is modified on two devices simultaneously? The most recent change wins; no silent data loss.
- What happens if a user is not logged in (local-only/guest mode)? Points must still persist across browser sessions using local storage.
- What happens if local data exists and the user then logs in? Local data should be preserved and migrated to the cloud account, not overwritten.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST save earned points immediately when a chore is completed, before the user navigates away or closes the browser
- **FR-002**: The system MUST restore all point totals for all child profiles when a returning user opens the app
- **FR-003**: The system MUST restore all point totals for all child profiles when a user completes login
- **FR-004**: Point totals MUST be consistent across all devices where the same account is logged in
- **FR-005**: The system MUST preserve points earned in local (guest) mode if the user subsequently creates or logs into an account
- **FR-006**: The system MUST handle the case where no network connection is available by saving points locally and syncing when connectivity returns
- **FR-007**: Point saves MUST be durable — a successful save must survive browser close, crash, or forced quit

### Key Entities

- **Child Profile**: Represents a single child's game state; includes current point totals broken down by time-of-day category (morning, afternoon, evening), coins, streaks, and chore completion status
- **Point Total**: The accumulated score within a category for a profile; must be persisted atomically with the profile
- **Session**: The period between login and logout or browser open/close; point data must outlive any single session

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of point totals earned in a session are present when the same profile is loaded in a subsequent session
- **SC-002**: Points are visible and correct within 5 seconds of logging in, for all child profiles
- **SC-003**: Cross-device point sync completes within 30 seconds of the earning event under normal network conditions
- **SC-004**: Zero reported cases of point loss due to browser close or login/logout after fix is deployed
- **SC-005**: Local (guest) mode point data survives browser close with 100% fidelity

## Assumptions

- Users may use the app in both authenticated (cloud) and unauthenticated (local/guest) modes; persistence must work in both
- The app already supports both local and cloud data storage; this fix addresses a gap in how point data is written or read within that existing design
- Points are the primary progress indicator users care about; coins, streaks, and chore status are expected to have the same persistence behavior (same root cause)
- No changes to the points-earning rules or values are in scope — only ensuring what is earned is reliably saved and restored
- Mobile browser background-tab suspension is considered a known risk but is not the primary target of this fix
