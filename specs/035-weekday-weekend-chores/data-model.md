# Data Model: Weekday & Weekend Chores

**Feature**: 035-weekday-weekend-chores
**Date**: 2026-04-11

## Modified Entities

### ChildProfile

**Removed field**:

| Field  | Type           | Notes                                    |
|--------|----------------|------------------------------------------|
| chores | CategoryChores | Replaced by weekdayChores + weekendChores |

**Added fields**:

| Field          | Type           | Description                                       |
|----------------|----------------|---------------------------------------------------|
| weekdayChores  | CategoryChores | Chores active Monday through Friday (morning/afternoon/evening) |
| weekendChores  | CategoryChores | Chores active Saturday and Sunday (morning/afternoon/evening) |

Both fields use the existing `CategoryChores` type (`{ morning: Chore[], afternoon: Chore[], evening: Chore[] }`). No changes to `Chore`, `ChoreStatus`, or `CategoryChores` types.

### No new types required

The existing `CategoryChores` type is reused for both fields. The day-type determination is a runtime function, not persisted state.

## New Helper Functions

| Function      | Signature                | Description                                          |
|---------------|--------------------------|------------------------------------------------------|
| isWeekend     | `() => boolean`          | Returns true if current device day is Saturday or Sunday |
| getActiveChores | `(profile: ChildProfile) => CategoryChores` | Returns weekendChores if isWeekend(), else weekdayChores |

## Migration Logic

**Trigger**: Profile load (localStorage or Firestore)

**Rules**:
1. If profile has `weekdayChores` and `weekendChores` → already migrated, use as-is
2. If profile has `chores` but no `weekdayChores` → copy `chores` to `weekdayChores`, set `weekendChores` to empty `CategoryChores`
3. New profiles → both fields initialized to empty `CategoryChores`

## Data Flow Changes

### Kid Mode (Chores Screen)
1. `isWeekend()` determines active day type
2. Game.tsx passes `getActiveChores(profile)` to `useChores` hook
3. Kid sees only active list
4. Points/coins earned from either list work identically

### Parent Mode (Manage Chores)
1. Parent sees both `weekdayChores` and `weekendChores` in labeled sections
2. Adding a chore specifies which list it goes to
3. "Add for all kids" adds to the specified list for every child

### Daily Reset
1. `applyDailyReset` and `useDailyReset` determine the day type for the new day
2. Only the active day-type's chores are reset to `unchecked`
3. The inactive day-type's chores are left unchanged

### Streak Completion
1. `allChoresComplete` is called with the active day-type's chore list
2. If weekend list is empty, streak cannot be earned on weekends (by design — `all.length > 0` check)

## Firestore Impact

- `families/{fid}/profiles/{pid}` document gains `weekdayChores` and `weekendChores` fields
- Old `chores` field is no longer read after migration
- No schema changes to Firestore rules needed (Firestore is schemaless)
- Cloud listeners (`onProfileSnapshot`, `onAllProfilesSnapshot`) pass through the new fields transparently as part of ChildProfile
