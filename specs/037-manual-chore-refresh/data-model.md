# Data Model: Manual Chore Refresh

## Modified Entities

### useDailyReset Hook (Modified)

**Current**: `useDailyReset(callbacks): void`
**New**: `useDailyReset(callbacks): { triggerReset: () => void }`

The hook now returns an object with a `triggerReset` function that invokes the same `checkAndReset` logic used by the automatic detection (visibility change + interval). The function is idempotent — calling it when `lastPlayedDate` matches today is a no-op.

### ChorePanel Props (Modified)

**New prop**: `isStale: boolean` — indicates whether chore data is from a previous day
**New prop**: `onRefresh: () => void` — callback to trigger the manual daily reset

### No New Storage

No changes to Firestore documents, localStorage schema, or `ChildProfile` type. The feature reuses existing `lastPlayedDate` comparison and `onReset` callback flow.
