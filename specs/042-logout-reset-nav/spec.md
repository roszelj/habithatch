# Feature Specification: Logout Button & Reset Button Relocation

**Feature Branch**: `042-logout-reset-nav`  
**Created**: 2026-04-28  
**Status**: Draft  
**Input**: User description: "I want to move the reset button our of the tab navigation adding to manage screen in the danager zone. Add a logout out button where the reset was. The logout should destroy all auth and local storage so when opening the app it should prompt to sign in or sign up"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Logout Clears Session and Returns to Auth Screen (Priority: P1)

A parent who is done using the app (or wants to switch accounts) taps the Logout button in the tab navigation. The app immediately destroys all authentication session data and locally stored data, then navigates the user to the sign-in / sign-up screen. The next time anyone opens the app, they are greeted with the auth entry point rather than the home screen.

**Why this priority**: Logout is a fundamental security action. It must be reliable and complete — partial logout (credentials wiped but local data intact, or vice versa) could expose family data to the next person who picks up the device.

**Independent Test**: Can be fully tested by tapping Logout, confirming the auth screen appears, force-quitting the app, re-opening it, and verifying the auth screen still shows (not the main app).

**Acceptance Scenarios**:

1. **Given** a parent is authenticated and on any tab, **When** they tap the Logout button in the tab bar and confirm, **Then** all auth credentials and locally stored app data are erased and the sign-in / sign-up screen is displayed.
2. **Given** a user has just logged out, **When** they close and reopen the app, **Then** the app opens on the sign-in / sign-up screen, not the main experience.
3. **Given** a user taps Logout and confirms, **When** the operation completes, **Then** no family data, profile data, or session tokens remain accessible on the device.

---

### User Story 2 - Reset Button Moved to Manage Screen Danger Zone (Priority: P2)

A parent navigates to the Manage screen and scrolls to the Danger Zone section, where they find the Reset button that was previously in the tab navigation. The Reset action is now co-located with other high-risk, irreversible actions, making accidental taps less likely.

**Why this priority**: Relocation improves safety (the danger zone pattern sets user expectations) without removing any functionality. It depends on the Logout button occupying the vacated tab slot.

**Independent Test**: Can be fully tested by opening the Manage screen, verifying the Danger Zone section contains a Reset button, and confirming the Reset action still works as before.

**Acceptance Scenarios**:

1. **Given** a parent opens the Manage screen, **When** they scroll to the Danger Zone section, **Then** a Reset button is visible there.
2. **Given** the Reset button is in the Danger Zone, **When** a parent taps it, **Then** the existing reset confirmation flow and behavior are preserved exactly.
3. **Given** the tab navigation, **When** a parent views it, **Then** there is no Reset button — only the new Logout button in its place.

---

### User Story 3 - Logout Button Visible and Clearly Labeled in Tab Bar (Priority: P2)

A parent sees a Logout button in the position previously occupied by the Reset button in the tab navigation bar. The button is clearly labeled so users understand its intent before tapping.

**Why this priority**: The Logout entry point must be discoverable and clearly communicate its consequence to prevent accidental logouts.

**Independent Test**: Can be fully tested by viewing the tab bar and confirming a clearly labeled Logout button appears where Reset previously was.

**Acceptance Scenarios**:

1. **Given** the tab navigation bar is visible, **When** a parent looks at the tabs, **Then** a Logout button (with an appropriate icon and/or label) appears where the Reset button previously was.
2. **Given** a parent taps the Logout tab item, **When** a confirmation prompt is shown, **Then** confirming proceeds with full logout; canceling returns them to the current screen unchanged.

---

### Edge Cases

- What happens if the logout operation partially fails (e.g., remote sign-out succeeds but local storage clear fails)? The user must still land on the auth screen; the app must not silently leave stale data.
- What happens when the user taps Logout while offline? Logout must proceed locally regardless of network state — auth session and local data are cleared on-device even if the remote sign-out call cannot complete.
- What happens if a child profile is the active session at logout time? The logout must clear all session data regardless of which profile is active.
- How does the Danger Zone visually communicate the severity of the Reset action now that it no longer appears in the top-level tab bar?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Logout button MUST be placed in the **parent view** tab navigation bar in the position previously occupied by the Reset button. The child (kid) view tab bar is unaffected.
- **FR-002**: Tapping the Logout button MUST show a confirmation prompt before any destructive action is taken.
- **FR-003**: Upon confirmation, the app MUST destroy all authentication session data stored on the device.
- **FR-004**: Upon confirmation, the app MUST clear all locally stored app data (AsyncStorage).
- **FR-005**: After logout completes, the app MUST navigate to the sign-in / sign-up screen.
- **FR-006**: After logout, reopening the app MUST present the sign-in / sign-up screen, not the authenticated main experience.
- **FR-007**: Logout MUST succeed and clear local data even when the device is offline (remote sign-out is best-effort).
- **FR-008**: The Reset button MUST be removed from the **parent view** tab navigation bar.
- **FR-009**: The Reset button MUST appear in the Danger Zone section of the Manage screen (a parent-only screen).
- **FR-010**: The Reset button in the Danger Zone MUST retain its existing confirmation flow and behavior unchanged.
- **FR-011**: The Danger Zone section of the Manage screen MUST clearly visually communicate the destructive nature of actions it contains.

### Key Entities

- **Auth Session**: The authenticated user identity (tokens, credentials) — must be fully invalidated on logout.
- **Local Storage / AsyncStorage**: All app data persisted on-device outside of remote services — must be fully cleared on logout.
- **Parent Tab Navigation Bar**: The persistent navigation component in the parent view — one slot transitions from Reset to Logout. The child view tab bar is unchanged.
- **Manage Screen – Danger Zone**: A dedicated section within the Manage screen grouping irreversible, high-impact actions; Reset now resides here.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After tapping Logout and confirming, the user reaches the sign-in / sign-up screen in under 3 seconds on a standard device.
- **SC-002**: Zero family or profile data items are retrievable from on-device storage after a completed logout.
- **SC-003**: Reopening the native app after logout lands on the auth screen 100% of the time on both iOS and Android.
- **SC-004**: The Reset action remains accessible and fully functional from the Manage screen Danger Zone with no change to its existing behavior.
- **SC-005**: No existing tab navigation flows are disrupted by the button swap — all other tabs remain functional and unchanged.

## Assumptions

- A confirmation dialog will be shown before logout executes; exact wording is left to the implementer but must clearly state that the session will end and re-login will be required.
- The existing Reset button confirmation flow and underlying behavior are fully preserved — this feature only relocates the button.
- "Destroy all auth and local storage" means clearing auth session tokens AND all AsyncStorage keys used by the native app; cloud data in Firestore remains intact for when the user logs back in.
- The Logout button replaces the Reset button slot in the tab bar; no new tab slot is added and the total number of tabs stays the same.
- **Scope is native (React Native / Expo) surfaces only.** The web app is explicitly out of scope for this feature.
- If the Manage screen does not yet have a clearly delineated Danger Zone section, one must be created as part of this feature.
- The Logout button and all Danger Zone changes are **parent view only**; the child (kid) view and its tab bar are not modified.

## Clarifications

### Session 2026-04-28

- Q: What surfaces are in scope? → A: Native (React Native / Expo) only; web is out of scope.
- Q: Does the Logout button and Manage/Danger Zone apply to parent view only or both views? → A: Parent view only.
