# Quickstart: Weekday & Weekend Chores

**Feature**: 035-weekday-weekend-chores
**Date**: 2026-04-11

## Overview

Replace the single `chores` field on ChildProfile with `weekdayChores` and `weekendChores`. Kid mode auto-shows the correct list based on the day of week. Parent mode shows both lists. Daily reset is day-type aware.

## Implementation Order

### Step 1: Update data model

Add `weekdayChores` and `weekendChores` to ChildProfile in `src/models/types.ts`. Add `isWeekend()` and `getActiveChores()` helper functions. Remove the `chores` field from the interface.

### Step 2: Add migration logic

In `src/hooks/useSaveData.ts`, update `loadAppData()` and `applyDailyReset()` to:
- Migrate old `chores` → `weekdayChores` (weekend starts empty)
- Reset only the active day-type's chores on day change

### Step 3: Update useDailyReset hook

Modify `src/hooks/useDailyReset.ts` to pass both chore lists and only reset the one for the new day's type.

### Step 4: Update Game.tsx

- Compute active chores via `isWeekend()` and pass to `useChores`
- Store inactive chores on the profile
- Update all cross-profile chore handlers to target the correct list (weekday or weekend)
- Update `buildProfile` to save both chore lists
- Update `allChoresComplete` calls to use active chores

### Step 5: Update ParentPanel

- Show two labeled sections ("Weekday Chores" and "Weekend Chores") in the Manage Chores tab
- Update add/remove handlers to specify which list
- Update "Add for all kids" to target the correct list
- Update pending chore collection to scan both lists

### Step 6: Update ChorePanel (minor)

- Add a label showing "Weekday Chores" or "Weekend Chores" at the top so kids know which set they're viewing

## Key Files

| File | Action | What changes |
|------|--------|-------------|
| `src/models/types.ts` | MODIFY | Replace `chores` with `weekdayChores`/`weekendChores` on ChildProfile; add `isWeekend()`, `getActiveChores()` |
| `src/hooks/useSaveData.ts` | MODIFY | Migration from old `chores` field; day-type-aware daily reset |
| `src/hooks/useDailyReset.ts` | MODIFY | Accept both chore lists; reset only active day-type |
| `src/hooks/useChores.ts` | NO CHANGE | Already works with any `CategoryChores` instance |
| `src/components/Game.tsx` | MODIFY | Select active chores by day type; update cross-profile handlers |
| `src/components/ChorePanel.tsx` | MODIFY | Add day-type label header |
| `src/components/ParentPanel.tsx` | MODIFY | Show both weekday/weekend sections in Manage tab; scan both for pending |

## Testing

1. Open chores on a weekday → only weekday chores shown
2. Open chores on a weekend → only weekend chores shown
3. Add weekday chore in Parent Mode → appears in weekday list, not weekend
4. Add weekend chore in Parent Mode → appears in weekend list, not weekday
5. Complete all weekday chores on a weekday → streak increments
6. App open across Friday→Saturday midnight → chores switch to weekend list
7. Existing user upgrades → old chores appear as weekday chores, weekend is empty
8. "Add for all kids" → chore added to correct day-type for all children
