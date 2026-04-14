# Feature Specification: Parent Persistent Session

**Feature Branch**: `019-parent-persistent-auth`
**Created**: 2026-04-07
**Status**: Draft
**Input**: User description: "enhance the parent sign in to keep them signed on without having to login in each time the page is refeshed"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Parent Returns to App Without Re-Authenticating (Priority: P1)

A parent who has previously signed in opens or refreshes the app and lands directly on the family's profile picker (or their active child's game screen) — without being shown the login form again.

**Why this priority**: This is the core pain point. Every page refresh currently forces the parent through the login screen, making the app feel broken and creating friction for the primary account holder.

**Independent Test**: Sign in as a parent, then refresh the page. Verify the login screen does not appear and the parent is taken directly to the game content.

**Acceptance Scenarios**:

1. **Given** a parent has previously signed in, **When** they refresh the page, **Then** the login screen is skipped and the family's profile picker or active game is displayed.
2. **Given** a parent has previously signed in, **When** they close the browser tab and reopen the app, **Then** the login screen is skipped and they reach game content directly.
3. **Given** a parent is on the game screen, **When** the page refreshes (e.g., accidental reload), **Then** they return to the same game context without logging in again.

---

### User Story 2 - Parent Can Still Sign Out (Priority: P2)

A parent who is persistently signed in retains the ability to explicitly sign out, after which the login screen is presented on the next visit.

**Why this priority**: Persistent sessions must not prevent parents from switching accounts or signing out on shared devices.

**Independent Test**: Sign in as a parent, verify they are auto-restored on refresh, then sign out. Verify the next page load shows the login screen.

**Acceptance Scenarios**:

1. **Given** a parent is signed in and their session is persisted, **When** they explicitly sign out, **Then** subsequent page loads show the login screen.
2. **Given** a parent has signed out, **When** they refresh the page, **Then** the login form is displayed (no auto-restore).

---

### Edge Cases

- What happens when the parent's session token expires or is revoked? The parent is shown the login screen to re-authenticate.
- What happens when the parent is signed in but their family account is deleted? They should be shown an appropriate error and the login screen.
- What happens when the app loads on a device where the parent has never signed in? The login/sign-up screen is shown normally.
- What happens during the brief moment the app is checking whether a session exists? A loading indicator is shown until the session check completes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST automatically restore a parent's signed-in session when the page is loaded or refreshed, without requiring the parent to re-enter their credentials.
- **FR-002**: System MUST skip the login/sign-up screen for a parent with an active session and route them directly to game content (profile picker or active game).
- **FR-003**: System MUST display a loading indicator while determining whether a persistent session exists, so the parent does not see a flash of the login screen.
- **FR-004**: System MUST allow a parent to explicitly sign out, ending the persistent session.
- **FR-005**: After a sign-out, system MUST present the login screen on the next page load (no auto-restore).
- **FR-006**: System MUST handle session expiry gracefully by returning the parent to the login screen with a clear prompt to sign in again.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of page refreshes by a previously signed-in parent skip the login screen and land on game content.
- **SC-002**: The time from page load to reaching game content for a returning parent is under 3 seconds on a standard connection.
- **SC-003**: Parents do not need to re-enter their credentials more than once per device (until they explicitly sign out).
- **SC-004**: Sign-out correctly ends the persistent session in 100% of cases — no auto-restore occurs after an explicit sign-out.

## Assumptions

- The session persistence is scoped to the device/browser — signing in on one browser does not affect other devices.
- Session tokens have a reasonable lifetime managed by the authentication service; indefinite persistence is not required (a parent may need to re-authenticate if the session is very old or revoked).
- The loading state shown during session check reuses the existing loading indicator already present in the app.
- Kids who join via join code (anonymous sign-in) are not affected — this feature applies to parent accounts only.
- The existing sign-out functionality is preserved and works identically for both persisted and non-persisted sessions.
