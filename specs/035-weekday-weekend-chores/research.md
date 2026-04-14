# Research: Weekday & Weekend Chores

**Feature**: 035-weekday-weekend-chores
**Date**: 2026-04-11

## Research Questions & Decisions

### R1: Data model approach — two fields vs nested object

**Decision**: Add two new top-level fields `weekdayChores: CategoryChores` and `weekendChores: CategoryChores` to ChildProfile, replacing the existing `chores: CategoryChores` field.

**Rationale**: Two flat fields are the simplest approach and align with how the existing `CategoryChores` type already works. A nested `{ weekday: CategoryChores, weekend: CategoryChores }` wrapper adds indirection for no benefit. The two-field approach means existing code that operates on `CategoryChores` (useChores hook, ChorePanel, ChoreList) requires zero changes to its internal logic — only the caller needs to select which field to pass.

**Alternatives considered**:
- Single `chores` field with a `dayType` property on each chore: Rejected — fundamentally changes the Chore interface, breaks all existing chore logic, and makes queries/filters more complex.
- Wrapper type `{ weekday: CategoryChores, weekend: CategoryChores }`: Rejected — adds a layer of indirection. Every access becomes `chores.weekday.morning` instead of `weekdayChores.morning`. No real benefit.

### R2: How to determine current day type

**Decision**: A pure function `isWeekend(): boolean` that checks `new Date().getDay()` — returns true for Saturday (6) and Sunday (0).

**Rationale**: Simple, deterministic, no state needed. The existing `getToday()` pattern already uses the device's local date. A companion `isWeekend()` function follows the same pattern.

### R3: How daily reset handles the switch

**Decision**: When the day changes, reset only the chore list that is becoming active. The inactive list retains its current state (preserving any mid-progress statuses that don't matter until that day type comes around again).

**Rationale**: Resetting the inactive list would lose information about chores that were in progress (e.g., pending approval). Since the inactive list won't be shown to kids, its status doesn't matter until it becomes active, at which point the next day change will reset it.

**Implementation**: `applyDailyReset` and `useDailyReset` both need to call `resetChoresDone` on only the active day-type's chores. The function signature changes to accept both chore lists and return both, with only the active one reset.

### R4: Streak evaluation with weekday/weekend chores

**Decision**: `allChoresComplete` evaluates against the chore list that is active for the current day type. On a weekday, streak is earned by completing all weekday chores. On a weekend, streak is earned by completing all weekend chores.

**Rationale**: The spec requires "streak completion evaluated against the set of chores that was active on the day being evaluated." Since streak is evaluated in real-time via the `useEffect` in Game.tsx, it naturally checks the active chore list — which is already the one displayed to the kid.

**Edge case**: If the weekend chore list is empty, `allChoresComplete` returns `false` (existing behavior: `all.length > 0 && all.every(...)`). This means kids with no weekend chores cannot earn a streak on weekends. This is acceptable — parents should add weekend chores if they want streak continuity.

### R5: Migration strategy for existing data

**Decision**: In `useSaveData.ts` migration logic, when loading a profile:
1. If `weekdayChores` and `weekendChores` exist → use them (already migrated)
2. If only `chores` exists → copy it to `weekdayChores`, create empty `weekendChores`, delete `chores`

**Rationale**: One-time migration on load. Existing chores become weekday chores (most likely scenario — parents set up chores for school days). Weekend starts empty so parents can explicitly add weekend-specific chores.

### R6: Parent Mode layout for both lists

**Decision**: Parent Mode "Manage Chores" tab shows two clearly labeled sections stacked vertically: "Weekday Chores (Mon-Fri)" and "Weekend Chores (Sat-Sun)". Each section contains the existing morning/afternoon/evening chore management UI. The "Add for all kids" checkbox applies to whichever section the parent is adding to.

**Rationale**: Parents need to see and manage both lists at all times regardless of the current day. Stacking vertically reuses the existing ChorePanel/ChoreList patterns with minimal UI changes.

### R7: useChores hook — one instance or two?

**Decision**: Game.tsx maintains one `useChores` instance for the active day-type's chores. The inactive chore list is stored directly on the profile and updated only through `onUpdateAppData` when needed (e.g., parent adds a chore to the inactive list from Parent Mode).

**Rationale**: The `useChores` hook manages local state for the chores the kid is interacting with right now. There's no need for a second hook instance for chores that aren't being displayed or interacted with. When the day type switches (via daily reset), the new active chores are loaded into the hook via `setChores`.
