# Data Model: Fix Join Code Profile Creation

## No Schema Changes

This is a bug fix — no new entities or fields are introduced.

## Existing Entities (unchanged)

### Child Profile (Firestore: `families/{familyId}/profiles/{profileId}`)

Already defined. The fix ensures profiles created by join-code children are written here (instead of only to localStorage).

### Family (Firestore: `families/{familyId}`)

Already defined. No changes. The join code lookup already works correctly.

## Auth State Change

| User Type | Before Fix | After Fix |
|-----------|-----------|-----------|
| Parent (sign up) | Firebase email/password auth | No change |
| Parent (sign in) | Firebase email/password auth | No change |
| Child (join code) | No auth (`user = null`) | Firebase anonymous auth (`user` with uid, no email) |
| Guest (skip) | No auth (`user = null`) | No change (local mode) |

## Data Flow (After Fix)

```
Child enters join code
  → lookupJoinCode(code) → familyId
  → signInAnonymously() → user (anonymous)
  → setFamilyId(fid), setIsParent(false)
  → isCloudMode = Boolean(user && familyId) = true
  → provider = cloudProvider
  → Child selects creature → handleCreationComplete
  → provider.addProfile(profile) → createCloudProfile(familyId, profile)
  → Firestore: families/{familyId}/profiles/{profileId}
  → onAllProfilesSnapshot fires on parent's device
  → Parent sees child's profile
```
