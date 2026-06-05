# Data Model: Account Deletion

**Branch**: `041-account-deletion` | **Date**: 2026-04-27

No new data entities are introduced by this feature. Account deletion reads and removes existing Firestore documents in sequence.

## Entities Affected

### Family (`families/{familyId}`)
- **Action**: Deleted after all subcollections are cleared
- **Related**: `joinCode` field is used to look up and delete the corresponding `joinCodes/{code}` document

### ChildProfile (`families/{familyId}/profiles/{profileId}`)
- **Action**: Enumerated and deleted individually (subcollection not auto-deleted with parent)
- **Individual removal**: Supported without deleting the family or parent account

### PendingNotification (`families/{familyId}/notifications/{notifId}`)
- **Action**: Enumerated and deleted individually before family document deletion

### JoinCode (`joinCodes/{code}`)
- **Action**: Deleted after family document deletion; key is the 6-character join code stored on the Family document

### Firebase Auth User
- **Action**: `deleteUser()` called after all Firestore data is removed
- **Re-auth**: May require re-authentication (`reauthenticateWithCredential`) if session is stale

## Deletion State Machine

```
[Initiated by parent]
      ↓
[Re-auth if required]
      ↓
[Delete notifications subcollection docs]
      ↓
[Delete profile subcollection docs]
      ↓
[Delete family document]
      ↓
[Delete joinCode document]
      ↓
[Delete Firebase Auth account]
      ↓
[Clear localStorage / AsyncStorage]
      ↓
[Return to welcome screen]
```

**On failure at any Firestore step**: Show error, abort. Auth account is still valid — user can retry.  
**On failure at Auth deletion step**: Firestore data is already gone. Show error with support contact. (Rare — Auth deletion almost never fails for a valid user.)
