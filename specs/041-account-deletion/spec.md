# Feature Specification: Account Deletion

**Feature Branch**: `041-account-deletion`  
**Created**: 2026-04-27  
**Status**: Draft  
**Input**: User description: "Submitted the app to apple store and they reported that the app supports account creation but does not include an option to initiate account deletion. Apps that support account creation must also offer account deletion to give users more control of the data they've shared while using an app."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Parent Deletes Their Account (Priority: P1)

A parent who created an account with their email and password wants to permanently delete their account and all associated family data from the app. They navigate to their account settings, choose to delete their account, confirm the action, and the app removes all their data and signs them out.

**Why this priority**: This is the primary Apple App Store requirement. Parent accounts are the only accounts created via email/password, making this the core compliance need. Without this, the app will be rejected.

**Independent Test**: Can be fully tested by signing in as a parent, navigating to account settings, initiating deletion, confirming, and verifying the user is signed out and cannot sign back in with the old credentials.

**Acceptance Scenarios**:

1. **Given** a signed-in parent user, **When** they navigate to account settings and tap "Delete Account", **Then** they see a confirmation dialog explaining what will be permanently deleted.
2. **Given** the confirmation dialog is shown, **When** the parent confirms deletion, **Then** their account, all family data, and all children's profiles are permanently removed and the parent is returned to the sign-in screen.
3. **Given** the confirmation dialog is shown, **When** the parent cancels, **Then** nothing is deleted and they return to settings.
4. **Given** a parent initiates deletion, **When** the deletion completes, **Then** attempting to sign in with the same credentials fails with an appropriate message.

---

### User Story 2 - Child Profile Removal by Parent (Priority: P2)

A parent wants to remove a specific child's profile from the family without deleting the entire parent account. This gives parents granular control over their family's data.

**Why this priority**: Supports the spirit of Apple's data control requirement and natural family lifecycle events (e.g., a child stops using the app). Secondary to full account deletion but important for complete data control.

**Independent Test**: Can be fully tested by having a parent with multiple child profiles, removing one, and verifying that profile's data is gone while the parent account and other profiles remain intact.

**Acceptance Scenarios**:

1. **Given** a parent with at least one child profile, **When** they select a profile and choose "Remove Profile", **Then** they see a confirmation dialog listing what will be deleted.
2. **Given** the confirmation dialog, **When** the parent confirms, **Then** that child's profile, chores, points, coins, and history are permanently removed.
3. **Given** only one child profile remains, **When** the parent removes it, **Then** the app presents the option to add a new child or delete the whole account.

---

### Edge Cases

- What happens if the network is unavailable when account deletion is attempted? The user should receive a clear error and the account must remain intact.
- What happens if deletion partially fails (credentials deleted but data remains, or vice versa)? The system should attempt a complete cleanup and if unrecoverable, present a support contact option.
- What happens when a parent account is deleted while a child's device is actively using the app? The child's session should gracefully end with a friendly message on their next interaction.
- What if the parent has only anonymous child sessions (no email)? Those sessions are tied to the family and must also be cleaned up on deletion.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST provide an easily accessible "Delete Account" option within the parent account settings area.
- **FR-002**: Before deletion executes, the app MUST display a confirmation step that clearly describes what data will be permanently removed (account credentials, all child profiles, chores, points, coins, and history).
- **FR-003**: Upon confirmed deletion, the app MUST permanently remove the parent's login credentials so they can no longer sign in.
- **FR-004**: Upon confirmed deletion, the app MUST permanently remove all associated family data, including all child profiles and their associated data (chores, points, coins, streaks, rewards, notifications).
- **FR-005**: Upon confirmed deletion, the app MUST sign the parent out and return them to the initial welcome screen.
- **FR-006**: If account deletion fails due to a network or service error, the app MUST notify the user with a clear message and leave all data intact.
- **FR-007**: Parents MUST be able to remove individual child profiles without deleting their parent account.
- **FR-008**: The deletion flow MUST be accessible from both the iOS app and the web version of the app.
- **FR-009**: Account deletion MUST be fully self-service within the app — the user must NOT be required to contact support or visit an external website to complete deletion.

### Key Entities

- **Parent Account**: The email-authenticated user record; deletion removes login access permanently.
- **Family**: The top-level grouping record linking the parent to all child profiles; fully removed with account deletion.
- **Child Profile**: An individual child's pet, chores, points, coins, and progress data; removed as part of family deletion or individually by the parent.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A parent can complete the full account deletion flow (navigate to settings → confirm deletion → signed out) in under 60 seconds.
- **SC-002**: 100% of associated family data is removed upon confirmed account deletion — no orphaned records remain.
- **SC-003**: Account deletion is reachable within 3 taps from the main parent view.
- **SC-004**: The app passes Apple App Store review with no rejection related to account deletion.
- **SC-005**: After deletion, the deleted credentials cannot be used to sign in — verified within 30 seconds of deletion completing.

## Assumptions

- Only parent accounts (email/password sign-in) are subject to the full account deletion requirement; child sessions are anonymous and tied to the family, not to independent named accounts.
- The "Delete Account" option will be placed in the Parent Panel / settings area, which is already PIN-protected, providing sufficient intent verification before deletion.
- Both the iOS (React Native) and web versions of the app will surface the deletion option, since both support parent account creation.
- Deleted data is not recoverable — there is no soft-delete or grace period. This is clearly communicated in the confirmation dialog.
- Children active on their devices when a parent account is deleted will see a graceful session-end message, not a crash or silent failure.
