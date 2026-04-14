# Quickstart: Fix Join Code Profile Creation

## What This Fix Does

Adds Firebase anonymous authentication to the child join-code flow so that children who join a family via code are placed in cloud mode. This ensures their profile is created in Firestore (visible to parent) instead of only in localStorage.

## Files to Modify

| File | Change |
|------|--------|
| `src/firebase/auth.ts` | Add `signInAnonymously` export |
| `src/App.tsx` | Call anonymous sign-in in `handleJoinFamily` before setting familyId |

## No New Files

This is a 2-file bug fix.

## How to Test

1. **Parent device**: Sign up, note the join code
2. **Child device** (different browser/incognito): Enter the join code, select a creature, name it
3. **Parent device**: Verify the child's profile appears in the profile list
4. **Child device**: Complete a chore → verify it syncs to parent device
5. **Child device**: Close and reopen the app → verify profile loads from cloud (not lost)
