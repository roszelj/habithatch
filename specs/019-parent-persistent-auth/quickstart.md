# Quickstart: Parent Persistent Session

**Feature**: 019-parent-persistent-auth

## Manual Test Flow

### Happy Path — Session Restored

1. Open the app fresh. Sign up or sign in as a parent.
2. Verify the family profile picker or game screen appears.
3. **Refresh the page** (Cmd+R / F5).
4. **Expected**: No login screen. App goes directly to the profile picker or game.

### Happy Path — Sign Out Clears Session

1. With a parent signed in, perform a refresh (verifying step 3 above passes).
2. Find and use the sign-out option.
3. Refresh the page.
4. **Expected**: Login/sign-up screen is shown. No auto-restore.

### Edge Case — First-Time Visit

1. Open the app in a private/incognito window (no session).
2. **Expected**: Login/sign-up screen is shown normally.

### Edge Case — Loading State

1. Throttle the network to "Slow 3G" in browser DevTools.
2. Refresh the page while signed in as a parent.
3. **Expected**: Loading indicator appears briefly, then game content — NOT the login screen.

## Files Changed

| File           | Change                                                              |
|----------------|---------------------------------------------------------------------|
| `src/App.tsx`  | Remove `isParent` state; derive from `user.isAnonymous`. Add `useEffect` to restore phase on auth resolution. Remove `setIsParent` calls from handlers. |
