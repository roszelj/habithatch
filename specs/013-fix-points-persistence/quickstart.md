# Quickstart: Points Persistence Fix

**Feature**: 013-fix-points-persistence

## What's Being Fixed

Points (and all profile state) earned during gameplay are lost on browser close or re-login when using a cloud account. The root cause is that `Game.tsx` calls a localStorage-only save utility directly instead of routing through the active data provider.

## The Change in One Sentence

In `Game.tsx`, replace the direct call to `saveProfile` from `useSaveData` with a call to `provider.saveProfile(updatedProfile)`.

## Files to Modify

| File | Change |
|------|--------|
| `src/components/Game.tsx` | Remove `saveProfile` import from useSaveData; call provider's saveProfile instead |

## How to Test

1. **Local mode (guest)**:
   - Open app without logging in
   - Complete a chore, note the points
   - Close browser entirely, reopen
   - Points should still be present

2. **Cloud mode (logged in)**:
   - Log in with a Firebase account
   - Complete a chore, note the points
   - Close browser entirely, reopen and log back in
   - Points should still be present

3. **Cross-device** (cloud mode only):
   - Earn points on Device A
   - Open app on Device B (same account)
   - Points should match within ~30 seconds

## Verification

Run `npm run build` to confirm no TypeScript errors after the change.
