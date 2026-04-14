# Quickstart: Kid Join Profile Selection

**Feature**: 018-kid-join-profile

## Manual Test Flow

1. **Parent setup**: Sign up as a parent and note the join code. Add at least one child profile.
2. **Kid join**: Open the app fresh (or in an incognito window). Tap "I'm a Kid (Join Family)".
3. **Enter code**: Enter the 6-character join code and tap "Join Family".
4. **Expected**: The "Who's playing?" profile picker appears showing the child profile(s) created by the parent.
5. **Select profile**: Tap an existing profile — verify the game loads for that profile.
6. **Add new**: Tap "Add Child" — verify creature selection flow begins.

## Edge Case Tests

- **Empty family**: Join a family with 0 profiles. Verify "Add Child" option appears (not a blank screen).
- **Loading state**: On a slow connection, verify a loading indicator appears before profiles arrive.
- **Invalid code**: Enter a bad code. Verify error message still shows (no regression).

## Files Touched

| File                           | Change                                          |
|--------------------------------|-------------------------------------------------|
| `src/hooks/useDataProvider.ts` | Add `loaded: boolean` to `DataProvider` interface and both provider implementations |
| `src/App.tsx`                  | Change `handleJoinFamily` to route to `profiles`; add `loaded` gate in profiles render |
