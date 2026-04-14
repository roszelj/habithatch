# Feature Specification: Manual Chore Refresh

**Feature Branch**: `037-manual-chore-refresh`
**Created**: 2026-04-13
**Status**: Draft
**Input**: User description: "Add the ability for the child to refresh the chore list for the delay in the case it doesn't happen when a new day starts"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Child Manually Refreshes Chores for New Day (Priority: P1)

A child opens the app and notices their chore list still shows yesterday's completed chores. The automatic daily reset did not fire (e.g., the app was left open overnight without a tab visibility change, or the 60-second interval check missed the midnight boundary). The child taps a visible "Refresh" button on the chore panel to trigger the daily reset manually, which clears yesterday's completions and loads the correct day-type chores (weekday or weekend) for today.

**Why this priority**: This is the core ask — ensuring kids always have a way to get a fresh chore list when the automatic reset fails or is delayed. Without this, kids may be stuck with stale chore data and unable to start their day.

**Independent Test**: Open the app, complete some chores, manually change the device clock to the next day (or wait until after midnight with the app open), and verify the refresh button appears and correctly resets chores for the new day type.

**Acceptance Scenarios**:

1. **Given** the app is open and it is a new calendar day but the automatic reset has not fired, **When** the child taps the refresh button, **Then** the chore list resets to unchecked for the current day type (weekday or weekend), the streak is correctly evaluated, and the last-played date updates to today.
2. **Given** the app is open and chores have already been reset for today, **When** the child views the chore panel, **Then** the refresh button is either hidden or visually indicates chores are already up to date (no accidental double-reset).
3. **Given** the child is on a weekend and taps refresh, **When** the reset fires, **Then** weekend chores are loaded and reset (not weekday chores).
4. **Given** parent mode is active, **When** the child views the chore panel, **Then** the refresh button is still accessible since this is a date-based correction, not a manual chore override.

---

### Edge Cases

- What happens if the child taps refresh multiple times in a row? Only the first tap should trigger a reset; subsequent taps on the same day should be no-ops.
- What happens if the child refreshes and has pending (awaiting parent approval) chores from yesterday? Pending chores from a previous day should be cleared along with approved ones during the day-change reset.
- What if the automatic reset fires right after the child taps refresh? The reset is idempotent — running it twice for the same day produces the same result.
- What if the device clock is wrong or set to a past date? The refresh uses the same date comparison logic as the existing daily reset — if the device date matches the last-played date, no reset occurs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The chore panel MUST display a refresh button that allows the child to manually trigger the daily chore reset logic.
- **FR-002**: The refresh button MUST be visible whenever the current date differs from the stored last-played date, indicating a new day has started but the reset has not yet fired.
- **FR-003**: Tapping the refresh button MUST execute the same reset logic as the automatic daily reset: clear chore completions for the active day type, evaluate the streak, and update the last-played date to today.
- **FR-004**: The refresh button MUST be a no-op (or hidden) when chores have already been reset for the current day.
- **FR-005**: The refresh action MUST correctly determine whether to reset weekday or weekend chores based on the current day of the week.
- **FR-006**: The refresh button MUST remain accessible regardless of whether parent mode is active, since this is a date-driven correction, not a manual chore override.
- **FR-007**: The refresh action MUST persist the reset state (updated chores, streak, and last-played date) through the existing save mechanism.

### Key Entities

- **ChorePanel**: Existing UI component that displays the child's chore list — gains a new refresh button.
- **Daily Reset Logic**: Existing mechanism that resets chore completions at the start of each new day — reused by the manual refresh action.
- **Last-Played Date**: Existing date string tracking when chores were last reset — used to determine if refresh is needed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A child can reset their chore list for a new day within 1 tap when the automatic reset has not fired.
- **SC-002**: The refresh button correctly appears only when chores are stale (new day, reset not yet applied) and disappears or becomes inert after the reset completes.
- **SC-003**: After manual refresh, the chore list matches what the automatic reset would have produced (same chores reset, same streak evaluation, same day-type selection).
- **SC-004**: No data loss occurs — the refresh does not affect the opposite day-type's chores (e.g., refreshing on a weekday does not clear weekend chore progress).

## Assumptions

- The existing daily reset logic can be triggered imperatively (not just via timer/visibility events).
- The refresh button uses the same visual style as existing chore panel actions to maintain UI consistency.
- The feature targets the child view only — parents already have broader reset controls in the parent panel.
- The 60-second automatic reset interval and visibility-change detection remain in place as the primary reset mechanism; the manual button is a fallback for edge cases.
