# Research: Account Deletion

**Branch**: `041-account-deletion` | **Date**: 2026-04-27

## Decision 1: Client-Side vs. Cloud Function for Cascading Delete

**Decision**: Client-side sequential delete  
**Rationale**: Families have 1–5 profiles and 0–few notification documents. The client can enumerate and delete subcollection documents individually before deleting the parent document. A Cloud Function adds a deployment step and cold-start latency for a rare operation with a trivially small data set.  
**Alternatives considered**: Cloud Function callable — rejected due to added complexity and unnecessary for this data scale.

## Decision 2: Re-authentication Strategy

**Decision**: Catch `auth/requires-recent-login` error and prompt for password re-entry in the deletion confirmation dialog  
**Rationale**: Firebase's `deleteUser()` (web) and `auth().currentUser.delete()` (native) throw `auth/requires-recent-login` if the session is older than ~5 minutes. Rather than always requiring password input (poor UX for users who just signed in), we attempt deletion and only show a password field if Firebase rejects the call. This is the standard Firebase-recommended pattern.  
**Alternatives considered**: Always re-authenticate before delete — rejected as unnecessarily disruptive for fresh sessions.

## Decision 3: Deletion Order

**Decision**: Delete Firestore data first, then Firebase Auth account  
**Rationale**: If Auth deletion succeeds but Firestore deletion fails, the user is signed out with orphaned data and no way to sign back in to retry. Reversing the order (Firestore first, Auth second) means a failed Auth deletion leaves the data gone but the Auth account intact — the user can sign in again and retry. This is the safer failure mode.  
**Alternatives considered**: Delete Auth first — rejected due to the orphaned data risk described above.

## Decision 4: Deletion Sequence for Firestore Data

**Decision**: 
1. Enumerate and delete all `families/{fid}/notifications/{nid}` documents  
2. Enumerate and delete all `families/{fid}/profiles/{pid}` documents  
3. Delete `families/{fid}` document  
4. Delete `joinCodes/{joinCode}` document  
5. Delete Firebase Auth account  
6. Clear localStorage / AsyncStorage  

**Rationale**: Firestore client SDK does not recursively delete subcollections when a parent document is deleted. Each subcollection document must be individually deleted client-side. Notifications are deleted first as they are ephemeral; profiles second as they are child data; family document last.  
**Alternatives considered**: Leaving orphaned subcollections — rejected; orphaned data violates SC-002.

## Decision 5: Individual Child Profile Deletion

**Decision**: Add a "Remove Profile" action per profile in the Parent Panel; deletion removes only `families/{fid}/profiles/{pid}` (and its FCM tokens) without touching Auth or the family document  
**Rationale**: Profile documents are self-contained — removing one doesn't affect the parent account or other profiles. No Auth operation needed.  
**Alternatives considered**: Requiring full account deletion to remove a child — rejected; overly destructive.

## Decision 6: Security Rules for Deletion

**Decision**: No security rule changes required  
**Rationale**: Existing rules allow authenticated writes to `families/{fid}` and open writes to `families/{fid}/profiles/{pid}`. Deletion is a write operation covered by these rules. The `joinCodes/{code}` rule allows authenticated writes. All deletion operations execute while the parent is still authenticated (before Auth account deletion).
