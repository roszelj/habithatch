# Quickstart / Test Scenarios: Account Deletion

**Branch**: `041-account-deletion` | **Date**: 2026-04-27

## Scenario 1: Happy Path — Parent Deletes Account (Fresh Session)

1. Sign in as a parent (email + password)
2. From the game view, enter the Parent Panel (via PIN)
3. Scroll to the bottom of the Parent Panel → find "Delete Account" section
4. Tap "Delete Account" → confirmation dialog appears listing what will be deleted
5. Confirm deletion → spinner shown while data is removed
6. App signs out and returns to the welcome/auth screen
7. **Verify**: Attempting to sign in with the same credentials fails ("user not found" or similar)
8. **Verify**: The family's Firestore documents no longer exist (check Firebase Console)

## Scenario 2: Parent Deletes Account (Stale Session — Re-auth Required)

1. Sign in as a parent, wait >5 minutes (or simulate stale session by revoking tokens in Firebase Console)
2. Initiate account deletion from Parent Panel
3. **Expected**: Firebase rejects with `auth/requires-recent-login` → password input appears in the dialog
4. Enter the correct password → deletion proceeds and completes
5. **Verify**: Same as Scenario 1 post-deletion checks

## Scenario 3: Parent Cancels Deletion

1. Sign in as a parent → enter Parent Panel → tap "Delete Account"
2. In the confirmation dialog, tap "Cancel"
3. **Verify**: Nothing is deleted; user remains on the Parent Panel

## Scenario 4: Deletion Fails (Simulated Network Error)

1. Sign in as a parent → enter Parent Panel → tap "Delete Account"
2. Disable network (Airplane mode) before confirming
3. Confirm deletion
4. **Expected**: Error message displayed; account and data remain intact
5. Re-enable network → retry → deletion succeeds

## Scenario 5: Remove Individual Child Profile

1. Sign in as a parent with 2+ child profiles → enter Parent Panel
2. Find an individual profile → tap "Remove Profile"
3. Confirmation dialog appears
4. Confirm → profile is removed
5. **Verify**: That profile's document is gone in Firestore; other profiles and parent account intact
6. **Verify**: App reflects the removed profile (no longer appears in profile list)

## Scenario 6: Remove Last Child Profile

1. Sign in as a parent with exactly 1 child profile → enter Parent Panel
2. Tap "Remove Profile" on the last remaining profile → confirm
3. **Expected**: Profile is removed; app prompts to add a new child or delete account entirely
