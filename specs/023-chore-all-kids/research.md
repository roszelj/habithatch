# Research: Chore for All Kids

**Feature**: 023-chore-all-kids | **Date**: 2026-04-07

No NEEDS CLARIFICATION items existed in the spec. Research focused on the right integration point within the existing ParentPanel codebase.

## Decision 1 — Broadcast via existing prop vs. new prop

**Decision**: Loop inside `ParentPanel`, calling the existing `onAddChore(profileId, category, name)` prop once per profile.

**Rationale**: `onAddChore` in `Game.tsx` (`handleCrossProfileAddChore`) already routes correctly for any profile ID — including the currently active child and all others. No Game.tsx changes are needed; the loop is purely a UI concern inside the panel.

**Alternatives considered**: New `onAddChoreAllKids` prop — rejected (unnecessary prop drilling and Game.tsx changes for logic a loop handles trivially).

## Decision 2 — Single checkbox vs. per-category toggles

**Decision**: One `forAllKids: boolean` state for the entire manage tab.

**Rationale**: Multi-child parents adding a chore "for all kids" are thinking at the chore level, not the category level. The category is already determined by which form row they type into. One toggle is cleaner on a small mobile screen.

**Alternatives considered**: Per-category `Record<TimeActionType, boolean>` — rejected (three checkboxes adds visual noise for marginal benefit).

## Decision 3 — Confirmation message approach

**Decision**: Inline `confirmMessage` state (string), auto-clears after 2 seconds via `setTimeout`. Displayed inside the manage tab section.

**Rationale**: The bonus tab already uses `bonusMessage` with the same pattern. Consistency within the component is more important than introducing a new notification system.

**Alternatives considered**: Global toast notification system — out of scope, introduces new architectural pattern for a minor UX enhancement.

## Decision 4 — Visibility condition for the checkbox

**Decision**: Show the checkbox only when `profiles.length > 1`. With a single child, the option is meaningless and would add visual clutter.

**Rationale**: The confirmation message "Added to 1 kid!" would be identical to normal single-add behaviour; hiding the checkbox avoids confusion for single-child families.
