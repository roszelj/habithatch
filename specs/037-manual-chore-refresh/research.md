# Research: Manual Chore Refresh

## R1: How to Expose Imperative Reset from useDailyReset

**Decision**: Modify `useDailyReset` to return the `checkAndReset` function so callers can invoke it manually.

**Rationale**: The `checkAndReset` function already contains all the reset logic (date comparison, streak evaluation, day-type detection, chore reset). It's already idempotent — calling it when `lastPlayedDate === today` is a no-op. Returning it from the hook is a one-line change.

**Alternatives considered**:
- Extract reset logic into a standalone utility function: Would duplicate the ref-reading logic or require passing all state manually. More code for no benefit.
- Add a separate `useManualReset` hook: Unnecessary abstraction. The logic is identical to the automatic reset.
- Use a state flag to trigger reset: Indirect, harder to reason about. Direct function call is simpler.

## R2: When to Show the Refresh Button

**Decision**: Show the refresh button when `lastPlayedDate !== getToday()`. Pass `lastPlayedDate` to `ChorePanel` and compute staleness there.

**Rationale**: This is the same condition `checkAndReset` uses to decide whether to reset. If the dates match, the button is hidden (chores already current). If they differ, the button appears. This makes the button perfectly synchronized with the reset logic.

**Alternatives considered**:
- Always show the button with a "chores up to date" state: Adds visual noise. Kids don't need to think about refresh when things are working.
- Show only when chores have completed items AND date is stale: Too restrictive. A new day with no completions but wrong day-type chores also needs refresh.

## R3: Refresh Button Placement and Style

**Decision**: Place the refresh button at the top of the chore panel (above the chore sections), styled as an informational banner with a tap action. Distinct from the existing "Reset All for New Day" button at the bottom.

**Rationale**: The refresh button serves a different purpose than "Reset All" — it's a date-correction action, not a manual override. Placing it at the top ensures visibility when the child first opens the chore view. Banner style communicates "action needed" without looking like a destructive operation.

**Alternatives considered**:
- Replace the existing "Reset All" button: They serve different purposes. "Reset All" is a manual override (any time); refresh is date-driven (only when stale).
- Add a pull-to-refresh gesture: Not supported natively in web without a library. Overengineered for this use case.
